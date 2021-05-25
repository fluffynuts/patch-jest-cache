import { splitLines } from "./split-lines";

export function extractFunction(code: string, functionName: string): string {
    let
        inFunction = false,
        braceCount = 0;
    const
        pureRegex = createFunctionDeclarationRegexFor(functionName),
        assignRegex = createFunctionAssignRegexFor(functionName),
        lines = splitLines(code),
        result = lines.reduce(
            (acc, cur) => {
                if (cur.match(pureRegex) || cur.match(assignRegex)) {
                    inFunction = true;
                }
                if (inFunction) {
                    acc.push(cur);
                    braceCount += countLeftBracesIn(cur);
                    braceCount -= countRightBracesIn(cur);
                    if (braceCount < 1) {
                        inFunction = false;
                    }
                }
                return acc;
            }, [] as string[]);
    return result.join("\n");
}

export function createFunctionDeclarationRegexFor(functionName: string): RegExp {
    return new RegExp(`function\\s+${functionName}\\s*\\(`);
}

export function createFunctionAssignRegexFor(functionName: string): RegExp {
    return new RegExp(`\\b${functionName}\\s*=\\s*(function|\\(?[a-zA-Z0-9_, ]*\\)?\\s*=>)`);
}

function countLeftBracesIn(str: string): number {
    return countCharsIn(str, "{");
}

function countRightBracesIn(str: string): number {
    return countCharsIn(str, "}");
}

function countCharsIn(str: string, char: string): number {
    return str.split(char).length - 1;
}
