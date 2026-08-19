import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { findCfLogTokens } from './tokenizer';

describe('findCfLogTokens', () => {
    it('highlights the CF envelope and important JSON values', () => {
        const line = '2026-08-19T09:00:12.752+0000 [APP/PROC/WEB/0] STDOUT {"level":"info","logger":"DeltaServiceClient","msg":"status=200 body={\\"changed\\":0}"}';
        const tokens = findCfLogTokens(line);

        assert.deepEqual(
            tokens.map(({ kind }) => kind),
            [
                'cfLogTimestamp',
                'cfLogSource',
                'cfLogStream',
                'cfLogLevelInfo',
                'cfLogLogger',
                'cfLogMessage',
            ]
        );
        assert.equal(
            line.slice(tokens[5].start, tokens[5].start + tokens[5].length),
            '"status=200 body={\\"changed\\":0}"'
        );
    });

    it('uses distinct token types for warning, error, and debug levels', () => {
        assert.equal(findCfLogTokens('{"level":"warning"}')[0].kind, 'cfLogLevelWarning');
        assert.equal(findCfLogTokens('{"level":"fatal"}')[0].kind, 'cfLogLevelError');
        assert.equal(findCfLogTokens('{"level":"trace"}')[0].kind, 'cfLogLevelDebug');
    });

    it('supports UTC timestamps ending in Z', () => {
        assert.equal(
            findCfLogTokens('2026-08-19T09:00:12.752Z message')[0].kind,
            'cfLogTimestamp'
        );
    });
});
