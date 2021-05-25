import "expect-even-more-jest";
import { findScriptTransformer } from "../src/find-script-transformer";
import { readTextFile } from "yafs";
import { extractFunction } from "../src/extract-function";
import { patchScriptTransformer } from "../src/patch-script-transformer";
import { defaultOptions } from "../src/gather-args";
import { splitLines } from "../src/split-lines";

describe(`patch-script-transformer`, () => {
    describe(`default behavior`, () => {
        it(`should make the readCacheFile function opportunistic & warning`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile),
                before = extractFunction(scriptTransformerCode, "readCacheFile");
            expect(before)
                .not.toBeEmptyString();
            // Act
            const result = patchScriptTransformer(
                scriptTransformerCode,
                defaultOptions
            );
            // Assert
            const
                renamed = extractFunction(result, "originalReadCacheFile"),
                beforeLines = splitLines(before),
                renamedLines = splitLines(renamed);
            // renamed function should still have the same body
            expect(beforeLines.slice(1))
                .toEqual(renamedLines.slice(1));

            const wrapper = extractFunction(result, "readCacheFile");
            expect(wrapper.trim())
                .toEqual(`
const readCacheFile = (cachePath) => {
    try {
        return originalReadCacheFile(cachePath);
    } catch (e) {
        console.warn(\`Error reading cache file at \${cachePath}: \${e}\`);
        return null;
    }
};
                `.trim());
        });

        it(`should make the writeCacheFile function opportunistic & warning`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile),
                before = extractFunction(scriptTransformerCode, "writeCacheFile");
            expect(before)
                .not.toBeEmptyString();
            // Act
            const result = patchScriptTransformer(
                scriptTransformerCode,
                defaultOptions
            );
            // Assert
            const
                renamed = extractFunction(result, "originalWriteCacheFile"),
                beforeLines = splitLines(before),
                renamedLines = splitLines(renamed);
            // renamed function should still have the same body
            expect(beforeLines.slice(1))
                .toEqual(renamedLines.slice(1));

            const wrapper = extractFunction(result, "writeCacheFile");
            expect(wrapper.trim())
                .toEqual(`
const writeCacheFile = (cachePath, fileData) => {
    try {
        return originalWriteCacheFile(cachePath, fileData);
    } catch (e) {
        console.warn(\`Error writing cache file at \${cachePath}: \${e}\`);
    }
};
                `.trim());
        });
    });


    describe(`when warnings are disabled`, () => {
        it(`should make the readCacheFile function opportunistic & quiet`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile),
                before = extractFunction(scriptTransformerCode, "readCacheFile");
            expect(before)
                .not.toBeEmptyString();
            // Act
            const result = patchScriptTransformer(
                scriptTransformerCode,
                { ...defaultOptions, "warn-on-errors": false }
            );
            // Assert
            const
                renamed = extractFunction(result, "originalReadCacheFile"),
                beforeLines = splitLines(before),
                renamedLines = splitLines(renamed);
            // renamed function should still have the same body
            expect(beforeLines.slice(1))
                .toEqual(renamedLines.slice(1));

            const wrapper = extractFunction(result, "readCacheFile");
            expect(wrapper.trim())
                .toEqual(`
const readCacheFile = (cachePath) => {
    try {
        return originalReadCacheFile(cachePath);
    } catch (e) {
        // suppress
        return null;
    }
};
                `.trim());
        });

        it(`should make the writeCacheFile function opportunistic & quiet`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile),
                before = extractFunction(scriptTransformerCode, "writeCacheFile");
            expect(before)
                .not.toBeEmptyString();
            // Act
            const result = patchScriptTransformer(
                scriptTransformerCode,
                { ...defaultOptions, "warn-on-errors": false }
            );
            // Assert
            const
                renamed = extractFunction(result, "originalWriteCacheFile"),
                beforeLines = splitLines(before),
                renamedLines = splitLines(renamed);
            // renamed function should still have the same body
            expect(beforeLines.slice(1))
                .toEqual(renamedLines.slice(1));

            const wrapper = extractFunction(result, "writeCacheFile");
            expect(wrapper.trim())
                .toEqual(`
const writeCacheFile = (cachePath, fileData) => {
    try {
        return originalWriteCacheFile(cachePath, fileData);
    } catch (e) {
        // suppress
    }
};
                `.trim());
        });
    });

    describe(`when cache writing disabled`, () => {
        it(`should make the writeCacheFile function into a no-op`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile),
                before = extractFunction(scriptTransformerCode, "writeCacheFile");
            expect(before)
                .not.toBeEmptyString();
            // Act
            const result = patchScriptTransformer(
                scriptTransformerCode,
                { ...defaultOptions, "disable-write-cache": true }
            );
            // Assert
            const updated = extractFunction(result, "writeCacheFile");
            expect(updated.trim())
                .toEqual(`
const writeCacheFile = (cachePath, fileData) => {
    // cache writing disabled
};`.trim());
        });
    });

    describe(`when cache reading disabled`, () => {
        it(`should make the readCacheFile function into a no-op`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile),
                before = extractFunction(scriptTransformerCode, "readCacheFile");
            expect(before)
                .not.toBeEmptyString();
            // Act
            const result = patchScriptTransformer(
                scriptTransformerCode,
                { ...defaultOptions, "disable-read-cache": true }
            );
            // Assert
            const updated = extractFunction(result, "readCacheFile");
            expect(updated.trim())
                .toEqual(`
const readCacheFile = (cachePath) => {
    // cache reading disabled
};`.trim());
        });
    });


    /*
    See the outstanding PR for inspiration here:
    https://github.com/facebook/jest/pull/11423/files
    */

});
