import { PatchOptions } from "./gather-args";
import { backUpScriptTransformer, restoreScriptTransformer } from "./back-up-script-transformer";
import { findScriptTransformer } from "./find-script-transformer";
import { readScriptTransformer } from "./read-script-transformer";
import { writeTextFile } from "yafs";
import { patchScriptTransformer } from "./patch-script-transformer";
import { ExecStepContext } from "exec-step";

export async function patchJestCache(options: PatchOptions): Promise<void> {
    const
        scriptTransformerPath = await findScriptTransformer(),
        ctx = new ExecStepContext();
    await ctx.exec(`patching ${scriptTransformerPath}`, async () => {
        await restoreScriptTransformer(); // ignore errors & always start from scratch
        await backUpScriptTransformer(); // always have a backup before modifying
        const
            scriptTransformerCode = await readScriptTransformer(),
            updatedCode = patchScriptTransformer(scriptTransformerCode, options);
        await writeTextFile(scriptTransformerPath, updatedCode);
    });
}

