import { PatchOptions } from "./gather-args";
import { extractFunction } from "./extract-function";
import { renameFunction } from "./rename-function";

const
    readCacheFileFn = "readCacheFile",
    originalReadCacheFileFn = "originalReadCacheFile",
    writeCacheFileFn = "writeCacheFile",
    originalWriteCacheFileFn = "originalWriteCacheFile";

export function patchScriptTransformer(
    scriptTransformerCode: string,
    options: PatchOptions
): string {
    const
        withReadCacheFilePatched = patchReadCache(scriptTransformerCode, options);
    return patchWriteCache(withReadCacheFilePatched, options);
}

function patchWriteCache(
    code: string,
    options: PatchOptions
): string {
    const
        existingWriteCacheFileFunction = extractFunction(code, writeCacheFileFn);
    if (!existingWriteCacheFileFunction.trim()) {
        throw new Error(`Can't find ${ writeCacheFileFn } within script transformer code`);
    }
    return options["disable-write-cache"]
        ? disableWriteCache(code, existingWriteCacheFileFunction)
        : wrapWriteCache(code, existingWriteCacheFileFunction, options);
}

function wrapWriteCache(
    code: string,
    existing: string,
    options: PatchOptions
): string {
    const
        renamed = renameFunction(
            existing,
            writeCacheFileFn,
            originalWriteCacheFileFn
        ),
        wrapper = createWrapper(
            writeCacheFileFn,
            [ "cachePath", "fileData" ],
            originalWriteCacheFileFn,
            options,
            "writing cache file"
        ),
        replaceWith = `${ wrapper }\n\n${ renamed }`;
    return code.replace(
        existing,
        replaceWith
    );
}

function disableWriteCache(
    code: string,
    existing: string
): string {
    const noop = createNoOp(
        writeCacheFileFn,
        [ "cachePath", "fileData" ],
        "cache writing disabled"
    );
    return code.replace(
        existing,
        noop
    );
}

function createNoOp(
    functionName: string,
    args: string[],
    comment: string
) {
    return `
const ${ functionName } = (${ args.join(", ") }) => {
    // ${ comment }
};
`;
}

function patchReadCache(
    code: string,
    options: PatchOptions
): string {
    const
        existing = extractFunction(code, readCacheFileFn);
    if (!existing.trim()) {
        throw new Error(`Can't find ${ readCacheFileFn } within script transformer code`);
    }
    return options["disable-read-cache"]
        ? disableReadCache(code, existing)
        : wrapReadCache(code, existing, options);
}

function disableReadCache(
    code: string,
    existing: string
): string {
    const noop = createNoOp(
        readCacheFileFn,
        [ "cachePath" ],
        "cache reading disabled"
    );
    return code.replace(
        existing,
        noop
    );
}

function wrapReadCache(
    code: string,
    existing: string,
    options: PatchOptions
): string {
    const
        renamed = renameFunction(
            existing,
            readCacheFileFn,
            originalReadCacheFileFn
        ),
        wrapper = createWrapper(
            readCacheFileFn,
            [ "cachePath" ],
            originalReadCacheFileFn,
            options,
            "reading cache file",
            "null"
        ),
        replaceWith = `${ wrapper }\n\n${ renamed }`;
    return code.replace(
        existing,
        replaceWith
    );
}

function createWrapper(
    withName: string,
    withArgs: string[],
    wrapping: string,
    options: PatchOptions,
    errorLabel: string,
    errorReturnValue?: string
): string {
    const lines = [] as string[];
    const argString = withArgs.join(", ");
    lines.push(`const ${ withName } = (${ argString }) => {`);
    lines.push(`    try {`);
    lines.push(`        return ${ wrapping }(${ argString });`);
    lines.push(`    } catch (e) {`);
    if (options["warn-on-errors"]) {
        lines.push(`        console.warn(\`Error ${ errorLabel } at \${cachePath}: \${e}\`);`)
    } else {
        lines.push(`        // suppress`);
    }
    if (errorReturnValue !== undefined) {
        lines.push(`        return ${ errorReturnValue };`);
    }
    lines.push(`    }`);
    lines.push(`};`);
    return lines.join("\n");
}

