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
import { EntityResource, Material } from "./types/entity/entity-rp.js";
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Entity {
  private static classCalled: boolean = false;
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
  constructor() {
    if (Entity.classCalled) {
      fs.rmSync(path.join(__dirname, "../../entity.json"), {
        force: true,
        recursive: true,
      });
      throw new Error(
        "You can only create one instance of Entity using `new Entity()`."
      );
    }
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".entity.js"))
      throw new Error("entity class can only be called in files .entity.ts");
    Entity.classCalled = true;
  }
  setIdentifier(value: string) {
    if (!value.match(/^[a-zA-Z]+:\w+$/))
      throw new Error(`Identifier "${value}" invalid. ex: "id:name"`);
    this.dataBP["minecraft:entity"].description.identifier = value;
    this.dataRP["minecraft:client_entity"].description.identifier = value;
    return this;
  }
  setSpawnable(value: boolean) {
    this.dataBP["minecraft:entity"].description.is_spawnable = value;
    return this;
  }
  setSummonable(value: boolean) {
    this.dataBP["minecraft:entity"].description.is_summonable = value;
    return this;
  }
  setIsExperimental(value: boolean) {
    this.dataBP["minecraft:entity"].description.is_experimental = value;
    return this;
  }
  setSpawnCategory(value: SpawnCategory) {
    this.dataBP["minecraft:entity"].description.spawn_category = value;
    return this;
  }
  setRuntimeIdentifier(value: string) {
    this.dataBP["minecraft:entity"].description.runtime_identifier = value;
    return this;
  }
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
  setHideArmor(value: boolean) {
    this.dataRP["minecraft:client_entity"].description.hide_armor = value;
    return this;
  }
  setEnableAttachbles(value: boolean) {
    this.dataRP["minecraft:client_entity"].description.enable_attachables =
      value;
    return this;
  }
  setHeldItemIgnoresLighting(value: boolean) {
    this.dataRP[
      "minecraft:client_entity"
    ].description.held_item_ignores_lighting = value;
    return this;
  }
  setMinEngineVersion(value: string) {
    this.dataRP["minecraft:client_entity"].description.min_engine_version =
      value;
    return this;
  }
  setQueryableGeometry(value: string) {
    this.dataRP["minecraft:client_entity"].description.queryable_geometry =
      value;
    return this;
  }
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
  addScriptRP<Script extends keyof Scripts>(
    name: Script,
    value: Scripts[Script]
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
  addRenderController(value: string) {
    this.dataRP["minecraft:client_entity"].description.render_controllers = [
      ...this.dataRP["minecraft:client_entity"].description.render_controllers!,
      value,
    ];
    return this;
  }
  addProperties<Property extends string>(
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
  addComponentGroup<Entity extends keyof ComponentGroups>(
    name: Entity,
    value: ComponentGroups[Entity]
  ) {
    if (
      !Object.keys(this.dataBP["minecraft:entity"].description).includes(
        "component_groups"
      )
    )
      this.dataBP["minecraft:entity"].component_groups = {};
    this.dataBP["minecraft:entity"].component_groups![name] = value;
    return this;
  }
  addComponent<Entity extends keyof Component | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Component[Entity]
  ) {
    // @ts-expect-error
    this.dataBP["minecraft:entity"].components[name] = value;
    return this;
  }
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
  async create() {
    try {
      fs.writeFileSync(
        path.join(__dirname, "../../entity.json"),
        JSON.stringify(this.dataBP)
      );
      if (
        Object.keys(this.dataRP["minecraft:client_entity"].description)
          .length <= 0
      )
        return;
      fs.writeFileSync(
        path.join(__dirname, "../../entity-rp.json"),
        JSON.stringify(this.dataRP)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export class RenderController {
  private static classCalled: boolean = false;
  private data: RenderControllers = {
    format_version: "1.10.0",
    render_controllers: {},
  };
  private name: string = "";
  constructor() {
    if (RenderController.classCalled) {
      fs.rmSync(path.join(__dirname, "../../entity-render.json"), {
        force: true,
        recursive: true,
      });
      throw new Error(
        "You can only create one instance of RenderController using `new Entity()`."
      );
    }
    const err = new Error();
    const stack = err.stack?.split("\n")[2] ?? "";
    const match =
      stack.match(/\((.*):\d+:\d+\)$/) || stack.match(/at (.*):\d+:\d+/);
    const filePath = match?.[1];
    if (!filePath?.endsWith(".entity.js"))
      throw new Error(
        "render_controller class can only be called in files .entity.ts"
      );
    RenderController.classCalled = true;
  }
  setIdentifier(value: string) {
    if (!value.match(/^controller\.render\.\w+$/))
      throw new Error(
        `Identifier "${value}" invalid. ex: "controller.render.name"`
      );
    this.name = value;
    this.data["render_controllers"]![value] = {};
    return this;
  }
  setGeometry(value: string) {
    this.data["render_controllers"]![this.name].geometry = value;
    return this;
  }
  setArray(array: Arrays) {
    this.data["render_controllers"]![this.name].arrays = array;
    return this;
  }
  setColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  setFilterLighting(value: boolean) {
    this.data["render_controllers"]![this.name].filter_lighting = value;
    return this;
  }
  setIgnoreLighting(value: boolean) {
    this.data["render_controllers"]![this.name].ignore_lighting = value;
    return this;
  }
  setIsHurtColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].is_hurt_color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  setLightColorMultiplier(value: string | number) {
    this.data["render_controllers"]![this.name].light_color_multiplier = value;
    return this;
  }
  setOnFireColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].on_fire_color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  setOverlayColor(r: R, g: G, b: B, a: A) {
    this.data["render_controllers"]![this.name].overlay_color = {
      r,
      g,
      b,
      a,
    };
    return this;
  }
  setRebuildAnimationMatrices(value: boolean) {
    this.data["render_controllers"]![this.name].rebuild_animation_matrices =
      value;
    return this;
  }
  setUvAnim(offset: Offset, scale: Scale) {
    this.data["render_controllers"]![this.name].uv_anim = {
      offset,
      scale,
    };
    return this;
  }
  setMaterial(material: Materials2) {
    this.data["render_controllers"]![this.name].materials = material;
    return this;
  }
  addPartVisibility(part_visibility: PartVisibility1) {
    this.data["render_controllers"]![this.name].part_visibility = [
      ...this.data["render_controllers"]![this.name].part_visibility!,
      part_visibility,
    ];
    return this;
  }
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
  async create() {
    try {
      fs.writeFileSync(
        path.join(__dirname, "../../entity-render.json"),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
