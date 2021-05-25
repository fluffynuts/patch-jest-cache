import "expect-even-more-jest";
import { renameFunction } from "../src/rename-function";

describe(`rename-function`, () => {
    it(`should export the function`, async () => {
        // Arrange
        // Act
        expect(renameFunction)
            .toBeFunction();
        // Assert
    });

    describe(`behavior`, () => {
        describe(`when the 'from' function isn't found`, () => {
            it(`should throw`, async () => {
                // Arrange
                const
                    code = `
                function moo() {
                    console.log("moo");
                }
                function cow() {
                    console.log("cow");
                }
                `,
                    from = "oldName",
                    to = "newName";
                // Act
                expect(() => renameFunction(code, from, to))
                    .toThrow(/oldName not found/);
                // Assert
            });
        });

        describe(`when the 'from' function is found`, () => {
            describe(`function declaration syntax`, () => {
                it(`should rename the function in the result`, async () => {
                    // Arrange
                    const
                        code = `
                    function first() {
                    }
                    function second() {
                    }
                    function third() {
                    }`,
                        from = "second",
                        to = "theSecond",
                        expected = `
                    function first() {
                    }
                    function theSecond() {
                    }
                    function third() {
                    }`;
                    // Act
                    const result = renameFunction(code, from, to);
                    // Assert
                    expect(result)
                        .toEqual(expected);
                });
            });
        });
    });
});
