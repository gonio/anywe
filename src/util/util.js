/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
    const { length } = list;
    let index = 0;
    let value;
    while (++index < length) {
        value = list[index];
        if (f(value, index, list)) {
            return value;
        }
    }
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {

    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, (c) => c.original === obj);
    if (hit) {
        return hit.copy;
    }

    const copy = Array.isArray(obj) ? [] : {};

    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    });

    Object.keys(obj).forEach((key) => {
        copy[key] = deepCopy(obj[key], cache);
    });

    return copy;
}

/**
 * forEach for object
 * @param {object} obj
 * @param {function} fn
 */
export function forEachValue (obj, fn) {
    Object.keys(obj).forEach((key) => fn(obj[key], key));
}

export function isObject (obj) {
    return obj !== null && typeof obj === 'object';
}

export function isPromise (val) {
    return val && typeof val.then === 'function';
}

export function assert (condition, msg) {
    if (!condition) {
        throw new Error(`[vuex] ${msg}`);
    }
}

/**
 * 获取范围随机数
 * @param {number} min      最小值
 * @param {number} max      最大值
 * @returns {number}
 */
export function getRandom (min = 0, max = 9) {
    return parseInt(Math.random() * 10000000 % (max + 1), 10) + min;
}
