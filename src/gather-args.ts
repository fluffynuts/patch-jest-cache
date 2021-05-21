import yargs from "yargs";

export interface Options {
    "disable-read-cache": boolean;
    "disable-write-cache": boolean;
    "revert": boolean;
}

export function gatherArgs(): Options {
    return yargs.option("disable-read-cache", {
        demandOption: false,
        default: false,
        description: "completely disable reading from the cache altogether",
        type: "boolean"
    }).option("disable-write-cache", {
        demandOption: false,
        default: false,
        description: "completely disable writing to the cache altogether",
        type: "boolean"
    }).option("revert", {
        demandOption: false,
        default: false,
        description: "revert back to the original behavior",
        type: "boolean"
    }).argv;
}
