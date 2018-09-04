expect.extend({
    toContainPolyfillImport(sourceText, moduleName) {
        const importDeclaration = `require('${moduleName}');`;
        const importIndex = sourceText.indexOf(importDeclaration);

        if (importIndex < 0) {
            return {
                message: () => `Polyfill "${moduleName}" is not found`,
                pass: false
            };
        }

        const importLastIndex = sourceText.lastIndexOf(importDeclaration);

        if (importIndex !== importLastIndex) {
            return {
                message() {
                    return `Polyfill "${moduleName}" is imported several times: ${importIndex}, ${importLastIndex}`;
                },
                pass: false
            };
        }

        return {
            message: () => `Polyfill "${moduleName}" is found`,
            pass: true
        };
    }
});
