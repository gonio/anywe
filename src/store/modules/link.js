// initial state
// shape: [{ id, quantity }]
const state = {
    roomName: '', // 房间名
    roomID: 0, // 房间ID
    indexID: 0, // 玩家排列序号，0为房主
    others: [], // 其他玩家的进度
};

// getters
const getters = {
    roomID: (state) => state.roomID,
    roomName: (state) => state.roomName,
    isRoomOwner: (state) => state.indexID === 0,

};

// actions
const actions = {
    updateRoomInfo({ commit }, info) {
        commit('setRoomInfo', info);
    },
};

// mutations
const mutations = {

    /**
     * 设置房间信息
     * @param state
     * @param info
     */
    setRoomInfo(state, info) {
        Object.assign(state, info);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
