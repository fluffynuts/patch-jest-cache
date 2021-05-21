import "expect-even-more-jest";
import { replaceFunction } from "../src/replace-function";
import { extractFunction } from "../src/extract-function";

describe(`replace-function`, () => {
    it(`should be a function`, async () => {
        // Arrange
        // Act
        expect(replaceFunction)
            .toBeFunction();
        // Assert
    });

    it(`should replace the provided function`, async () => {
        // Arrange
        const
            code = `
            function one() {
                return "one";
            }
            function two() {
                return "two";
            }
            function three() {
                return "three";
            }
            `;
        // Act
        const updated = replaceFunction(code, "two", `
            function two() {
                return 2;
            }
        `);
        // Assert
        expect(updated)
            .toEqual(`
            function one() {
                return "one";
            }
            function two() {
                return 2;
            }
            function three() {
                return "three";
            }
            `);
    });
});
