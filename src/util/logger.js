/**
 * Created by ued on 2016/11/7.
 */

/**
 * UI 日志接口封装
 * @param   {String}   type 日志类型
 * @returns {Function}      返回实际接口
 * @private
 */
function _logger (type) {
    return (...args) => {
        if (process.env.NODE_ENV === 'development' && window.console) {
            if (window.console[type]) {
                window.console[type](...args);
            }
        }
    };
}

const debug = _logger('debug');
const info = _logger('info');
const log = _logger('log');
const warn = _logger('warn');
const error = _logger('error');
const table = _logger('table');

export default {
    debug,
    info,
    log,
    warn,
    error,
    table,
};
