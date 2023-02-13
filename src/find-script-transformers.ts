import { FsEntities, ls } from "yafs";
import { Optional, Nullable } from "./types";

const
    baseJestSearch = "node_modules/@jest",
    baseJestRuntimeSearch = "node_modules/jest-runtime";

let cachedScriptTransformerPaths: Nullable<string[]> = null;
let cachedRuntimeScriptTransformerPaths: Nullable<string[]> = null;

export async function findScriptTransformers(): Promise<string[]> {
    if (cachedScriptTransformerPaths !== null) {
        return cachedScriptTransformerPaths;
    }
    const search = await findJestFiles(/ScriptTransformer.js$/);
    if (search.length === 0) {
        throw new Error(`Unable to find ScriptTransformer.js under ${ baseJestSearch }`);
    }
    return cachedScriptTransformerPaths = search;
}

export async function findScriptTransformerBackups(): Promise<string[]> {
    return await findJestFiles(/ScriptTransformer.js.original$/);
}

export async function findRuntimeScriptTransformers(): Promise<string[]> {
    if (cachedRuntimeScriptTransformerPaths !== null) {
        return cachedRuntimeScriptTransformerPaths;
    }
    const search = await findJestRuntimeFiles(/script_transformer.js$/);
    // this file may not exist, depending on jest version
    // -> I've seen it with 23.6.0, which is what my CI resolves for the package
    // -> I don't see it with 26.6.3, which is what my local machine resolves for the package
    return cachedRuntimeScriptTransformerPaths = search;
}

export async function findRuntimeScriptTransformerBackups(): Promise<string[]> {
    return await findJestRuntimeFiles(/script_transformer.js.original$/);
}

export function generateBackupFileName(fileName: string) {
    return `${ fileName }.original`;
}
export function generateOriginalFileName(fileName: string) {
    return fileName.replace(/\.original$/, "");
}

export function findJestFiles(matching: RegExp): Promise<string[]> {
    return ls(baseJestSearch, {
        recurse: true,
        fullPaths: true,
        entities: FsEntities.files,
        match: matching
    });
}

export function findJestRuntimeFiles(matching: RegExp): Promise<string[]> {
    return ls(baseJestRuntimeSearch, {
        recurse: true,
        fullPaths: true,
        entities: FsEntities.files,
        match: matching
    });
}
