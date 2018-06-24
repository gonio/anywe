/**
 * Created by ued on 2015/10/13.
 */

function getStorage (...args) {
    return localStorage.getItem(...args);
}

function setStorage (...args) {
    return localStorage.setItem(...args);
}


function removeStorage (...args) {
    return localStorage.removeItem(...args);
}

function clear (...args) {
    return localStorage.clear(...args);
}

function getLength () {
    return localStorage.length;
}

function getKey (...args) {
    return localStorage.key(args);
}

export {
    getStorage,
    setStorage,
    removeStorage,
    clear,

    getKey,
    getLength
};
