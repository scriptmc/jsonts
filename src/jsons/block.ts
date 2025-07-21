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
} from "./types/block/block.js";
import path from "node:path";
import fs from "node:fs";
import { TerrainTextureFile } from "./types/block/terrain_texture.js";
import { Block as block } from "./types/block/blocks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class Block
 * @example
 * ```ts
 * import { Block } from "@scriptmc/jsonts";
 *
 * const block = new Block();
 *
 * block.setIdentifier("id:name");
 * block.setMenuCategory("construction");
 * block.addState("custom:is_lit", [true, false]);
 *
 * block.addComponent("minecraft:friction", 0.6);
 * block.addComponent("minecraft:map_color", "#00FF00");
 *
 * block.addPermutation(`query.block_state("custom:is_lit") == true`, {
 *  "minecraft:light_emission": 15,
 * });
 * block.addPermutation(`query.block_state("custom:is_lit") == false`, {
 *  "minecraft:light_emission": 0,
 * });
 *
 * block.addTexture("blockTextureUp", "textures/blocks/block_texture_up");
 * block.addTexture("blockTextureDown", "textures/blocks/block_texture_down");
 * block.addTexture("blockTextureSide", "textures/blocks/block_texture_side");
 *
 * block.setBlock("blockTexture", {
 *  textures: {
 *    up: "blockTextureUp",
 *    down: "blockTextureDown",
 *    side: "blockTextureSide",
 *  },
 * });
 *
 * block.create();
 * ```
 */
export class Block {
  private data: BlockBehavior = {
    format_version: "1.21.90",
    "minecraft:block": {
      // @ts-expect-error
      description: {},
      components: {},
    },
  };
  private terrain_texture: TerrainTextureFile = {
    resource_pack_name: "@scriptmc",
    texture_name: "atlas.terrain",
    texture_data: {},
  };
  private blocks: { [key: string]: object } = {};
  private name: string = "";
  constructor() {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".jt.js"))
      throw new Error("can only be called in files .jt.ts");
    setTimeout(() => this.create(), 1000);
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.setIdentifier("id:name");
   * block.create();
   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/[a-zA-Z]+:\w+|@name<\w+>/))
      throw new Error(`Identifier "${value}" invalid. ex: "id:name"`);
    this.name = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1].replace(":", "_")
      : value.replace(":", "_");
    this.data["minecraft:block"].description.identifier = value
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
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.setMenuCategory("construction", "itemGroup.name.anvil");
   * block.create();
   * ```
   */
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
  /**
   * @param value Traits <object>
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.setTraits({
   *  "minecraft:placement_direction": {
   *      enabled_states: [
   *          "minecraft:cardinal_direction",
   *          "minecraft:facing_direction",
   *      ],
   *      y_rotation_offset: 0,
   *  },
   *  "minecraft:placement_position": {
   *      enabled_states: ["minecraft:block_face", "minecraft:vertical_half"],
   *  },
   * });
   * block.create();
   * ```
   */
  setTraits(value: Traits) {
    this.data["minecraft:block"].description.traits = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.addTexture("block_up", "textures/blocks/block_up");
   * block.addTexture("block_down", "textures/blocks/block_down");
   * block.addTexture("block_side", "textures/blocks/block_side");
   * block.create();
   * ```
   */
  addTexture(name: string, value: string) {
    if (!Object.keys(this.terrain_texture).includes("texture_data"))
      this.terrain_texture.texture_data = {};
    this.terrain_texture.texture_data![name] = { textures: value };
    return this;
  }
  /**
   * @param name string
   * @param value Block <object>
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.setBlock("block", {
   *  textures: {
   *    up: "block_up",
   *    down: "block_down",
   *    side: "block_side"
   *  }
   * });
   * block.create();
   * ```
   */
  setBlock(name: string, value: block) {
    this.blocks = {};
    this.blocks[name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value State <Array | Object>
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.addState("state:custom_state", [true, false]);
   * block.create();
   * ```
   */
  addState(name: string, value: State) {
    if (
      !Object.keys(this.data["minecraft:block"].description).includes("states")
    )
      this.data["minecraft:block"].description.states = {};
    this.data["minecraft:block"].description.states![name] = value;
    return this;
  }
  /**
   * @param name Component <string>
   * @param value Component[name]
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.addComponent("minecraft:friction", 0.6);
   * block.addComponent("minecraft:map_color", "#00FF00");
   * block.create();
   * ```
   */
  addComponent<Block extends keyof Component | (string & {})>(
    name: Block,
    // @ts-expect-error
    value: Component[Block]
  ) {
    // @ts-expect-error
    this.data["minecraft:block"].components[name] = value;
    return this;
  }
  /**
   * @param condition Condition <string>
   * @param components Component1 <object>
   * @example
   * ```ts
   * import { Block } from "@scriptmc/jsonts";
   * const block = new Block();
   * block.addPermutation(`query.block_state("custom:is_lit") == true`, {
   *  "minecraft:light_emission": 15,
   * });
   * block.addPermutation(`query.block_state("custom:is_lit") == false`, {
   *  "minecraft:light_emission": 0,
   * });
   * block.create();
   * ```
   */
  addPermutation(condition: Condition, components: Component1) {
    if (!Object.keys(this.data["minecraft:block"]).includes("permutations"))
      this.data["minecraft:block"].permutations = [];
    this.data["minecraft:block"].permutations?.push({ condition, components });
    return this;
  }
  private async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (!fs.existsSync(path.join(__dirname, "../../executes/beh/blocks")))
        fs.mkdirSync(path.join(__dirname, "../../executes/beh/blocks"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/beh/blocks/${this.name}.json`),
        JSON.stringify(this.data)
      );
      if (Object.keys(this.terrain_texture.texture_data!).length <= 0) return;
      fs.writeFileSync(
        path.join(
          __dirname,
          `../../executes/${this.name}.terrain_texture.json`
        ),
        JSON.stringify(this.terrain_texture)
      );
      if (Object.keys(this.blocks).length <= 0) return;
      fs.writeFileSync(
        path.join(__dirname, `../../executes/${this.name}.blocks.json`),
        JSON.stringify(this.blocks)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
