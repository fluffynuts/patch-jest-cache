import { findScriptTransformer, findScriptTransformerBackup, generateBackupFileName } from "./find-script-transformer";
import { copyFile, CopyFileOptions } from "yafs";

export enum BackupResults {
    alreadyExists,
    success,
    fail
}

export enum RestoreResults {
    noBackupFound,
    success,
    fail
}

export async function backUpScriptTransformer(): Promise<BackupResults> {
    try {
        const existingBackup = await findScriptTransformerBackup();
        if (!!existingBackup) {
            return BackupResults.alreadyExists;
        }
        const scriptTransformer = await findScriptTransformer();
        await copyFile(scriptTransformer, generateBackupFileName(scriptTransformer));
        return BackupResults.success;
    } catch (e) {
        console.error(e);
        return BackupResults.fail;
    }
}

export async function restoreScriptTransformer(): Promise<RestoreResults> {
    try {
        const existingBackup = await findScriptTransformerBackup();
        if (!existingBackup) {
            return RestoreResults.noBackupFound;
        }
        const scriptTransformer = await findScriptTransformer();
        await copyFile(existingBackup, scriptTransformer, CopyFileOptions.overwriteExisting);
        return RestoreResults.success;
    } catch (e) {
        console.error(e);
        return RestoreResults.fail;
    }
}
