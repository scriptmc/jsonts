import path from "node:path";
import fs from "node:fs";
import type {
  Component,
  ComponentGroups,
  Events,
  EntityBehavior,
  EIHEventBase,
  SpawnCategory,
  Scripts,
  Animate,
  Experimental,
} from "./types/entity/entity-bp.js";
import { fileURLToPath } from "node:url";
import {
  EntityResource,
  Material,
  Scripts as ScriptsRP,
} from "./types/entity/entity-rp.js";
import {
  A,
  Arrays,
  B,
  G,
  Materials2,
  Offset,
  PartVisibility1,
  R,
  RenderControllers,
  Scale,
} from "./types/entity/render_controllers.js";
import {
  AnimationState as AnimStateRP,
  AnimationController as AnimControlRP,
} from "./types/entity/animation_controller_rp.js";
import {
  AnimationState as AnimStateBP,
  AnimationController as AnimControlBP,
} from "./types/entity/animation_controller_bp.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @class Entity
 * @example
 * ```ts
 * import { Entity } from "@scriptmc/jsonts";
 *
 * const entity = new Entity();
 *
 * entity.setIdentifier("id:name");
 * entity.setSpawnable(true);
 * entity.setSummonable(true);
 *
 * entity.addComponentGroup("physics", {
 *  "minecraft:physics": { has_collision: true, has_gravity: true },
 * });
 *
 * entity.addComponent("minecraft:nameable", { always_show: true });
 *
 * entity.addEvent("addPhysics", {
 *  add: {
 *    component_groups: "physics",
 *  },
 * });
 * entity.addEvent("removePhysics", {
 *  remove: {
 *    component_groups: "physics",
 *  },
 * });
 *
 * entity.addMaterial("default", "entity_custom");
 * entity.addTexture("default", "textures/entity/entity");
 * entity.addGeometry("default", "geometry.entity");
 * entity.addRenderController("controller.render.name");
 * entity.setSpawnEgg("#288483", "#2B7135");
 *
 * ```
 */
