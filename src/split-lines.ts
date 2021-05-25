export function splitLines(text: string): string[] {
    if (!text) {
        return [];
    }
    return text.split("\r\n")
        .map(line => line.split("\r"))
        .flat()
        .map(line => line.split("\n"))
        .flat();
}
