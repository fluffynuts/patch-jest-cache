import {
    findRuntimeScriptTransformerBackups,
    findRuntimeScriptTransformers,
    findScriptTransformerBackups,
    findScriptTransformers,
    generateBackupFileName,
    generateOriginalFileName
} from "./find-script-transformers";
import { copyFile, CopyFileOptions, fileExists, rm } from "yafs";
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

export function backUpScriptTransformers(): Promise<BackupResults> {
    return backup(
        findScriptTransformerBackups,
        findScriptTransformers
    );
}

export function restoreScriptTransformers(): Promise<RestoreResults> {
    return restore(
        findScriptTransformerBackups,
        findScriptTransformers
    );
}

export function backUpRuntimeScriptTransformer(): Promise<BackupResults> {
    return backup(
        findRuntimeScriptTransformerBackups,
        findRuntimeScriptTransformers
    );
}

export function restoreRuntimeScriptTransformer(): Promise<RestoreResults> {
    return restore(
        findRuntimeScriptTransformerBackups,
        findRuntimeScriptTransformers
    );
}

async function restore(
    backupFinder: () => Promise<Optional<string[]>>,
    _: () => Promise<string[]>
) {
    try {
        const existingBackups = await backupFinder();
        if (!existingBackups) {
            return RestoreResults.noBackupFound;
        }
        for (const existingBackup of existingBackups) {
            const originalFileName = generateOriginalFileName(existingBackup);
            await copyFile(existingBackup, originalFileName, CopyFileOptions.overwriteExisting)
            await rm(existingBackup);
        }
        return RestoreResults.success;
    } catch (e) {
        console.error(e);
        return RestoreResults.fail;
    }
}

async function backup(
    backupFinder: () => Promise<string[]>,
    originalFinder: () => Promise<string[]>
) {
    try {
        const existingBackups = await backupFinder();
        const originals = await originalFinder();
        let backedUp = 0;
        for (const original of originals) {
            const backupFile = generateBackupFileName(original);
            if (await fileExists(backupFile)) {
                continue;
            }
            await copyFile(original, generateBackupFileName(original));
            backedUp++;
        }
        return !!backedUp
            ? BackupResults.success
            : BackupResults.alreadyExists;
    } catch (e) {
        console.error(e);
        return BackupResults.fail;
    }
}
