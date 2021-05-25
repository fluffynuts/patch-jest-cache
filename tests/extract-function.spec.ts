import "expect-even-more-jest";
import { extractFunction } from "../src/extract-function";

describe(`extract-function`, () => {
    it(`should be an exported function`, async () => {
        // Arrange
        // Act
        expect(extractFunction)
            .toBeFunction();
        // Assert
    });

    it(`should find the function-defined function in the code`, async () => {
        // Arrange
        const
            code = `
            function moo() {
                return "moo";
            }
            function cow() {
                return "cow";
            }
            `;
        // Act
        const result = await extractFunction(code, "moo");
        // Assert
        expect(result)
            .toEqual(
`            function moo() {
                return "moo";
            }`);
    });

    it(`should find the const-defined function in the code`, async () => {
        // Arrange
        const
            code = `
            const moo = () => {
                return "moo";
            }
            function cow() {
                return "cow";
            }
            `;
        // Act
        const result = await extractFunction(code, "moo");
        // Assert
        expect(result)
            .toEqual(
`            const moo = () => {
                return "moo";
            }`);
    });

    it(`should find the const-defined function with parameters in the code`, async () => {
        // Arrange
        const
            code = `
            const moo = (left, right, up, down) => {
                return "moo";
            }
            function cow() {
                return "cow";
            }
            `;
        // Act
        const result = await extractFunction(code, "moo");
        // Assert
        expect(result)
            .toEqual(
`            const moo = (left, right, up, down) => {
                return "moo";
            }`);
    });

    it(`should find the const-defined function with one parameter, no parens in the code`, async () => {
        // Arrange
        const
            code = `
            const moo = left => {
                return "moo";
            }
            function cow() {
                return "cow";
            }
            `;
        // Act
        const result = await extractFunction(code, "moo");
        // Assert
        expect(result)
            .toEqual(
`            const moo = left => {
                return "moo";
            }`);
    });

});
