/**
 * 验证表单规则
 */
export function require (msg) {
    return {
        required: true,
        message: msg || '该项为必填项',
        trigger: 'change'
    };
}

export function email (msg) {
    return {
        type: 'email',
        message: msg || '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
    };
}

export function emailOrPhone (msg) {
    return {
        validator: (rule, value, callback) => {
            if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)
                || /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
                callback(new Error(msg || '请输入邮箱或者手机号'));
            } else {
                callback();
            }
        },
        trigger: 'change'
    };
}

export function numberRange (min = 0, max = 95) {
    return {
        validator: (rule, value, callback) => {
            if (value < min || value >= max) {
                callback(new Error(`请输入${min}至${max}之间的整数`));
            } else {
                callback();
            }
        },
        trigger: 'change'
    };
}

export function stringLength (length) {
    return {
        validator: (rule, value, callback) => {
            if (getLength(value) > length) {
                callback(new Error(`请输入长度小于${length}的字符串`));
            } else {
                callback();
            }
        },
        trigger: 'change'
    };
}

function getLength (string) {
    return encodeURIComponent(string).replace('').length;
}
