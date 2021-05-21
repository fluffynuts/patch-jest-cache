import { Options } from "./gather-args";

export async function tweakJestCache(options: Options): Promise<void> {
}


export function tweakScriptTransformer(
    options: Options,
    scriptTransformerCode: string
): string {
    throw new Error("not yet implemented");
}

