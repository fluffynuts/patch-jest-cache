import yargs from "yargs";

export interface PatchOptions {
    "disable-read-cache": boolean;
    "disable-write-cache": boolean;
    "revert": boolean;
    "warn-on-errors": boolean;
    "in": string;
}

export const defaultOptions: PatchOptions = {
    "disable-write-cache": false,
    "disable-read-cache": false,
    revert: false,
    "warn-on-errors": true,
    "in": process.cwd()
}

export function gatherArgs(): PatchOptions {
    return yargs.option("disable-read-cache", {
        demandOption: false,
        default: defaultOptions["disable-read-cache"],
        description: "completely disable reading from the cache altogether",
        type: "boolean"
    }).option("disable-write-cache", {
        demandOption: false,
        default: defaultOptions["disable-write-cache"],
        description: "completely disable writing to the cache altogether",
        type: "boolean"
    }).option("revert", {
        demandOption: false,
        default: defaultOptions.revert,
        description: "revert back to the original behavior",
        type: "boolean"
    }).option("warn-on-errors", {
        demandOption: false,
        default: defaultOptions["warn-on-errors"],
        description: "print out warnings on cache errors",
        type: "boolean"
    }).option("in", {
        demandOption: false,
        default: defaultOptions.in,
        description: "operate in this folder, not the current one",
        type: "string"
    }).argv;
}
