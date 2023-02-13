import "expect-even-more-jest";
import { readScriptTransformers } from "../src/read-script-transformers";
import { findScriptTransformers } from "../src/find-script-transformers";
import { readTextFile } from "yafs";

describe(`read-script-transformer`, () => {
    it(`should be able to read the ScriptTransformer.js file when available`, async () => {
        // Arrange
        const
            existingFile = await findScriptTransformers(),
            expected = await readTextFile(existingFile[0]);
        // Act
        const results = await readScriptTransformers();
        // Assert
        expect(results)
            .not.toBeEmptyString();
        expect(results[0].contents)
            .toEqual(expected);
    });
});
