import semverify from '../src/semverify';

test('version normalization', () => {
    expect(semverify('')).toBe('0.0.1');
    expect(semverify('1')).toBe('1.0.0');
    expect(semverify('2.1')).toBe('2.1.0');
    expect(semverify('2.1.4')).toBe('2.1.4');
});
