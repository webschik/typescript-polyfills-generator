// @ts-ignore
import * as browserslist from 'browserslist';
import * as ts from 'typescript';

export interface PolyfillsGeneratorOptions {
    targets?: string;
}

export class PolyfillsGenerator {
    private targets: string[];

    constructor (options: PolyfillsGeneratorOptions) {
        this.targets = browserslist(options.targets);
        this.onNode = this.onNode.bind(this);
    }

    private onNode (node: ts.Node) {
        ts.forEachChild(node, this.onNode);
    }

    process (source: string): Promise<string> {
        const sourceFile: ts.SourceFile = ts.createSourceFile(
            'unknown',
            source,
            ts.ScriptTarget.Latest,
            false
        );

        this.onNode(sourceFile);

        return Promise.resolve(source);
    }
}