const allBuiltInsWithSupportInfo = require('../data/built-ins.json');
const allPolyfills = require('../data/polyfills.json');
const features = require('../data/built-in-features.js');

describe('built-ins and polyfills', () => {
    const featuresWithSupportInfo = Object.keys(allBuiltInsWithSupportInfo);

    test('generated support info for all features', () => {
        expect(featuresWithSupportInfo.length).toBeGreaterThan(0);
        expect(featuresWithSupportInfo.length).toBeGreaterThan(Object.keys(features).length);
    });

    featuresWithSupportInfo.forEach((feature) => {
        test(`Feature ${feature} should have env. support info`, () => {
            const supportInfo = allBuiltInsWithSupportInfo[feature];

            expect(supportInfo).toBeDefined();
            expect(Object.keys(supportInfo).length).toBeGreaterThan(0);
        });
        test(`Feature ${feature} should have a polyfill`, () => {
            expect(allPolyfills[feature]).toBeDefined();
        });
    });
});
