import "expect-even-more-jest";
import { BackupResults, backUpScriptTransformers, restoreScriptTransformers } from "../src/back-up-script-transformers";
import { findScriptTransformers, generateBackupFileName } from "../src/find-script-transformers";
import { fileExists, readTextFile, rm, writeTextFile } from "yafs";
import * as faker from "faker";

describe(`back-up-script-transformer`, () => {
    it(`should export the backupScriptTransformer function`, async () => {
        // Arrange
        // Act
        expect(backUpScriptTransformers)
            .toBeFunction();
        // Assert
    });

    it(`should export the restoreScriptTransformer function`, async () => {
        // Arrange
        // Act
        expect(restoreScriptTransformers)
            .toBeFunction();
        // Assert
    });

    describe(`behavior`, () => {
        describe(`backupScriptTransformer`, () => {
            it(`should be able to back up, once`, async () => {
                // Arrange
                const
                    existing = (await findScriptTransformers())[0],
                    expectedFile = generateBackupFileName(existing);
                if (await fileExists(expectedFile)) {
                    await rm(expectedFile);
                }
                expect(expectedFile)
                    .not.toBeFile();
                // Act
                const result = await backUpScriptTransformers();
                // Assert
                expect(result)
                    .toEqual(BackupResults.success);
                expect(expectedFile)
                    .toBeFile();
                expect(await readTextFile(expectedFile))
                    .toEqual(await readTextFile(existing));
            });
            it(`should silently refuse to backup twice`, async () => {
                // Arrange
                const
                    existing = (await findScriptTransformers())[0],
                    expectedFile = generateBackupFileName(existing);
                if (await fileExists(expectedFile)) {
                    await rm(expectedFile);
                }
                spyOn(console, "error");
                expect(expectedFile)
                    .not.toBeFile();
                // Act
                const result1 = await backUpScriptTransformers();
                const result2 = await backUpScriptTransformers();
                // Assert
                expect(result1)
                    .toEqual(BackupResults.success);
                expect(result2)
                    .toEqual(BackupResults.alreadyExists);
                expect(expectedFile)
                    .toBeFile();
                expect(await readTextFile(expectedFile))
                    .toEqual(await readTextFile(existing));
                expect(console.error)
                    .not.toHaveBeenCalled();
            });
        });

        describe(`restoreScriptTransformer`, () => {
            it(`should restore the backup to the original file`, async () => {
                // Arrange
                const
                    existing = (await findScriptTransformers())[0],
                    expected = await readTextFile(existing);
                await backUpScriptTransformers();
                // Act
                await writeTextFile(existing, faker.random.words());
                await restoreScriptTransformers();
                // Assert
                expect(await readTextFile(existing))
                    .toEqual(expected);
            });
        });
    });

    beforeEach(async () => {
        await restoreScriptTransformers();
    });
});
