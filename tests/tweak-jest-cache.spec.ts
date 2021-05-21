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
});
