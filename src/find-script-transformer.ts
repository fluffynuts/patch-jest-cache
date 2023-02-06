import { FsEntities, ls } from "yafs";
import { Optional, Nullable } from "./types";

const
    baseJestSearch = "node_modules/@jest",
    baseJestRuntimeSearch = "node_modules/jest-runtime";

let cachedScriptTransformerPath: Nullable<string> = null;
let cachedRuntimeScriptTransformerPath: Nullable<string> = null;

export async function findScriptTransformer(): Promise<string> {
    if (cachedScriptTransformerPath !== null) {
        return cachedScriptTransformerPath;
    }
    const search = await findJestFiles(/ScriptTransformer.js$/);
    if (search.length === 0) {
        throw new Error(`Unable to find ScriptTransformer.js under ${ baseJestSearch }`);
    }
    if (search.length > 1) {
        console.error(`multiple matches for ScriptTransformer under ${ baseJestSearch }`, search);
        throw new Error(`Multiple matches for ScriptTransformer.js under ${ baseJestSearch }:\n${ search.join("\n") }`);
    }
    return cachedScriptTransformerPath = search[0];
}

export async function findScriptTransformerBackup(): Promise<Optional<string>> {
    const search = await findJestFiles(/ScriptTransformer.js.original$/);
    return search[0];
}

export async function findRuntimeScriptTransformer(): Promise<string> {
    if (cachedRuntimeScriptTransformerPath !== null) {
        return cachedRuntimeScriptTransformerPath;
    }
    const search = await findJestRuntimeFiles(/script_transformer.js$/);
    // this file may not exist, depending on jest version
    // -> I've seen it with 23.6.0, which is what my CI resolves for the package
    // -> I don't see it with 26.6.3, which is what my local machine resolves for the package
    return cachedRuntimeScriptTransformerPath = search[0];
}

export async function findRuntimeScriptTransformerBackup(): Promise<Optional<string>> {
    const search = await findJestRuntimeFiles(/script_transformer.js.original$/);
    return search[0];
}

export function generateBackupFileName(fileName: string) {
    return `${ fileName }.original`;
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
