<template>
    <div class="room-container">
        <div style="height: 5%;width: 100%;">
            {{ title }}
        </div>
        <div v-for="index in limit"
             :key="index"
             class="box">
            <div>{{ players[index-1]?players[index-1].name:'' }}</div>
            <el-button v-if="isOwner && index !==1"
                       @click="onClickKick(players[index-1])">
                踢
            </el-button>
            <div v-if="players[index-1]&&players[index-1].isReady"
                 class="ready">
                准备
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Room',
    props: {
        isOwner: {
            type: Boolean,
            default: true
        },
        isReady: {
            type: Boolean,
            default: false
        },
        server: {
            type: Object,
            require: true,
            default: () => {
                return {};
            }
        }
    },
    data () {
        return {
            limit: 4 // 每个房间的人数上限
        };
    },
    computed: {
        players () {
            return this.$store.state.link.players || [];
        },
        title () {
            return this.$store.state.link.info.title;
        },
        id () {
            return this.$store.state.link.info.id;
        },
        name () {
            return this.$store.state.user.userName;
        }
    },
    watch: {
        players (players) {
            const isExist = players.some(item => item.name  === this.name);
            if (!isExist) {
                this.$alert('您已经被请离房间');
                this.$emit('kick');
            }
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
        },
        onClickKick (player = {}) {
            this.server.send({ type: 'kick', id: player.name });
        }
    }
};
</script>

<style lang="less" scoped>
    .room-container {
        display: flex;
        flex-wrap: wrap;
        height: 100%;
    }

    .box {
        border: 1px solid #cccccc;
        background: #555555;
        border-radius: 5px;
        width: 48%;
        height: 47.5%;
        box-sizing: border-box;
    }

    .ready {
        border: 1px solid #ffffff;
        background: #cccccc;
        border-radius: 5px;
        width: 48%;
        height: 30px;
    }
</style>
