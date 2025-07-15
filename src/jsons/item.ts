import path from "node:path";
import { Category, Component, Group, Item as item } from "./types/item/item.js";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ItemTextureFile } from "./types/item/item_texture.js";
import {
  Attachables_1_10_0,
  Material,
  Scripts,
} from "./types/item/attachables.js";

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

export class Attachable {
  private data: Attachables_1_10_0 = {
    format_version: "1.10.0",
    "minecraft:attachable": {
      description: {},
    },
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
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.setIdentifier("id:name");
   * att.create();
   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/[a-zA-Z]+:\w+|@name<\w+>/))
      throw new Error(`Identifier "${value}" invalid. ex: "id:name"`);
    this.name = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1].replace(":", "_")
      : value.replace(":", "_");
    this.data["minecraft:attachable"].description.identifier = value
      .replace(/@name[<]/g, "")
      .replace(/[>]/g, "");
    return this;
  }
  /**
   * @param name string
   * @param value Material <string>
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addMaterial("default", "entity_alphatest");
   * att.create();
   * ```
   */
  addMaterial(name: string, value: Material | (string & {})) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "materials"
      )
    )
      this.data["minecraft:attachable"].description.materials = {};
    // @ts-expect-error
    this.data["minecraft:attachable"].description.materials![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addTexture("default", "textures/items/custom_item");
   * att.create();
   * ```
   */
  addTexture(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "textures"
      )
    )
      this.data["minecraft:attachable"].description.textures = {};
    this.data["minecraft:attachable"].description.textures![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addGeometry("default", "geometry.item");
   * att.create();
   * ```
   */
  addGeometry(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "geometry"
      )
    )
      this.data["minecraft:attachable"].description.geometry = {};
    this.data["minecraft:attachable"].description.geometry![name] = value;
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addRenderController("controller.render.item");
   * att.create();
   * ```
   */
  addRenderController(value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "render_controllers"
      )
    )
      this.data["minecraft:attachable"].description.render_controllers = [];
    this.data["minecraft:attachable"].description.render_controllers?.push(
      value
    );
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addAnimationController("name", "controller.animation.name");
   * att.create();
   * ```
   */
  addAnimationController(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "animation_controllers"
      )
    )
      // @ts-expect-error
      this.data["minecraft:attachable"].description.animation_controllers = {};
    // @ts-expect-error
    this.data["minecraft:attachable"].description.animation_controllers![name] =
      value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addAnimation("name", "animation.name");
   * attt.create();
   * ```
   */
  addAnimation(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "animations"
      )
    )
      this.data["minecraft:attachable"].description.animations = {};
    this.data["minecraft:attachable"].description.animations![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addItem("name", "value");
   * att.create();
   * ```
   */
  addItem(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "item"
      )
    )
      this.data["minecraft:attachable"].description.item = {};
    this.data["minecraft:attachable"].description.item![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addParticleEffects("name", "value");
   * att.create();
   * ```
   */
  addParticleEffects(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "particle_effects"
      )
    )
      this.data["minecraft:attachable"].description.particle_effects = {};
    this.data["minecraft:attachable"].description.particle_effects![name] =
      value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addParticleEmitters("name", "value");
   * att.create();
   * ```
   */
  addParticleEmitters(name: string, value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "particle_emitters"
      )
    )
      this.data["minecraft:attachable"].description.particle_emitters = {};
    this.data["minecraft:attachable"].description.particle_emitters![name] =
      value;
    return this;
  }
  /**
   * @param name Scripts <string>
   * @param value Scripts[name]
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addScript("animate", ["name"]);
   * att.create();
   * ```
   */
  addScript<Script extends keyof Scripts>(
    name: Script,
    value: Scripts[Script]
  ) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "scripts"
      )
    )
      this.data["minecraft:attachable"].description.scripts = {};
    this.data["minecraft:attachable"].description.scripts![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.addSoundEffect("name");
   * att.create();
   * ```
   */
  addSoundEffect(value: string) {
    if (
      !Object.keys(this.data["minecraft:attachable"].description).includes(
        "sound_effects"
      )
    )
      this.data["minecraft:attachable"].description.sound_effects = [];
    this.data["minecraft:attachable"].description.sound_effects?.push(value);
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.setEnableAttachables(true);
   * att.create();
   * ```
   */
  setEnableAttachables(value: boolean) {
    this.data["minecraft:attachable"].description.enable_attachables = value;
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.setMinEngineVersion("value");
   * att.create();
   * ```
   */
  setMinEngineVersion(value: string) {
    this.data["minecraft:attachable"].description.min_engine_version = value;
    return this;
  }
  /**
   * @param base_color string
   * @param overlay_color string
   * @param texture string (optional)
   * @param texture_index number (optional)
   * @example
   * ```ts
   * import { Attachable } from "@scriptmc/jsonts";
   * const att = new Attachable();
   * att.setSpawnEgg("#288483", "#2B7135");
   * att.create();
   * ```
   */
  setSpawnEgg(
    base_colour: string,
    overlay_color: string,
    texture?: string,
    texture_index?: number
  ) {
    this.data["minecraft:attachable"].description.spawn_egg = {
      base_colour,
      overlay_color,
      texture,
      texture_index,
    };
    return this;
  }
  async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (
        !fs.existsSync(path.join(__dirname, "../../executes/reh/attachables"))
      )
        fs.mkdirSync(path.join(__dirname, "../../executes/reh/attachables"));
      fs.writeFileSync(
        path.join(
          __dirname,
          `../../executes/reh/attachables/${this.name}.json`
        ),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
