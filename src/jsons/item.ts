import path from "node:path";
import { Category, Component, Group, Item as item } from "./types/item.js";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Item {
  private static classCalled: boolean = false;
  private data: item = {
    format_version: "1.21.90",
    "minecraft:item": {
      description: {},
      components: {},
    },
  };
  constructor() {
    if (Item.classCalled) {
      fs.rmSync(path.join(__dirname, "../../item.json"), {
        force: true,
        recursive: true,
      });
      throw new Error(
        "You can only create one instance of Item using `new Item()`."
      );
    }
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".item.js"))
      throw new Error("item class can only be called in files .item.ts");
    Item.classCalled = true;
  }
  setIdentifier(value: string) {
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
      fs.writeFileSync(
        path.join(__dirname, "../../item.json"),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
