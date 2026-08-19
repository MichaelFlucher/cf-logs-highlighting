export type TokenKind =
    | 'cfLogTimestamp'
    | 'cfLogSource'
    | 'cfLogStream'
    | 'cfLogLevelError'
    | 'cfLogLevelWarning'
    | 'cfLogLevelInfo'
    | 'cfLogLevelDebug'
    | 'cfLogLogger'
    | 'cfLogMessage';

export interface CfLogToken {
    kind: TokenKind;
    start: number;
    length: number;
}

const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[+-]\d{4})/;
const sourcePattern = /\[[^\]]+\]/;
const streamPattern = /\bSTD(?:OUT|ERR)\b/;

export function findCfLogTokens(line: string): CfLogToken[] {
    const tokens: CfLogToken[] = [];

    addMatch(tokens, line, timestampPattern, 'cfLogTimestamp');
    addMatch(tokens, line, sourcePattern, 'cfLogSource');
    addMatch(tokens, line, streamPattern, 'cfLogStream');

    const jsonStart = line.indexOf('{');
    if (jsonStart >= 0) {
        addJsonStringToken(tokens, line, jsonStart, 'level', levelTokenKind);
        addJsonStringToken(tokens, line, jsonStart, 'logger', () => 'cfLogLogger');
        addJsonStringToken(tokens, line, jsonStart, 'msg', () => 'cfLogMessage');
    }

    return tokens.sort((left, right) => left.start - right.start);
}

function addMatch(
    tokens: CfLogToken[],
    line: string,
    pattern: RegExp,
    kind: TokenKind
): void {
    const match = pattern.exec(line);
    if (!match || match.index === undefined) {
        return;
    }

    tokens.push({ kind, start: match.index, length: match[0].length });
}

function addJsonStringToken(
    tokens: CfLogToken[],
    line: string,
    jsonStart: number,
    property: string,
    getKind: (value: string) => TokenKind
): void {
    const json = line.slice(jsonStart);
    const pattern = new RegExp(`"${property}"\\s*:\\s*("(?:\\\\.|[^"\\\\])*")`);
    const match = pattern.exec(json);
    if (!match || match.index === undefined) {
        return;
    }

    const value = match[1];
    const valueOffset = match[0].lastIndexOf(value);
    tokens.push({
        kind: getKind(decodeJsonString(value)),
        start: jsonStart + match.index + valueOffset,
        length: value.length,
    });
}

function decodeJsonString(value: string): string {
    try {
        return JSON.parse(value);
    } catch {
        return value.slice(1, -1);
    }
}

function levelTokenKind(level: string): TokenKind {
    switch (level.toLowerCase()) {
        case 'error':
        case 'fatal':
            return 'cfLogLevelError';
        case 'warn':
        case 'warning':
            return 'cfLogLevelWarning';
        case 'debug':
        case 'trace':
        case 'verbose':
            return 'cfLogLevelDebug';
        default:
            return 'cfLogLevelInfo';
    }
}
