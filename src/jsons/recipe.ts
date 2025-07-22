import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Recipe as Rep } from "./types/recipe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class Recipe
 * @example
 * ```ts
 * import { Recipe } from "@scriptmc/jsonts";
 *
 * const recipe = new Recipe("name");
 *
 * recipe.addRecipe("minecraft:recipe_shaped", {
 *  description: {
 *    identifier: "id:name"
 *  },
 *  tags: ["crafting_table"],
 *  pattern: [
 *    "DDD",
 *    "DAD",
 *    "DDD"
 *  ],
 *  key: {
 *    D: {
 *      item: "minecraft:diamond"
 *    },
 *    A: {
 *      item: "minecraft:apple"
 *    }
 *  },
 *  result: {
 *    item: "minecraft:chest",
 *    count: 1
 *  }
 * });
 *
 * ```
 */
export class Recipe {
  private data: Rep = {
    format_version: "1.12",
  };
  constructor(value: string) {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".jt.js"))
      throw new Error("can only be called in files .jt.js");
    setTimeout(() => this.create(value), 1000);
  }
  /**
   * @param type recipe <string>
   * @param value Rep[type] <object>
   * @example
   * ```ts
   * import { Recipe } from "@scriptmc/jsonts";
   *
   * const recipe = new Recipe("name");
   *
   * recipe.addRecipe("minecraft:recipe_shaped", {
   *  description: {
   *    identifier: "id:name"
   *  },
   *  tags: ["crafting_table"],
   *  pattern: [
   *    "DDD",
   *    "DAD",
   *    "DDD"
   *  ],
   *  key: {
   *    D: {
   *      item: "minecraft:diamond"
   *    },
   *    A: {
   *      item: "minecraft:apple"
   *    }
   *  },
   *  result: {
   *    item: "minecraft:chest",
   *    count: 1
   *  }
   * });
   *
   * ```
   */
  addRecipe<recipe extends Exclude<keyof Rep, "format_version">>(
    type: recipe,
    value: Rep[recipe]
  ) {
    this.data[type] = value;
    return this;
  }
  private async create(name: string) {
    try {
      if (!fs.existsSync(path.join(__dirname, "../../executes/beh/recipes")))
        fs.mkdirSync(path.join(__dirname, "../../executes/beh/recipes"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/beh/recipes/${name}.json`),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
