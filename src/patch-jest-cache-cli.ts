#!/usr/bin/env node
import { patchJestCache } from "./patch-jest-cache";
import { gatherArgs } from "./gather-args";

(async function main() {
    const options = gatherArgs();
    await patchJestCache(options);
})();
