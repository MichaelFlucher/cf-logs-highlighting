interface TokenColor {
    foreground: string;
    fontStyle: string;
}

export interface CfLogColors {
    cfLogTimestamp: TokenColor;
    cfLogUnImportant: TokenColor;
    cfLogSemiImportant: TokenColor;
    cfLogMessage: TokenColor;
    cfLogLogLevel: TokenColor;
    cfLogServiceName: TokenColor;
}

export interface ExtensionConfiguration {
    defaultColors: boolean;
    cfLogColors: CfLogColors;
}
