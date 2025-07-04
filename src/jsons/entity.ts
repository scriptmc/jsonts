import path from "node:path";
import fs from "node:fs";
import type {
  Component,
  ComponentGroups,
  Description,
  Events,
  EntityBehavior,
  EIHEventBase,
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
  private description: boolean = false;
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
  setDescription({
    identifier,
    animations,
    is_experimental,
    is_spawnable,
    is_summonable,
    properties,
    runtime_identifier,
    scripts,
    spawn_category,
  }: Description) {
    if (this.description)
      throw new Error("setDescription can only be called once per entity.");
    this.data["minecraft:entity"].description.identifier = identifier;
    this.data["minecraft:entity"].description.animations = animations;
    this.data["minecraft:entity"].description.is_experimental = is_experimental;
    this.data["minecraft:entity"].description.is_spawnable = is_spawnable;
    this.data["minecraft:entity"].description.is_summonable = is_summonable;
    this.data["minecraft:entity"].description.properties = properties;
    this.data["minecraft:entity"].description.runtime_identifier =
      runtime_identifier;
    this.data["minecraft:entity"].description.scripts = scripts;
    this.data["minecraft:entity"].description.spawn_category = spawn_category;
    this.description = true;
    return this;
  }
  addComponentGroup<Entity extends keyof ComponentGroups | (string & {})>(
    name: Entity,
    value: ComponentGroups[Entity]
  ) {
    // @ts-expect-error
    this.data["minecraft:entity"].component_groups[name] = {};
    // @ts-expect-error
    this.data["minecraft:entity"].component_groups[name] = value;
    return this;
  }
  addComponent<Entity extends keyof Component | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Component[Entity]
  ) {
    // @ts-expect-error
    this.data["minecraft:entity"].components[name] = {};
    // @ts-expect-error
    this.data["minecraft:entity"].components[name] = value;
    return this;
  }
  addEvent<Entity extends keyof Events | (string & {})>(
    name: Entity,
    // @ts-expect-error
    value: Entity extends Events ? Events[Entity] : EIHEventBase
  ) {
    // @ts-expect-error
    this.data["minecraft:entity"].events[name] = {};
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
