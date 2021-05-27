import { findRuntimeScriptTransformer, findScriptTransformer } from "./find-script-transformer";
import { readTextFile } from "yafs";

export function readScriptTransformer(): Promise<string> {
    return readFileWith(findScriptTransformer);
}

export function readRuntimeScriptTransformer(): Promise<string> {
    return readFileWith(findRuntimeScriptTransformer);
}

async function readFileWith(
    finder: () => Promise<string>
): Promise<string> {
    const filePath = await finder();
    return readTextFile(filePath);
}
