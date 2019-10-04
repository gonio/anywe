// initial state
// shape: [{ id, quantity }]
const state = {
    userName: '',
    userID: 1,
    isLogin: false
};

// getters
const getters = {};

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
     * @param {object} state
     * @param {object} info
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
