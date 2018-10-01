// initial state
// shape: [{ id, quantity }]
const state = {
    userName: '',
    isLogin: false
};

// getters
const getters = {
    userName: state => state.userName,
    isLogin: state => state.isLogin,
};

// actions
const actions = {
    updateLoginInfo ({ commit }, info) {
        commit('setLoginInfo', info);
    }
};

// mutations
const mutations = {

    /**
     * 设置登录用户信息
     * @param state
     * @param info
     */
    setLoginInfo (state, info) {
        Object.assign(state, info);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
