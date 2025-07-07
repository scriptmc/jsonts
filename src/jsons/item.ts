import path from "node:path";
import { Category, Component, Group, Item as item } from "./types/item/item.js";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ItemTextureFile } from "./types/item/item_texture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  setIdentifier(value: string) {
    if (!value.match(/[a-zA-Z]+:\w+/))
      throw new Error(`Identifier "${value}" invalid. ex: "id:name"`);
    this.name = value.replace(":", "_");
    this.data["minecraft:item"].description.identifier = value;
    return this;
  }
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
  setIsExperimental(value: boolean) {
    this.data["minecraft:item"].description.is_experimental = value;
    return this;
  }
  setTexture(name: string, value: string) {
    this.item_texture.texture_data = {};
    this.item_texture.texture_data[name] = { textures: value };
    return this;
  }
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
      fs.writeFileSync(
        path.join(__dirname, `../../executes/${this.name}.item.json`),
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
