import { findRuntimeScriptTransformers, findScriptTransformers } from "./find-script-transformers";
import { readTextFile } from "yafs";

export interface TextFile {
    path: string;
    contents: string;
}
export function readScriptTransformers(): Promise<TextFile[]> {
    return readFilesWith(findScriptTransformers);
}

export function readRuntimeScriptTransformers(): Promise<TextFile[]> {
    return readFilesWith(findRuntimeScriptTransformers);
}

async function readFilesWith(
    finder: () => Promise<string[]>
): Promise<TextFile[]> {
    const filePaths = await finder();
    const results = [];
    for (const filePath of filePaths) {
        results.push({
            path: filePath,
            contents: await readTextFile(filePath)
        });
    }
    return results;
}
