import { defaultOptions, PatchOptions } from "../src/gather-args";

const noop = () => {
    // intentionally left blank
}
const backupMock = {
    backUpScriptTransformer: noop,
    restoreScriptTransformer: noop
};
jest.doMock("../src/back-up-script-transformer", () => backupMock);

const findMock = {
    findScriptTransformer: noop
}
jest.doMock("../src/find-script-transformer", () => findMock);

const readMock = {
    readScriptTransformer: noop
}
jest.doMock("../src/read-script-transformer", () => readMock);

const yafsMock = {
    writeTextFile: noop
}
jest.doMock("yafs", () => yafsMock);

const patchMock = {
    patchScriptTransformer: noop
}
jest.doMock("../src/patch-script-transformer", () => patchMock);

import "expect-even-more-jest";
import { patchJestCache } from "../src";
import * as faker from "faker";

describe(`patch-jest-cache`, () => {
    it(`should export the function`, async () => {
        // Arrange
        // Act
        expect(patchJestCache)
            .toBeAsyncFunction();
        // Assert
    });

    describe(`behavior`, () => {
        describe(`happy path`, () => {
            it(`should restore any existing backup, back up again, find & read script transformer, patch & rewrite`, async () => {
                // Arrange
                spyOn(process.stdout, "write");
                spyOn(process.stderr, "write");
                const
                    options = {
                        ...defaultOptions,
                        "warn-on-errors": faker.datatype.boolean()
                    } as PatchOptions,
                    filePath = faker.datatype.string(32),
                    code = faker.random.words(),
                    updated = faker.random.words();
                (findMock.findScriptTransformer as jasmine.Spy).and.returnValue(filePath);
                (readMock.readScriptTransformer as jasmine.Spy).and.returnValue(code);
                (patchMock.patchScriptTransformer as jasmine.Spy).and.callFake(
                    (original, opts) => original === code ? updated : original
                );
                // Act
                await patchJestCache(options);
                // Assert
                expect(findMock.findScriptTransformer)
                    .toHaveBeenCalledOnce();
                expect(readMock.readScriptTransformer)
                    .toHaveBeenCalledOnce();
                expect(patchMock.patchScriptTransformer)
                    .toHaveBeenCalledOnceWith(
                        code,
                        options
                    );
                expect(yafsMock.writeTextFile)
                    .toHaveBeenCalledOnceWith(
                        filePath,
                        updated
                    )

                expect(process.stdout.write)
                    .toHaveBeenCalledWith(
                        jasmine.stringMatching(/.*patching.*/)
                    );
                expect(process.stderr.write)
                    .not.toHaveBeenCalled();
            });
        });
    });

    beforeEach(() => {
        spyOnAll(backupMock);
        spyOnAll(findMock);
        spyOnAll(readMock);
        spyOnAll(yafsMock);
        spyOnAll(patchMock);
    });

    function spyOnAll<T>(obj: T) {
        Object.keys(obj).forEach(k => {
            const key = k as keyof T;
            if (typeof obj[key] === "function") {
                spyOn(obj, key);
            }
        });
    }
});
