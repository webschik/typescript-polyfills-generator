export const elementInArray: any = [1, '2', 3, null].find((value) => value === 3);
export const elementIndexInArray: number = [1, '2', 3, null].findIndex((value) => value === '2');
export const hasTwoInArray: boolean = [1, '2', 3, null].includes('2');
export const hasTwoInString: boolean = '123'.includes('2');
export const paddedStartNumber: string = '9'.padStart(2, '0');
export const paddedEndNumber: string = '2'.padEnd(3, '0');
export const arrayFromString: string[] = Array.from('foo');
export const fulfilledPromise: Promise<object> = Promise.resolve({});

const {isNaN} = Number;
const {invalidMethod} = Array;

export const isNotGlobalNaN = isNaN;

Object.assign({}, {value: 1});

export const request = fetch;
export const locationOrigin = location.origin;

const testArr: number[] = [0, 2147483648];

testArr.shift();
testArr[1] = 1;

export const testSet = new Set();
