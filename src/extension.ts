import * as vscode from 'vscode';
import { findCfLogTokens, TokenKind } from './tokenizer';

const tokenTypeNames: TokenKind[] = [
    'cfLogTimestamp',
    'cfLogSource',
    'cfLogStream',
    'cfLogLevelError',
    'cfLogLevelWarning',
    'cfLogLevelInfo',
    'cfLogLevelDebug',
    'cfLogLogger',
    'cfLogMessage',
];

const legend = new vscode.SemanticTokensLegend(
    tokenTypeNames,
    []
);

class CFLogSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.SemanticTokens {
        const tokensBuilder = new vscode.SemanticTokensBuilder(legend);

        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            for (const token of findCfLogTokens(document.lineAt(lineIndex).text)) {
                tokensBuilder.push(
                    lineIndex,
                    token.start,
                    token.length,
                    tokenTypeNames.indexOf(token.kind),
                    0
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
