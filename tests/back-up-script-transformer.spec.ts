import "expect-even-more-jest";
import { BackupResults, backUpScriptTransformer, restoreScriptTransformer } from "../src/back-up-script-transformer";
import { findScriptTransformer, generateBackupFileName } from "../src/find-script-transformer";
import { fileExists, readTextFile, rm, writeTextFile } from "yafs";
import * as faker from "faker";

describe(`back-up-script-transformer`, () => {
    it(`should export the backupScriptTransformer function`, async () => {
        // Arrange
        // Act
        expect(backUpScriptTransformer)
            .toBeFunction();
        // Assert
    });

    it(`should export the restoreScriptTransformer function`, async () => {
        // Arrange
        // Act
        expect(restoreScriptTransformer)
            .toBeFunction();
        // Assert
    });

    describe(`behavior`, () => {
        describe(`backupScriptTransformer`, () => {
            it(`should be able to back up, once`, async () => {
                // Arrange
                const
                    existing = await findScriptTransformer(),
                    expectedFile = generateBackupFileName(existing);
                if (await fileExists(expectedFile)) {
                    await rm(expectedFile);
                }
                expect(expectedFile)
                    .not.toBeFile();
                // Act
                const result = await backUpScriptTransformer();
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
                    existing = await findScriptTransformer(),
                    expectedFile = generateBackupFileName(existing);
                if (await fileExists(expectedFile)) {
                    await rm(expectedFile);
                }
                spyOn(console, "error");
                expect(expectedFile)
                    .not.toBeFile();
                // Act
                const result1 = await backUpScriptTransformer();
                const result2 = await backUpScriptTransformer();
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
                    existing = await findScriptTransformer(),
                    expected = await readTextFile(existing);
                await backUpScriptTransformer();
                // Act
                await writeTextFile(existing, faker.random.words());
                await restoreScriptTransformer();
                // Assert
                expect(await readTextFile(existing))
                    .toEqual(expected);
            });
        });
    });

    beforeEach(async () => {
        await restoreScriptTransformer();
    });
});