export class Entity {
  private dataBP: EntityBehavior = {
    format_version: "1.21.90",
    "minecraft:entity": {
      // @ts-expect-error
      description: {},
      components: {},
    },
  };
  private dataRP: EntityResource = {
    format_version: "1.10.0",
    "minecraft:client_entity": {
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
      throw new Error("can only be called in files .jt.js");
    setTimeout(() => this.create(), 1000);
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setIdentifier("id:name");

   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/[a-zA-Z]+:\w+|@name<\w+>/))
      throw new Error(`Identifier "${value}" invalid. ex: "id:name"`);
    this.name = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1].replace(":", "_")
      : value.replace(":", "_");
    this.dataBP["minecraft:entity"].description.identifier = value
      .replace(/@name[<]/g, "")
      .replace(/[>]/g, "");
    this.dataRP["minecraft:client_entity"].description.identifier = value
      .replace(/@name[<]/g, "")
      .replace(/[>]/g, "");
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setSpawnable(true);

   * ```
   */
  setSpawnable(value: boolean) {
    this.dataBP["minecraft:entity"].description.is_spawnable = value;
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setSummonable(true);

   * ```
   */
  setSummonable(value: boolean) {
    this.dataBP["minecraft:entity"].description.is_summonable = value;
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setIsExperimental(true);

   * ```
   */
  setIsExperimental(value: boolean) {
    this.dataBP["minecraft:entity"].description.is_experimental = value;
    return this;
  }
  /**
   * @param value SpawnCategory <string>
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setSpawnCategory("creature");

   * ```
   */
  setSpawnCategory(value: SpawnCategory) {
    this.dataBP["minecraft:entity"].description.spawn_category = value;
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setRuntimeIdentifier("name");

   * ```
   */
  setRuntimeIdentifier(value: string) {
    this.dataBP["minecraft:entity"].description.runtime_identifier = value;
    return this;
  }
  /**
   * @param base_color string
   * @param overlay_color string
   * @param texture string (optional)
   * @param texture_index number (optional)
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setSpawnEgg("#288483", "#2B7135");

   * ```
   */
  setSpawnEgg(
    base_color: string,
    overlay_color: string,
    texture?: string,
    texture_index?: number
  ) {
    this.dataRP["minecraft:client_entity"].description.spawn_egg = {
      base_color,
      overlay_color,
      texture,
      texture_index,
    };
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setHideArmor(true);

   * ```
   */
  setHideArmor(value: boolean) {
    this.dataRP["minecraft:client_entity"].description.hide_armor = value;
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setEnableAttachbles(true);

   * ```
   */
  setEnableAttachbles(value: boolean) {
    this.dataRP["minecraft:client_entity"].description.enable_attachables =
      value;
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setHeldItemIgnoresLighting(true);

   * ```
   */
  setHeldItemIgnoresLighting(value: boolean) {
    this.dataRP[
      "minecraft:client_entity"
    ].description.held_item_ignores_lighting = value;
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setMinEngineVersion("1.21.90");

   * ```
   */
  setMinEngineVersion(value: string) {
    this.dataRP["minecraft:client_entity"].description.min_engine_version =
      value;
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.setQueryabkeGeometry("name");

   * ```
   */
  setQueryableGeometry(value: string) {
    this.dataRP["minecraft:client_entity"].description.queryable_geometry =
      value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addParticleEmitter("name", "name");

   * ```
   */
  addParticleEmitter(name: string, value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "particle_emitters"
      )
    )
      this.dataRP["minecraft:client_entity"].description.particle_emitters = {};
    this.dataRP["minecraft:client_entity"].description.particle_emitters![
      name
    ] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addSoundEffect("name", "name");

   * ```
   */
  addSoundEffect(name: string, value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "sound_effects"
      )
    )
      this.dataRP["minecraft:client_entity"].description.sound_effects = {};
    this.dataRP["minecraft:client_entity"].description.sound_effects![name] =
      value;
    return this;
  }
  /**
   * @param name string
   * @param value Material <string>
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addMaterial("default", "entity_custom");

   * ```
   */
  addMaterial(name: string, value: Material | (string & {})) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "materials"
      )
    )
      this.dataRP["minecraft:client_entity"].description.materials = {};
    // @ts-expect-error
    this.dataRP["minecraft:client_entity"].description.materials![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addTexture("default", "textures/entity/custom_entity");

   * ```
   */
  addTexture(name: string, value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "textures"
      )
    )
      this.dataRP["minecraft:client_entity"].description.textures = {};
    this.dataRP["minecraft:client_entity"].description.textures![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addGeometry("default", "geometry.entity");

   * ```
   */
  addGeometry(name: string, value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "geometry"
      )
    )
      this.dataRP["minecraft:client_entity"].description.geometry = {};
    this.dataRP["minecraft:client_entity"].description.geometry![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addAnimationRP("name", "animation.name");

   * ```
   */
  addAnimationRP(name: string, value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "animations"
      )
    )
      this.dataRP["minecraft:client_entity"].description.animations = {};
    this.dataRP["minecraft:client_entity"].description.animations![name] =
      value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addParticleEffects("name", "name");

   * ```
   */
  addParticleEffects(name: string, value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "particle_effects"
      )
    )
      this.dataRP["minecraft:client_entity"].description.particle_effects = {};
    this.dataRP["minecraft:client_entity"].description.particle_effects![name] =
      value;
    return this;
  }
  /**
   * @param name Scripts <string>
   * @param value Scripts[name]
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addScriptRP("animate", ["name"]);

   * ```
   */
  addScriptRP<Script extends keyof ScriptsRP>(
    name: Script,
    value: ScriptsRP[Script]
  ) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "scripts"
      )
    )
      this.dataRP["minecraft:client_entity"].description.scripts = {};
    this.dataRP["minecraft:client_entity"].description.scripts![name] = value;
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addRenderController("controller.render.entity");

   * ```
   */
  addRenderController(value: string) {
    if (
      !Object.keys(this.dataRP["minecraft:client_entity"].description).includes(
        "render_controllers"
      )
    )
      this.dataRP["minecraft:client_entity"].description.render_controllers =
        [];
    this.dataRP["minecraft:client_entity"].description.render_controllers?.push(
      value
    );
    return this;
  }
  /**
   * @param name Property <string>
   * @param value Experimental[name] <object>
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addProperty("name", {
   *  type: "bool",
   *  default: "(0.0)",
   *  client_sync: false
   * });

   * ```
   */
  addProperty<Property extends string>(
    name: Property,
    value: Experimental[Property]
  ) {
    if (
      !Object.keys(this.dataBP["minecraft:entity"].description).includes(
        "properties"
      )
    )
      this.dataBP["minecraft:entity"].description.properties = {};
    this.dataBP["minecraft:entity"].description.properties![name] = value;
    return this;
  }
  /**
   * @param name string
   * @param value string
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addAnimationBP("name", "animation.name");

   * ```
   */
  addAnimationBP(name: string, value: string) {
    if (
      !Object.keys(this.dataBP["minecraft:entity"].description).includes(
        "animations"
      )
    )
      this.dataBP["minecraft:entity"].description.animations = {};
    this.dataBP["minecraft:entity"].description.animations![name] = value;
    return this;
  }
  /**
   * @param name Scripts <string>
   * @param value Animate <string[] | object[]> | any
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addScriptBP("animate", ["name"]);

   * ```
   */
  addScriptBP<Script extends keyof Scripts | (string & {})>(
    name: Script,
    value: Script extends keyof Scripts ? Animate : any
  ) {
    if (
      !Object.keys(this.dataBP["minecraft:entity"].description).includes(
        "scripts"
      )
    )
      this.dataBP["minecraft:entity"].description.scripts = {};
    // @ts-expect-error
    this.dataBP["minecraft:entity"].description.scripts[name] = value;
    return this;
  }
  /**
   * @param name ComponentGroups <string>
   * @param value ComponentGroups[name] <object>
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addComponentGroup("physics", {
   *  "minecraft:physics": { has_collision: true, has_gravity: true },
   * });

   * ```
   */
  addComponentGroup<Entity extends keyof ComponentGroups>(
    name: Entity,
    value: ComponentGroups[Entity]
  ) {
    if (
      !Object.keys(this.dataBP["minecraft:entity"]).includes("component_groups")
    )
      this.dataBP["minecraft:entity"].component_groups = {};
    this.dataBP["minecraft:entity"].component_groups![name] = value;
    return this;
  }
  /**
   * @param name Component <string>
   * @param value Component[name] <unknown>
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addComponent("minecraft:nameable", { always_show: true });

   * ```
   */
  addComponent<Entity extends keyof Component | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Component[Entity]
  ) {
    // @ts-expect-error
    this.dataBP["minecraft:entity"].components[name] = value;
    return this;
  }
  /**
   * @param name Events <string>
   * @param value Events[name] <unknown>
   * @example
   * ```ts
   * import { Entity } from "@scriptmc/jsonts";
   * const entity = new Entity();
   * entity.addEvent("addPhysics", {
   *  add: {
   *    component_groups: "physics",
   *  },
   * });
   * entity.addEvent("removePhysics", {
   *  remove: {
   *    component_groups: "physics",
   *  },
   * });

   * ```
   */
  addEvent<Entity extends keyof Events | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Entity extends Events ? Events[Entity] : EIHEventBase
  ) {
    if (!Object.keys(this.dataBP["minecraft:entity"]).includes("events"))
      this.dataBP["minecraft:entity"].events = {};
    // @ts-expect-error
    this.dataBP["minecraft:entity"].events[name] = value;
    return this;
  }
  private async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (!fs.existsSync(path.join(__dirname, "../../executes/beh/entities")))
        fs.mkdirSync(path.join(__dirname, "../../executes/beh/entities"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/beh/entities/${this.name}.json`),
        JSON.stringify(this.dataBP, null, 2)
      );
      if (
        Object.keys(this.dataRP["minecraft:client_entity"].description)
          .length <= 0
      )
        return;
      if (!fs.existsSync(path.join(__dirname, "../../executes/reh/entity")))
        fs.mkdirSync(path.join(__dirname, "../../executes/reh/entity"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/reh/entity/${this.name}.json`),
        JSON.stringify(this.dataRP, null, 2)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * @class RenderController
 * @example
 * ```ts
 * import { RenderController } from "@scriptmc/jsonts";
 *
 * const render = new RenderController();
 *
 * render.setIdentifier("controller.render.name");
 * render.setGeometry("geometry.default");
 * render.setMaterial([
 *  {
 *    "*": "material.default",
 *  },
 * ]);
 * render.addTexture("texture.default");
 *
 * render.create();
 * ```
 */
export class RenderController {
  private data: RenderControllers = {
    format_version: "1.10.0",
    render_controllers: {},
  };
  private name: string = "";
  private fileName: string = "";
  constructor() {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".jt.js"))
      throw new Error("can only be called in files .jt.js");
    setTimeout(() => this.create(), 1000);
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setIdentifier("controller.render.name");
   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/controller\.render\.\w+|@name<\w+>/))
      throw new Error(
        `Identifier "${value}" invalid. ex: "controller.render.name"`
      );
    this.fileName = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1]
      : value;
    this.name = value.replace(/@name[<]/g, "").replace(/[>]/g, "");
    this.data.render_controllers![
      value.replace(/@name[<]/g, "").replace(/[>]/g, "")
    ] = {};
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setGeometry("geometry.default");
   * ```
   */
  setGeometry(value: string) {
    this.data["render_controllers"]![this.name].geometry = value;
    return this;
  }
  /**
   * @param array Arrays <object>
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setArray({
   *  geometries: {
   *    "name": ["geometry.1", "geometry.2"]
   *  }
   * });
   * ```
   */
  setArray(array: Arrays) {
    this.data["render_controllers"]![this.name].arrays = array;
    return this;
  }
  /**
   * @param r R <number>
   * @param g G <number>
   * @param b B <number>
   * @param a A <number>
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setColor(0, 255, 0, 1);
   * ```
   */
  setColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setFilterLighting(true);
   * ```
   */
  setFilterLighting(value: boolean) {
    this.data["render_controllers"]![this.name].filter_lighting = value;
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setIgnoreLighting(true);
   * ```
   */
  setIgnoreLighting(value: boolean) {
    this.data["render_controllers"]![this.name].ignore_lighting = value;
    return this;
  }
  /**
   * @param r R <number>
   * @param g G <number>
   * @param b B <number>
   * @param a A <number>
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setIsHurtColor(0, 255, 0, 1);
   * ```
   */
  setIsHurtColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].is_hurt_color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  /**
   * @param value string | number
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setLightColorMultiplier("(0.0)");
   * ```
   */
  setLightColorMultiplier(value: string | number) {
    this.data["render_controllers"]![this.name].light_color_multiplier = value;
    return this;
  }
  /**
   * @param r R <number>
   * @param g G <number>
   * @param b B <number>
   * @param a A <number>
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setOnFireColor(0, 255, 0, 1);
   * ```
   */
  setOnFireColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].on_fire_color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  /**
   * @param r R <number>
   * @param g G <number>
   * @param b B <number>
   * @param a A <number>
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setOverlayColor(0, 255, 0, 1);
   * ```
   */
  setOverlayColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].overlay_color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  /**
   * @param value boolean
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setRebuildAnimationMatrices(true);
   * ```
   */
  setRebuildAnimationMatrices(value: boolean) {
    this.data["render_controllers"]![this.name].rebuild_animation_matrices =
      value;
    return this;
  }
  /**
   * @param offset Offset [string | number, string | number]
   * @param scale Scale [string | number, string | number]
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setUvAnim([1, 1], [1, 1]);
   * ```
   */
  setUvAnim(offset: Offset, scale: Scale) {
    this.data["render_controllers"]![this.name].uv_anim = {
      offset,
      scale,
    };
    return this;
  }
  /**
   * @param material Materials2 object[]
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.setMaterial([
   *  {
   *    "*": "material.default"
   *  }
   * ]);
   * ```
   */
  setMaterial(material: Materials2) {
    this.data["render_controllers"]![this.name].materials = material;
    return this;
  }
  /**
   * @param part_visibility PartVisibility1 object
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.addPartVisibility({
   *  "name": true
   * });
   * ```
   */
  addPartVisibility(part_visibility: PartVisibility1) {
    this.data["render_controllers"]![this.name].part_visibility = [
      ...this.data["render_controllers"]![this.name].part_visibility!,
      part_visibility,
    ];
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { RenderController } from "@scriptmc/jsonts";
   * const render = new RenderController();
   * render.addTexture("texture.default");
   * ```
   */
  addTexture(value: string) {
    if (
      !Object.keys(this.data["render_controllers"]![this.name]).includes(
        "textures"
      )
    )
      // @ts-expect-error
      this.data["render_controllers"]![this.name].textures = [];
    this.data["render_controllers"]![this.name].textures?.push(value);
    return this;
  }
  private async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (
        !fs.existsSync(
          path.join(__dirname, "../../executes/reh/render_controllers")
        )
      )
        fs.mkdirSync(
          path.join(__dirname, "../../executes/reh/render_controllers")
        );
      fs.writeFileSync(
        path.join(
          __dirname,
          `../../executes/reh/render_controllers/${this.fileName}.json`
        ),
        JSON.stringify(this.data, null, 2)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * @class AnimationControllerBP
 * @example
 * ```ts
 * import { AnimationControllerBP } from "@scriptmc/jsonts";
 *
 * const animBP = new AnimationControllerBP();
 *
 * animBP.setIdentifier("controller.animation.name");
 * animBP.setInitialState("default");
 * animBP.addState("default", {
 *  transitions: [
 *    {
 *      "name": "query.is_baby"
 *    }
 *  ]
 * });
 * animBP.addState("name", {
 *  on_entry: [
 *    "/give @s diamond"
 *  ]
 * });
 *
 * ```
 */
export class AnimationControllerBP {
  private data: AnimControlBP = {
    format_version: "1.10.0",
    animation_controllers: {},
  };
  private name: string = "";
  private fileName: string = "";
  constructor() {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".jt.js"))
      throw new Error("can only be called in files .jt.js");
    setTimeout(() => this.create(), 1000);
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { AnimationControllerBP } from "@scriptmc/jsonts";
   * const animBP = new AnimationControllerBP();
   * animBP.setIdentifier("controller.animation.name");
   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/controller\.animation\.\w+|@name<[\w\.]+>/))
      throw new Error(
        `Identifier "${value}" invalid. ex: "controller.animation.name"`
      );
    this.fileName = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1]
      : value;
    this.name = value.replace(/@name[<]/g, "").replace(/[>]/g, "");
    this.data.animation_controllers![
      value.replace(/@name[<]/g, "").replace(/[>]/g, "")
    ] = {
      states: {},
    };
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { AnimationControllerBP } from "@scriptmc/jsonts";
   * const animBP = new AnimationControllerBP();
   * animBP.setInitialState("name");
   * ```
   */
  setInitialState(value: string) {
    this.data.animation_controllers[this.name].initial_state = value;
    return this;
  }
  /**
   * @param name string
   * @param value AnimStateBP <object>
   * @example
   * ```ts
   * import { AnimationControllerBP } from "@scriptmc/jsonts";
   * const animBP = new AnimationControllerBP();
   * animBP.addState("name", {
   *  animations: ["name"],
   *  transitions: [
   *    {
   *      "name2": "query.value"
   *    }
   *  ]
   * });
   * animBP.addState("name2", {
   *  on_entry: [
   *    "/give @s diamond"
   *  ]
   * });
   * ```
   */
  addState(name: string, value: AnimStateBP) {
    this.data.animation_controllers[this.name].states[name] = value;
    return this;
  }
  private async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (
        !fs.existsSync(
          path.join(__dirname, "../../executes/beh/animation_controllers")
        )
      )
        fs.mkdirSync(
          path.join(__dirname, "../../executes/beh/animation_controllers")
        );
      fs.writeFileSync(
        path.join(
          __dirname,
          `../../executes/beh/animation_controllers/${this.fileName}.json`
        ),
        JSON.stringify(this.data, null, 2)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * @class AnimationControllerRP
 * @example
 * ```ts
 * import { AnimationControllerRP } from "@scriptmc/jsonts";
 *
 * const animRP = new AnimationControllerRP();
 *
 * animRP.setIdentifier("controller.animation.name");
 * animRP.setInitialState("default");
 * animRP.addState("default", {
 *  transitions: [
 *    {
 *      "move": "query.is_moving"
 *    }
 *  ]
 * });
 * animRP.addState("move", {
 *  animations: ["move"],
 *  transitions: [
 *    {
 *      "default": "!query.is_moving"
 *    }
 *  ]
 * });
 *
 * ```
 */
export class AnimationControllerRP {
  private data: AnimControlRP = {
    format_version: "1.10.0",
    animation_controllers: {},
  };
  private name: string = "";
  private fileName: string = "";
  constructor() {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".jt.js"))
      throw new Error("can only be called in files .jt.js");
    setTimeout(() => this.create(), 1000);
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { AnimationControllerRP } from "@scriptmc/jsonts";
   * const anim = new AnimationControllerRP();
   * animRP.setIdentifier("controller.animation.name");
   * ```
   */
  setIdentifier(value: string) {
    if (!value.match(/controller\.animation\.\w+|@name<[\w\.]+>/))
      throw new Error(
        `Identifier "${value}" invalid. ex: "controller.animation.name"`
      );
    this.fileName = value.match(/.*@name<.*>.*/)
      ? value.match(/.*@name<([^>/]*).*/)![1]
      : value;
    this.name = value.replace(/@name[<]/g, "").replace(/[>]/g, "");
    this.data.animation_controllers![
      value.replace(/@name[<]/g, "").replace(/[>]/g, "")
    ] = {
      states: {},
    };
    return this;
  }
  /**
   * @param value string
   * @example
   * ```ts
   * import { AnimationControllerRP } from "@scriptmc/jsonts";
   * const anim = new AnimationControllerRP();
   * animRP.setInitialState("name");
   * ```
   */
  setInitialState(value: string) {
    this.data.animation_controllers[this.name].initial_state = value;
    return this;
  }
  /**
   * @param name string
   * @param value AnimStateRP <object>
   * @example
   * ```ts
   * import { AnimationControllerRP } from "@scriptmc/jsonts";
   * const anim = new AnimationControllerRP();
   * animRP.addState("name", {
   *  animations: ["name"],
   *  transitions: [
   *    {
   *      "name2": "query.value"
   *    }
   *  ]
   * });
   * animRP.addState("name2", {
   *  animations: ["name2"],
   *  transitions: [
   *    {
   *      "name": "query.value"
   *    }
   *  ]
   * });
   * ```
   */
  addState(name: string, value: AnimStateRP) {
    this.data.animation_controllers[this.name].states[name] = value;
    return this;
  }
  private async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (
        !fs.existsSync(
          path.join(__dirname, "../../executes/reh/animation_controllers")
        )
      )
        fs.mkdirSync(
          path.join(__dirname, "../../executes/reh/animation_controllers")
        );
      fs.writeFileSync(
        path.join(
          __dirname,
          `../../executes/reh/animation_controllers/${this.fileName}.json`
        ),
        JSON.stringify(this.data, null, 2)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
