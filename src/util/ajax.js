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
    Axios.interceptors.response.use(({ data }) => {
        if (!data.success) {
            Vue.prototype.$alert(data.msg || '与服务器通讯失败！');
            return null;
        }
        return data.data || true;
    }, (error) => {
        logger.error(error);
        Vue.prototype.$alert('与服务器通讯失败！');
        return Promise.resolve(null);
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
