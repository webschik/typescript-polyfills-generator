// https://github.com/es-shims/es5-shim/issues/449
// IMPORTANT: the second number is greater than a signed 32bit int
export function safariArrayUnshift(this: any[]): number {
    const args: any[] = [0, 0];

    args.push.apply(args, arguments);
    Array.prototype.splice.apply(this, args);
    return this.length;
}

const testArr: number[] = [0, 2147483648];

testArr.shift(); // remove the first element so arr is [2147483648]
testArr[1] = 1; // Safari < 11 fails to add the new element and the array is unchanged

// in Safari < 11 testArr[1] is 1, but testArr is [2147483648]
if (testArr.length === 1) {
    Array.prototype.unshift = safariArrayUnshift;
    Array.prototype.shift = function() {
        return Array.prototype.splice.call(this, 0, 1)[0];
    };
}
