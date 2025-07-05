import { fileURLToPath } from "node:url";
import {
  Component,
  BlockBehavior,
  Category,
  Group,
  Traits,
  State,
  Condition,
  Component1,
} from "./types/block.js";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Block {
  private static classCalled: boolean = false;
  private data: BlockBehavior = {
    format_version: "1.21.90",
    "minecraft:block": {
      // @ts-expect-error
      description: {},
      components: {},
    },
  };
  constructor() {
    if (Block.classCalled) {
      fs.rmSync(path.join(__dirname, "../../block.json"), {
        force: true,
        recursive: true,
      });
      throw new Error(
        "You can only create one instance of Block using `new Block()`."
      );
    }
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".block.js"))
      throw new Error("block class can only be called in files .block.ts");
    Block.classCalled = true;
  }
  setIdentifier(value: string) {
    this.data["minecraft:block"].description.identifier = value;
    return this;
  }
  setMenuCategory(
    category: Category,
    group?: Group,
    is_hidden_in_commands?: boolean
  ) {
    this.data["minecraft:block"].description.menu_category = {
      category,
      group,
      is_hidden_in_commands,
    };
    return this;
  }
  setTraits(value: Traits) {
    this.data["minecraft:block"].description.traits = value;
    return this;
  }
  addState(name: string, value: State) {
    this.data["minecraft:block"].description.states = {};
    this.data["minecraft:block"].description.states[name] = value;
    return this;
  }
  addComponent<Block extends keyof Component | (string & {})>(
    name: Block,
    // @ts-expect-error
    value: Component[Block]
  ) {
    // @ts-expect-error
    this.data["minecraft:block"].components[name] = value;
    return this;
  }
  addPermutation(condition: Condition, components: Component1) {
    this.data["minecraft:block"].permutations = [
      ...this.data["minecraft:block"].permutations!,
      { condition, components },
    ];
    return this;
  }
  async create() {
    try {
      fs.writeFileSync(
        path.join(__dirname, "../../block.json"),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
