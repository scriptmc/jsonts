import path from "node:path";
import { Component, Description, Item as item } from "./types/item.js";
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
  private description: boolean = false;
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
  setDescription({ identifier, menu_category, is_experimental }: Description) {
    if (this.description)
      throw new Error("setDescription can only be called once per item.");
    this.data["minecraft:item"].description.identifier = identifier;
    this.data["minecraft:item"].description.menu_category = menu_category;
    this.data["minecraft:item"].description.is_experimental = is_experimental;
    this.description = true;
    return this;
  }
  addComponent<Item extends keyof Component | (string & {})>(
    name: Item,
    // @ts-expect-error
    value: Component[Item]
  ) {
    // @ts-expect-error
    this.data["minecraft:item"].components[name] = {};
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
