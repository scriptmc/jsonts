import { MinecraftJSONUI, UIDefinition } from "./types/ui";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Ui {
  private data: MinecraftJSONUI = {
    namespace: "",
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
  setNamespace(value: string) {
    this.name = value;
    this.data.namespace = value;
    return this;
  }
  addUi(identifier: string, value: UIDefinition) {
    this.data[identifier] = value;
    return this;
  }
  private async create() {
    try {
      if (!this.name) throw new Error("Identifier not found.");
      if (!fs.existsSync(path.join(__dirname, "../../executes/reh/ui")))
        fs.mkdirSync(path.join(__dirname, "../../executes/reh/ui"));
      fs.writeFileSync(
        path.join(__dirname, `../../executes/reh/ui/${this.name}.json`),
        JSON.stringify(this.data)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
