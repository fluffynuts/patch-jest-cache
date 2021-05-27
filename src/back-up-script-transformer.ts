import {
    findRuntimeScriptTransformer, findRuntimeScriptTransformerBackup,
    findScriptTransformer,
    findScriptTransformerBackup,
    generateBackupFileName
} from "./find-script-transformer";
import { copyFile, CopyFileOptions } from "yafs";
import { Optional } from "./types";

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

export function backUpScriptTransformer(): Promise<BackupResults> {
    return backup(
        findScriptTransformerBackup,
        findScriptTransformer
    );
}

export function restoreScriptTransformer(): Promise<RestoreResults> {
    return restore(
        findScriptTransformerBackup,
        findScriptTransformer
    );
}

export function backUpRuntimeScriptTransformer(): Promise<BackupResults> {
    return backup(
        findRuntimeScriptTransformerBackup,
        findRuntimeScriptTransformer
    );
}

export function restoreRuntimeScriptTransformer(): Promise<RestoreResults> {
    return restore(
        findRuntimeScriptTransformerBackup,
        findRuntimeScriptTransformer
    );
}

async function restore(
    backupFinder: () => Promise<Optional<string>>,
    originalFinder: () => Promise<string>
) {
    try {
        const existingBackup = await backupFinder();
        if (!existingBackup) {
            return RestoreResults.noBackupFound;
        }
        const target = await originalFinder();
        await copyFile(existingBackup, target, CopyFileOptions.overwriteExisting);
        return RestoreResults.success;
    } catch (e) {
        console.error(e);
        return RestoreResults.fail;
    }
}

async function backup(
    backupFinder: () => Promise<Optional<string>>,
    originalFinder: () => Promise<string>
) {
    try {
        const existingBackup = await backupFinder();
        if (!!existingBackup) {
            return BackupResults.alreadyExists;
        }
        const original = await originalFinder();
        await copyFile(original, generateBackupFileName(original));
        return BackupResults.success;
    } catch (e) {
        console.error(e);
        return BackupResults.fail;
    }
}
