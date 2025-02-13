import * as vscode from 'vscode';

// Define token types that extend from standard types
const tokenTypes = new Map<string, number>([
    ['namespace', 0],  // for timestamps
    ['class', 1],     // for service names
    ['type', 2],      // for log levels
    ['string', 3],    // for messages
    ['comment', 4]    // for unimportant parts
]);

const tokenModifiers = new Map<string, number>([
    ['declaration', 0],
    ['documentation', 1],
    ['readonly', 2],
    ['static', 3],
    ['deprecated', 4],
    ['modification', 5]
]);

const legend = new vscode.SemanticTokensLegend(
    Array.from(tokenTypes.keys()),
    Array.from(tokenModifiers.keys())
);

class CFLogSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document: vscode.TextDocument): Promise<vscode.SemanticTokens> {
        const tokensBuilder = new vscode.SemanticTokensBuilder(legend);

        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex);
            const text = line.text;

            // Match timestamp
            const timestampMatch = text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+\-]\d{4}/);
            if (timestampMatch) {
                tokensBuilder.push(
                    lineIndex,
                    timestampMatch.index || 0,
                    timestampMatch[0].length,
                    tokenTypes.get('namespace')!,
                    tokenModifiers.get('readonly')!
                );
            }

            // Match service name
            const serviceMatch = text.match(/\[(APP\/PROC\/WEB\/\d+|[^\]]+)\]/);
            if (serviceMatch) {
                tokensBuilder.push(
                    lineIndex,
                    serviceMatch.index || 0,
                    serviceMatch[0].length,
                    tokenTypes.get('class')!,
                    0
                );
            }

            // Match log level
            const levelMatch = text.match(/"level":"(verbose|debug|info|warn|error)"/);
            if (levelMatch) {
                tokensBuilder.push(
                    lineIndex,
                    levelMatch.index || 0,
                    levelMatch[0].length,
                    tokenTypes.get('type')!,
                    0
                );
            }

            // Match message
            const msgMatch = text.match(/"msg":"([^"]+)"/);
            if (msgMatch) {
                tokensBuilder.push(
                    lineIndex,
                    msgMatch.index || 0,
                    msgMatch[0].length,
                    tokenTypes.get('string')!,
                    tokenModifiers.get('documentation')!
                );
            }
        }

        return tokensBuilder.build();
    }
}

export function activate(context: vscode.ExtensionContext) {
    const selector = { language: 'cflog' };
    context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
            selector,
            new CFLogSemanticTokensProvider(),
            legend
        )
    );
}

export function deactivate() {}
