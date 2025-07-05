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
} from "./types/entity.js";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Entity {
  private static classCalled: boolean = false;
  private data: EntityBehavior = {
    format_version: "1.21.90",
    "minecraft:entity": {
      // @ts-expect-error
      description: {},
      components: {},
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
    this.data["minecraft:entity"].description.identifier = value;
    return this;
  }
  setSpawnable(value: boolean) {
    this.data["minecraft:entity"].description.is_spawnable = value;
    return this;
  }
  setSummonable(value: boolean) {
    this.data["minecraft:entity"].description.is_summonable = value;
    return this;
  }
  setIsExperimental(value: boolean) {
    this.data["minecraft:entity"].description.is_experimental = value;
    return this;
  }
  setSpawnCategory(value: SpawnCategory) {
    this.data["minecraft:entity"].description.spawn_category = value;
    return this;
  }
  setRuntimeIdentifier(value: string) {
    this.data["minecraft:entity"].description.runtime_identifier = value;
    return this;
  }
  addProperties<Property extends string>(
    name: Property,
    value: Experimental[Property]
  ) {
    this.data["minecraft:entity"].description.properties = {};
    this.data["minecraft:entity"].description.properties[name] = value;
    return this;
  }
  addAnimations(name: string, value: string) {
    this.data["minecraft:entity"].description.animations = {};
    this.data["minecraft:entity"].description.animations[name] = value;
    return this;
  }
  addScript<Script extends keyof Scripts | (string & {})>(
    name: Script,
    value: Script extends keyof Scripts ? Animate : any
  ) {
    this.data["minecraft:entity"].description.scripts = {};
    // @ts-expect-error
    this.data["minecraft:entity"].description.scripts[name] = value;
    return this;
  }
  addComponentGroup<Entity extends keyof ComponentGroups>(
    name: Entity,
    value: ComponentGroups[Entity]
  ) {
    this.data["minecraft:entity"].component_groups = {};
    this.data["minecraft:entity"].component_groups[name] = value;
    return this;
  }
  addComponent<Entity extends keyof Component | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Component[Entity]
  ) {
    // @ts-expect-error
    this.data["minecraft:entity"].components[name] = value;
    return this;
  }
  addEvent<Entity extends keyof Events | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Entity extends Events ? Events[Entity] : EIHEventBase
  ) {
    this.data["minecraft:entity"].events = {};
    // @ts-expect-error
    this.data["minecraft:entity"].events[name] = value;
    return this;
  }
  async create() {
    try {
      fs.writeFileSync(
        path.join(__dirname, "../../entity.json"),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
