import { findScriptTransformer } from "./find-script-transformer";
import { readTextFile } from "yafs";

export async function readScriptTransformer(): Promise<string> {
    const scriptTransformerPath = await findScriptTransformer();
    return readTextFile(scriptTransformerPath);
}
