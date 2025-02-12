import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Activating CF Logs Highlighting extension');

    // Get configuration
    const workspaceConfig = vscode.workspace.getConfiguration();

    try {
        // Update token color customizations
        const existingTokenColors = workspaceConfig.get('editor.tokenColorCustomizations') || {};
        const newTokenColors = {
            ...existingTokenColors,
            "textMateRules": [
                {
                    "scope": "constant.numeric.timestamp.cflog",
                    "settings": {
                        "foreground": "#569CD6"
                    }
                },
                {
                    "scope": "keyword.other.important.cflog",
                    "settings": {
                        "foreground": "#4EC9B0",
                        "fontStyle": "bold"
                    }
                },
                {
                    "scope": "entity.name.function.cflog",
                    "settings": {
                        "foreground": "#9CDCFE"
                    }
                },
                {
                    "scope": "string.quoted.double.cflog",
                    "settings": {
                        "foreground": "#CE9178"
                    }
                },
                {
                    "scope": "comment.block.documentation.cflog",
                    "settings": {
                        "foreground": "#666666"
                    }
                },
                {
                    "scope": "variable.other.readwrite.cflog",
                    "settings": {
                        "foreground": "#888888"
                    }
                }
            ]
        };

        // Update settings at user level (global)
        await workspaceConfig.update(
            'editor.tokenColorCustomizations',
            newTokenColors,
            vscode.ConfigurationTarget.Global
        );

        console.log('Successfully updated token colors');
    } catch (error) {
        console.error('Failed to update settings:', error);
        vscode.window.showErrorMessage('Failed to update CF Logs Highlighting settings');
    }
}

export function deactivate() {}
