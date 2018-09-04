import {safariArrayUnshift} from '../../src/polyfills/es5.array.unshift';

test('es5.array.unshift', () => {
    const arr1: any[] = [];
    const arr2: any[] = [];
    const fn = () => {
        //
    };
    const args = ['1', 2, [3, 4], '5', undefined, fn];

    arr1.unshift = safariArrayUnshift;

    expect(arr1.unshift.apply(arr1, args)).toBe(arr2.unshift.apply(arr2, args));
    expect(arr1.slice(0)).toEqual(args);
    expect(arr1.slice(0)).toEqual(arr2);
});
