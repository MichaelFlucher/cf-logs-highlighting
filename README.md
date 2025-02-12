# cf-logs-highlighting README

Basic highlighting of CF Logs

## Customizing Colors

You can customize the colors in your VS Code settings.json. Add this to your settings:

```json
"editor.tokenColorCustomizations": {
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
}
```

Replace the color values with your preferred colors. The extension uses standard TextMate scopes that work with any VS Code theme.