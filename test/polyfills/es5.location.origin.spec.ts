const originLocation = (global as Window & NodeJS.Global).location;

beforeEach(() => {
    Object.defineProperty(global, 'location', {
        writable: true,
        value: {
            protocol: 'http:',
            hostname: '127.0.0.1',
            port: '5000'
        }
    });
});

afterAll(() => {
    Object.defineProperty(global, 'location', {
        writable: true,
        value: originLocation
    });
});

test('es5.location.origin', () => {
    expect(location.origin).toBeUndefined();
    require('../../src/polyfills/es5.location.origin.ts');
    expect(location.origin).toBe('http://127.0.0.1:5000');
});
