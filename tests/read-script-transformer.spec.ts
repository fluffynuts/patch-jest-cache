import "expect-even-more-jest";
import { readScriptTransformer } from "../src/read-script-transformer";
import { findScriptTransformer } from "../src/find-script-transformer";
import { readTextFile } from "yafs";

describe(`read-script-transformer`, () => {
    it(`should be able to read the ScriptTransformer.js file when available`, async () => {
        // Arrange
        const
            existingFile = await findScriptTransformer(),
            expected = await readTextFile(existingFile);
        // Act
        const results = await readScriptTransformer();
        // Assert
        expect(results)
            .not.toBeEmptyString();
        expect(results)
            .toEqual(expected);
    });
});
