import fs from "node:fs";
import path from "node:path";
import { Languages } from "./types/lang";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class Lang
 * @class Item
 * @example
 * ```ts
 * import { Item } from "@scriptmc/jsonts";
 * import { Lang } from "@scriptmc/jsonts";
 *
 * const item = new Item();
 * const lang = new Lang();
 *
 * lang.addLang("item.id:name", "Name English");
 * lang.create("en_US");
 *
 * lang.addLang("item.id:name", "Nome Português");
 * lang.create("pt_BR");
 *
 * item.setIdentifier("id:name");
 * item.setMenuCategory("items");
 *
 * item.addComponent("minecraft:icon", "itemTexture");
 *
 * item.setTexture("itemTexture", "textures/items/item_texture");
 *
 * item.create();
 * ```
 */
export class Lang {
  private data: string[] = [];
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
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Lang } from "@scriptmc/jsonts";
   *
   * const lang = new Lang();
   * lang.addLang("item.name", "Name");
   * lang.create("en_US");
   * ```
   */
  addLang(name: string, value: string) {
    this.data.push(`${name}=${value}`);
    return this;
  }
  async create(name: Languages) {
    try {
      if (!fs.existsSync(path.join(__dirname, "../../executes/reh/texts")))
        fs.mkdirSync(path.join(__dirname, "../../executes/reh/texts"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/reh/texts/${name}.lang`),
        this.data.join("\n")
      );
    } catch (err) {
      console.error(err);
    }
  }
}
