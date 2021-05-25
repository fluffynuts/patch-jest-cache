import "expect-even-more-jest";
import { splitLines } from "../src/split-lines";

describe(`split-lines`, () => {
    it(`should export the function`, async () => {
        // Arrange
        // Act
        expect(splitLines)
            .toBeFunction();
        // Assert
    });

    describe(`behaviour`, () => {
        it(`should return empty for empty string`, async () => {
            // Arrange
            const
                input = "",
                expected = [] as string[];
            // Act
            const result = splitLines(input);
            // Assert
            expect(result)
                .toEqual(expected);
        });

        it(`should return the single line`, async () => {
            // Arrange
            const
                input = "moo, says the cow",
                expected = [ input ];
            // Act
            const result = splitLines(input);
            // Assert
            expect(result)
                .toEqual(expected);
        });

        it(`should return the two lines split by \\n`, async () => {
            // Arrange
            const
                expected = [
                    "the first",
                    "the second"
                ],
                input = expected.join("\n");
            // Act
            const result = splitLines(input);
            // Assert
            expect(result)
                .toEqual(expected);
        });

        it(`should return the two lines split by \\r`, async () => {
            // Arrange
            const
                expected = [
                    "the first",
                    "the second"
                ],
                input = expected.join("\r");
            // Act
            const result = splitLines(input);
            // Assert
            expect(result)
                .toEqual(expected);
        });

        it(`should return the two lines split by \\r\\n`, async () => {
            // Arrange
            const
                expected = [
                    "the first",
                    "the second"
                ],
                input = expected.join("\r\n");
            // Act
            const result = splitLines(input);
            // Assert
            expect(result)
                .toEqual(expected);
        });

        it(`should include empty lines`, async () => {
            // Arrange
            const
                expected = [
                    "the first",
                    "",
                    "the second",
                    ""
                ],
                input = expected.join("\r\n");
            // Act
            const result = splitLines(input);
            // Assert
            expect(result)
                .toEqual(expected);
        });
    });
});
