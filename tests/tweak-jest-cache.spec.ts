import "expect-even-more-jest";
import { findScriptTransformer } from "../src/find-script-transformer";
import { readTextFile } from "yafs";

describe(`tweak-jest-cache`, () => {
    describe(`default behavior`, () => {
        it.skip(`should make the readCacheFile function opportunistic`, async () => {
            // Arrange
            const
                scriptTransformerFile = await findScriptTransformer(),
                scriptTransformerCode = await readTextFile(scriptTransformerFile);
            // Act
            // Assert
        });
    });

    // TODO: readCacheFile and writeCacheFile should be opportunistic. A cache
    // is is NO reason to completely bail out. Cache is to improve performance,
    // not a lynchpin for the entire process.

    // TODO: replace writeCacheFile with opportunistic cacher:
    // original code is:
    // const writeCacheFile = (cachePath, fileData) => {
    //     try {
    //         (0, _writeFileAtomic().sync)(cachePath, fileData, {
    //             encoding: 'utf8',
    //             fsync: false
    //         });
    //     } catch (e) {
    //         if (cacheWriteErrorSafeToIgnore(e, cachePath)) {
    //             return;
    //         }
    //
    //         e.message =
    //             'jest: failed to cache transform results in: ' +
    //             cachePath +
    //             '\nFailure message: ' +
    //             e.message;
    //         removeFile(cachePath);
    //         throw e;
    //     }
    // };

    // TODO: replace readCacheFile with opportunistic cache reader
    // original code is:
    // const readCacheFile = cachePath => {
    //     if (!fs().existsSync(cachePath)) {
    //         return null;
    //     }
    //
    //     let fileData;
    //
    //     try {
    //         fileData = fs().readFileSync(cachePath, 'utf8');
    //     } catch (e) {
    //         e.message =
    //             'jest: failed to read cache file: ' +
    //             cachePath +
    //             '\nFailure message: ' +
    //             e.message;
    //         removeFile(cachePath);
    //         throw e;
    //     }
    //
    //     if (fileData == null) {
    //         // We must have somehow created the file but failed to write to it,
    //         // let's delete it and retry.
    //         removeFile(cachePath);
    //     }
    //
    //     return fileData;
    // };


});
