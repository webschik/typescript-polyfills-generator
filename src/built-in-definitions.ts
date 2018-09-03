const arrayNatureIterators: string[] = ['es6.array.iterator'];
const commonIterators: string[] = ['es6.string.iterator'].concat(arrayNatureIterators);

export interface Definitions {
    [key: string]: string[];
}

export interface GroupDefinitions {
    [key: string]: Definitions;
}

export const builtIns: Definitions = {
    fetch: ['es6.fetch'],
    DataView: ['es6.typed.data-view'],
    Float32Array: ['es6.typed.float32-array'],
    Float64Array: ['es6.typed.float64-array'],
    Int8Array: ['es6.typed.int8-array'],
    Int16Array: ['es6.typed.int16-array'],
    Int32Array: ['es6.typed.int32-array'],
    Map: ['es6.map'].concat(commonIterators),
    Number: ['es6.number.constructor'],
    Promise: ['es6.promise'],
    RegExp: ['es6.regexp.constructor'],
    Set: ['es6.set'].concat(commonIterators),
    Symbol: ['es6.symbol', 'es7.symbol.async-iterator'],
    Uint8Array: ['es6.typed.uint8-array'],
    Uint8ClampedArray: ['es6.typed.uint8-clamped-array'],
    Uint16Array: ['es6.typed.uint16-array'],
    Uint32Array: ['es6.typed.uint32-array'],
    WeakMap: ['es6.weak-map'].concat(commonIterators),
    WeakSet: ['es6.weak-set'].concat(commonIterators)
};

export const instanceMethods: GroupDefinitions = {
    Object: {
        __defineGetter__: ['es7.object.define-getter'],
        __defineSetter__: ['es7.object.define-setter'],
        __lookupGetter__: ['es7.object.lookup-getter'],
        __lookupSetter__: ['es7.object.lookup-setter']
    },
    String: {
        anchor: ['es6.string.anchor'],
        big: ['es6.string.big'],
        blink: ['es6.string.blink'],
        bold: ['es6.string.bold'],
        codePointAt: ['es6.string.code-point-at'],
        endsWith: ['es6.string.ends-with'],
        fixed: ['es6.string.fixed'],
        fontcolor: ['es6.string.fontcolor'],
        fontsize: ['es6.string.fontsize'],
        includes: ['es6.string.includes'],
        italics: ['es6.string.italics'],
        link: ['es6.string.link'],
        padStart: ['es7.string.pad-start'],
        padEnd: ['es7.string.pad-end'],
        repeat: ['es6.string.repeat'],
        small: ['es6.string.small'],
        startsWith: ['es6.string.starts-with'],
        strike: ['es6.string.strike'],
        sub: ['es6.string.sub'],
        trim: ['es6.string.trim']
    },
    Array: {
        copyWithin: ['es6.array.copy-within'],
        entries: arrayNatureIterators,
        every: ['es6.array.is-array'],
        fill: ['es6.array.fill'],
        filter: ['es6.array.filter'],
        find: ['es6.array.find'],
        findIndex: ['es6.array.find-index'],
        forEach: ['es6.array.for-each'],
        includes: ['es7.array.includes'],
        indexOf: ['es6.array.index-of'],
        keys: arrayNatureIterators,
        lastIndexOf: ['es6.array.last-index-of'],
        map: ['es6.array.map'],
        reduce: ['es6.array.reduce'],
        reduceRight: ['es6.array.reduce-right'],
        slice: ['es6.array.slice'],
        some: ['es6.array.some'],
        sort: ['es6.array.sort'],
        values: arrayNatureIterators
    },
    Function: {
        bind: ['es6.function.bind'],
        name: ['es6.function.name']
    },
    Promise: {
        finally: ['es7.promise.finally']
    },
    RegExp: {
        flags: ['es6.regexp.flags'],
        match: ['es6.regexp.match'],
        replace: ['es6.regexp.replace'],
        search: ['es6.regexp.search'],
        split: ['es6.regexp.split'],
        toString: ['es6.regexp.to-string']
    },
    Date: {
        toISOString: ['es6.date.to-iso-string'],
        toJSON: ['es6.date.to-json'],
        toString: ['es6.date.to-string']
    }
};

export const staticMethods: GroupDefinitions = {
    Array: {
        from: ['es6.array.from'],
        isArray: ['es6.array.is-array'],
        of: ['es6.array.of']
    },
    Date: {
        now: ['es6.date.now']
    },
    Object: {
        assign: ['es6.object.assign'],
        create: ['es6.object.create'],
        defineProperty: ['es6.object.define-property'],
        defineProperties: ['es6.object.define-properties'],
        entries: ['es7.object.entries'],
        freeze: ['es6.object.freeze'],
        getOwnPropertyDescriptors: ['es7.object.get-own-property-descriptors'],
        is: ['es6.object.is'],
        isExtensible: ['es6.object.is-extensible'],
        isFrozen: ['es6.object.is-frozen'],
        isSealed: ['es6.object.is-sealed'],
        keys: ['es6.object.keys'],
        preventExtensions: ['es6.object.prevent-extensions'],
        seal: ['es6.object.seal'],
        setPrototypeOf: ['es6.object.set-prototype-of'],
        values: ['es7.object.values']
    },
    Math: {
        acosh: ['es6.math.acosh'],
        asinh: ['es6.math.asinh'],
        atanh: ['es6.math.atanh'],
        cbrt: ['es6.math.cbrt'],
        clz32: ['es6.math.clz32'],
        cosh: ['es6.math.cosh'],
        expm1: ['es6.math.expm1'],
        fround: ['es6.math.fround'],
        hypot: ['es6.math.hypot'],
        imul: ['es6.math.imul'],
        log1p: ['es6.math.log1p'],
        log10: ['es6.math.log10'],
        log2: ['es6.math.log2'],
        sign: ['es6.math.sign'],
        sinh: ['es6.math.sinh'],
        tanh: ['es6.math.tanh'],
        trunc: ['es6.math.trunc']
    },
    String: {
        fromCodePoint: ['es6.string.from-code-point'],
        raw: ['es6.string.raw']
    },
    Number: {
        EPSILON: ['es6.number.epsilon'],
        MIN_SAFE_INTEGER: ['es6.number.min-safe-integer'],
        MAX_SAFE_INTEGER: ['es6.number.max-safe-integer'],
        isFinite: ['es6.number.is-finite'],
        isInteger: ['es6.number.is-integer'],
        isSafeInteger: ['es6.number.is-safe-integer'],
        isNaN: ['es6.number.is-nan'],
        parseFloat: ['es6.number.parse-float'],
        parseInt: ['es6.number.parse-int']
    },
    Promise: {
        all: commonIterators,
        race: commonIterators
    },
    Reflect: {
        apply: ['es6.reflect.apply'],
        construct: ['es6.reflect.construct'],
        defineProperty: ['es6.reflect.define-property'],
        deleteProperty: ['es6.reflect.delete-property'],
        get: ['es6.reflect.get'],
        getOwnPropertyDescriptor: ['es6.reflect.get-own-property-descriptor'],
        getPrototypeOf: ['es6.reflect.get-prototype-of'],
        has: ['es6.reflect.has'],
        isExtensible: ['es6.reflect.is-extensible'],
        ownKeys: ['es6.reflect.own-keys'],
        preventExtensions: ['es6.reflect.prevent-extensions'],
        set: ['es6.reflect.set'],
        setPrototypeOf: ['es6.reflect.set-prototype-of']
    }
};
