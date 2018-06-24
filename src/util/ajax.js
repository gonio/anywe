import Axios from 'axios';
import logger from './logger';

/**
 * 初始化 axios 一些统一的配置
 */

export default {
    install
};

function install (Vue) {
    // Axios.defaults.headers.post['Content-Type'] = 'application/json';
    // Axios.defaults.baseURL = '/hyz';
    Axios.interceptors.response.use(response => response.data, (error) => {
        logger.error(error);
        return Promise.resolve({ success: false, msg: '与服务器通讯失败！' });
    });

    Vue.Axios = Axios;
    Object.defineProperties(Vue.prototype, {
        Axios: {
            get () {
                return Axios;
            }
        }
    });
}
