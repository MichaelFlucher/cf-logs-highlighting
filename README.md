# CF Logs Highlighting

Highlights one-line Cloud Foundry logs that contain a CF envelope followed by
structured JSON.

The extension emphasizes:

- timestamps, process sources, and `STDOUT`/`STDERR`
- error, warning, info, and debug-style log levels
- logger names
- complete `msg` values, including escaped quotes and embedded JSON
- technical request and tracing fields using the original
  `comment.block.cflog` scope, allowing compatible themes to hide them against
  the editor background

Files ending in `.cflog` use the language automatically. Regular `.log` files
are detected from a first line such as:

```text
2026-08-19T09:00:12.752+0000 [APP/PROC/WEB/0] STDOUT {"level":"info",...}
```

Colors inherit from the active VS Code theme and do not modify global user
settings. Custom semantic token types start with `cfLog`, so they can also be
overridden through `editor.semanticTokenColorCustomizations`.

For escaped content inside messages, use the companion **UnEscape** extension's
**UnEscape Selection** command on a copied message or selection.