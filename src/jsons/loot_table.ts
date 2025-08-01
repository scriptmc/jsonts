import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SinglePool, LootTable as lt } from "./types/loot_table";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class LootTable
 * @example
 * ```ts
 * import { LootTable } from "@scriptmc/jsonts";
 *
 * const lt = new LootTable("name");
 *
 * lt.addPool({
 *  rolls: 1,
 *  entries: [
 *      {
 *          type: "item",
 *          name: "id:name",
 *          functions: [
 *              {
 *                  function: "set_count",
 *                  count: {
 *                      min: 5,
 *                      max: 5
 *                  }
 *              }
 *          ]
 *      }
 *  ]
 * });
 *
 * ```
 */
export class LootTable {
  private data: lt = {};
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
   * @param value "minecraft:chest"
   * @example
   * ```ts
   * import { LootTable } from "@scriptmc/jsonts";
   *
   * const lt = new LootTable("name");
   *
   * lt.setType("minecraft:chest");
   *
   * ```
   */
  setType(value: "minecraft:chest") {
    this.data.type = value;
    return this;
  }
  /**
   * @param value SinglePool <object>
   * @example
   * ```ts
   * import { LootTable } from "@scriptmc/jsonts";
   *
   * const lt = new LootTable("name");
   *
   * lt.addPool({
   *  rolls: 1,
   *  entries: [
   *      {
   *          type: "item",
   *          name: "id:name",
   *          functions: [
   *              {
   *                  function: "set_count",
   *                  count: {
   *                      min: 5,
   *                      max: 5
   *                  }
   *              }
   *          ]
   *      }
   *  ]
   * });
   *
   * ```
   */
  addPool(value: SinglePool) {
    if (!Object.keys(this.data).includes("pools")) this.data.pools = [];
    this.data.pools?.push(value);
    return this;
  }
  private async create(name: string) {
    try {
      if (
        !fs.existsSync(path.join(__dirname, "../../executes/beh/loot_tables"))
      )
        fs.mkdirSync(path.join(__dirname, "../../executes/beh/loot_tables"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/beh/loot_tables/${name}.json`),
        JSON.stringify(this.data, null, 2)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
