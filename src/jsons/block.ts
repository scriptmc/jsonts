import { fileURLToPath } from "node:url";
import {
  BlockDescription,
  Component,
  Permutation,
  BlockBehavior,
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
  private description: boolean = false;
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
  setDescription({
    identifier,
    menu_category,
    states,
    traits,
  }: BlockDescription) {
    if (this.description)
      throw new Error("setDescription can only be called once per block.");
    this.data["minecraft:block"].description.identifier = identifier;
    this.data["minecraft:block"].description.menu_category = menu_category;
    this.data["minecraft:block"].description.states = states;
    this.data["minecraft:block"].description.traits = traits;
    this.description = true;
    return this;
  }
  addComponent<Block extends keyof Component | (string & {})>(
    name: Block,
    // @ts-expect-error
    value: Component[Block]
  ) {
    // @ts-expect-error
    this.data["minecraft:block"].components[name] = {};
    // @ts-expect-error
    this.data["minecraft:block"].components[name] = value;
    return this;
  }
  addPermumation({ components, condition }: Permutation) {
    this.data["minecraft:block"].permutations = [
      ...this.data["minecraft:block"].permutations!,
      { components, condition },
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
