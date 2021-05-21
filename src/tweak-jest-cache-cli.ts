#!/usr/bin/env node
import { tweakJestCache } from "./tweak-jest-cache";
import { gatherArgs } from "./gather-args";

(async function main() {
    const options = gatherArgs();
    await tweakJestCache(options);
})();
