import path from "node:path";
import { Category, Component, Group, Item as item } from "./types/item/item.js";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ItemTextureFile } from "./types/item/item_texture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class Item
 * @example
 * ```ts
 * import { Item } from "@scriptmc/jsonts";
 *
 * const item = new Item();
 *
 * item.setIdentifier("id:name");
 * item.setMenuCategory("items");
 *
 * item.addComponent("minecraft:icon", "itemTexture");
 * item.addComponent("minecraft:display_name", { value: "name" });
 *
 * item.setTexture("itemTexture", "textures/items/item_texture");
 *
 * item.create();
 * ```
 */
export class Item {
  private data: item = {
    format_version: "1.21.90",
    "minecraft:item": {
      description: {},
      components: {},
    },
  };
  private item_texture: ItemTextureFile = {
    resource_pack_name: "@scriptmc",
    texture_name: "atlas.items",
    texture_data: {},
  };
  private name: string = "";
  constructor() {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".jt.js"))
      throw new Error("can only be called in files .jt.ts");
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Item } from "@scriptmc/jsonts";
   * const item = new Item();
   * item.setIdentifier("id:name");
   * item.create();
   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/[a-zA-Z]+:\w+|@name<\w+>/))
      throw new Error(`Identifier "${value}" invalid. ex: "id:name"`);
    this.name = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1].replace(":", "_")
      : value.replace(":", "_");
    this.data["minecraft:item"].description.identifier = value
      .replace(/@name[<]/g, "")
      .replace(/[>]/g, "");
    return this;
  }
  /**
   * @param category Category <string>
   * @param group Group <string> (optional)
   * @param is_hidden_in_commands boolean (optional)
   * @example
   * ```ts
   * import { Item } from "@scriptmc/jsonts";
   * const item = new Item();
   * item.setMenuCategory("items", "ItemGroup.name.anvil");
   * item.create();
   * ```
   */
  setMenuCategory(
    category: Category,
    group?: Group,
    is_hidden_in_commands?: boolean
  ) {
    this.data["minecraft:item"].description.menu_category = {
      category,
      group,
      is_hidden_in_commands,
    };
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Item } from "@scriptmc/jsonts";
   * const item = new Item();
   * item.setIsExperimental(true);
   * item.create();
   * ```
   */
  setIsExperimental(value: boolean) {
    this.data["minecraft:item"].description.is_experimental = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Item } from "@scriptmc/jsonts";
   * const item = new Item();
   * item.setTexture("custom_item", "textures/items/custom_item");
   * item.create();
   * ```
   */
  setTexture(name: string, value: string) {
    this.item_texture.texture_data = {};
    this.item_texture.texture_data[name] = { textures: value };
    return this;
  }
  /**
   * @param name Component <string>
   * @param value Component[name]
   * @example
   * ```ts
   * import { Item } from "@scriptmc/jsonts";
   * const item = new Item();
   * item.addComponent("minecraft:icon", "texture");
   * item.addComponent("minecraft:display_name", { value: "name" });
   * item.create();
   * ```
   */
  addComponent<Item extends keyof Component | (string & {})>(
    name: Item,
    // @ts-expect-error
    value: Component[Item]
  ) {
    // @ts-expect-error
    this.data["minecraft:item"].components[name] = value;
    return this;
  }
  async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (!fs.existsSync(path.join(__dirname, "../../executes/beh/items")))
        fs.mkdirSync(path.join(__dirname, "../../executes/beh/items"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/beh/items/${this.name}.json`),
        JSON.stringify(this.data)
      );
      if (Object.keys(this.item_texture.texture_data!).length <= 0) return;
      fs.writeFileSync(
        path.join(__dirname, `../../executes/${this.name}.item_texture.json`),
        JSON.stringify(this.item_texture)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
