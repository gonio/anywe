// initial state
// shape: [{ id, quantity }]

const state = {
    players: [], // 玩家信息
    info: {
        title: '',
        id: ''
    }
};

// getters
const getters = {};

// actions
const actions = {
    updatePlayersInfo ({ commit }, list) {
        commit('setPlayersInfo', list);
    },
    updateRoomInfo ({ commit }, info) {
        commit('setRoomInfo', info);
    }
};

// mutations
const mutations = {

    /**
     * 设置玩家信息
     * @param {object} state
     * @param {array|string} list
     */
    setPlayersInfo (state, list) {
        try {
            list = JSON.parse(list);
        } catch (e) {
            if (!Array.isArray(list)) {
                list = [];
            }
        }
        state.players = list;
    },

    /**
     * 设置房间信息
     * @param {object} state
     * @param {object} info
     */
    setRoomInfo (state, info) {
        Object.assign(state.info, info);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
