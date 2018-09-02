import {builtIns, staticMethods, instanceMethods} from '../src/built-in-definitions';

const allBuiltInsWithEsVersion = require('../data/built-ins.json');
const allPolyfills = require('../data/polyfills.json');

function testPolyfills(polyfills: string[]) {
    test('polyfills exist', () => expect(polyfills.length).toBeGreaterThan(0));

    polyfills.forEach((polyfill) => {
        test(`${polyfill} should have env. support info`, () => {
            expect(allBuiltInsWithEsVersion[polyfill]).toBeDefined();
        });
        test(`${polyfill} should have polyfill`, () => {
            expect(allPolyfills[polyfill]).toBeDefined();
        });
    });
}

describe('support info & polyfills for builtIns definitions', () => {
    const builtInsNames: string[] = Object.keys(builtIns);

    test('definitions exist', () => expect(builtInsNames.length).toBeGreaterThan(0));

    builtInsNames.forEach((name) => {
        describe(name, () => testPolyfills(builtIns[name]));
    });
});

describe('support info & polyfills for instanceMethods definitions', () => {
    const builtInsNames: string[] = Object.keys(instanceMethods);

    test('builtIns exist', () => expect(builtInsNames.length).toBeGreaterThan(0));

    builtInsNames.forEach((name) => {
        describe(name, () => {
            const definitions: {[key: string]: string[]} = instanceMethods[name];
            const instanceMethodNames: string[] = Object.keys(definitions);

            test('definitions exist', () => expect(instanceMethodNames.length).toBeGreaterThan(0));

            instanceMethodNames.forEach((instanceMethod) => testPolyfills(definitions[instanceMethod]));
        });
    });
});

describe('support info & polyfills for staticMethods definitions', () => {
    const builtInsNames: string[] = Object.keys(staticMethods);

    test('builtIns exist', () => expect(builtInsNames.length).toBeGreaterThan(0));

    builtInsNames.forEach((name) => {
        describe(name, () => {
            const definitions: {[key: string]: string[]} = staticMethods[name];
            const staticMethodNames: string[] = Object.keys(definitions);

            test('definitions exist', () => expect(staticMethodNames.length).toBeGreaterThan(0));

            staticMethodNames.forEach((staticMethod) => testPolyfills(definitions[staticMethod]));
        });
    });
});
