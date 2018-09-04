declare namespace jest {
    interface Matchers<R> {
        toContainPolyfillImport (moduleName: string): R;
    }
}