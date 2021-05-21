export function extractFunction(code: string, functionName: string): string {
    let
        inFunction = false,
        braceCount = 0;
    const
        pureRegex = new RegExp(`function\\s+${functionName}\\s*\\(`),
        assignRegex = new RegExp(`\\b${functionName}\\s*=\\s*(function|\\()`),
        lines = code.split(/[\r\n]/g),
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

function countLeftBracesIn(str: string): number {
    return countCharsIn(str, "{");
}

function countRightBracesIn(str: string): number {
    return countCharsIn(str, "}");
}

function countCharsIn(str: string, char: string): number {
    return str.split(char).length - 1;
}
