import { PatchOptions } from "./gather-args";
import {
    BackupResults, backUpRuntimeScriptTransformer,
    backUpScriptTransformer,
    RestoreResults, restoreRuntimeScriptTransformer,
    restoreScriptTransformer
} from "./back-up-script-transformer";
import { findRuntimeScriptTransformer, findScriptTransformer } from "./find-script-transformer";
import { readRuntimeScriptTransformer, readScriptTransformer } from "./read-script-transformer";
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
        findRuntimeScriptTransformer,
        restoreRuntimeScriptTransformer,
        backUpRuntimeScriptTransformer,
        readRuntimeScriptTransformer
    )
}

function patchJestCacheScriptTransformer(
    options: PatchOptions,
    ctx: ExecStepContext
): Promise<void> {
    return patchWith(
        options,
        ctx,
        findScriptTransformer,
        restoreScriptTransformer,
        backUpScriptTransformer,
        readScriptTransformer
    );
}

async function patchWith(
    options: PatchOptions,
    ctx: ExecStepContext,
    finder: () => Promise<string>,
    restore: () => Promise<RestoreResults>,
    backup: () => Promise<BackupResults>,
    read: () => Promise<string>
) {
    const targetPath = await finder();
    if (!targetPath) {
        return;
    }
    if (options.revert) {
        return revert(ctx, targetPath, restore);
    }
    await ctx.exec(
        `patching ${ targetPath }`,
        async () => {
            await restore(); // ignore errors & always start from scratch
            await backup(); // always have a backup before modifying
            const
                code = await read(),
                updatedCode = patchScriptTransformer(code, options);
            await writeTextFile(targetPath, updatedCode);
        });
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
    target: string,
    restore: () => Promise<RestoreResults>
): Promise<void> {
    const finalResult = await ctx.exec(`reverting ${ target }`,
        async () => {
            const result = await restore();
            if (result === RestoreResults.fail) {
                throw new Error(`Unable to restore ${ target }`);
            }
            return result;
        }
    );
    if (finalResult === RestoreResults.noBackupFound) {
        console.warn(`No backup was found for ${ target } - have you patched it before?`);
    }
    return;
}
