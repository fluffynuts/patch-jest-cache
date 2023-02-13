import { PatchOptions } from "./gather-args";
import {
    BackupResults, backUpRuntimeScriptTransformer,
    backUpScriptTransformers,
    RestoreResults, restoreRuntimeScriptTransformer,
    restoreScriptTransformers
} from "./back-up-script-transformers";
import { findRuntimeScriptTransformers, findScriptTransformers } from "./find-script-transformers";
import {
    readRuntimeScriptTransformers,
    readScriptTransformers,
    TextFile
} from "./read-script-transformers";
import { writeTextFile } from "yafs";
import { patchScriptTransformer } from "./patch-script-transformer";
import { ExecStepContext } from "exec-step";
import { resolve } from "path";

export async function patchJestCache(options: PatchOptions): Promise<void> {
    const
        runDir = resolve(options.in),
        ctx = new ExecStepContext();
    await runIn(runDir, async () => {
        await patchJestCacheScriptTransformer(options, ctx);
        await patchJestCacheRuntimeScriptTransformer(options, ctx);
    });
}


function patchJestCacheRuntimeScriptTransformer(
    options: PatchOptions,
    ctx: ExecStepContext
): Promise<void> {
    return patchWith(
        options,
        ctx,
        findRuntimeScriptTransformers,
        restoreRuntimeScriptTransformer,
        backUpRuntimeScriptTransformer,
        readRuntimeScriptTransformers
    )
}

function patchJestCacheScriptTransformer(
    options: PatchOptions,
    ctx: ExecStepContext
): Promise<void> {
    return patchWith(
        options,
        ctx,
        findScriptTransformers,
        restoreScriptTransformers,
        backUpScriptTransformers,
        readScriptTransformers
    );
}

async function patchWith(
    options: PatchOptions,
    ctx: ExecStepContext,
    finder: () => Promise<string[]>,
    restoreAll: () => Promise<RestoreResults>,
    backupAll: () => Promise<BackupResults>,
    read: () => Promise<TextFile[]>
) {
    const targetPaths = await finder();
    if (!targetPaths) {
        return;
    }
    if (options.revert) {
        return revert(ctx, targetPaths, restoreAll);
    }
    await restoreAll(); // ignore errors & always start from scratch
    await backupAll(); // always have a backup before modifying
    const targets = await read();
    for (const target of targets) {
        await ctx.exec(
            `patching ${ target.path }`,
            async () => {
                const
                    code = target.contents,
                    updatedCode = patchScriptTransformer(code, options);
                await writeTextFile(target.path, updatedCode);
            }
        );
    }
}


async function runIn(
    dir: string,
    func: () => Promise<void>
): Promise<void> {
    const start = process.cwd();
    try {
        process.chdir(dir);
        await func();
    } finally {
        process.chdir(start);
    }
}

async function revert(
    ctx: ExecStepContext,
    targets: string[],
    restore: () => Promise<RestoreResults>
): Promise<void> {
    const finalResult = await ctx.exec(`reverting\n- ${ targets.join("\n- ") }`,
        async () => {
            const result = await restore();
            if (result === RestoreResults.fail) {
                throw new Error(`Unable to restore\n- ${ targets.join("\n- ") }`);
            }
            return result;
        }
    );
    if (finalResult === RestoreResults.noBackupFound) {
        console.warn(`No backup was found for\n- ${ targets.join("\n- ") }\nHave you patched before?`);
    }
    return;
}
