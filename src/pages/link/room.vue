<template>
    <div class="room-container">
        <div style="height: 5%;width: 100%;"
             class="name">
            {{ title }}
        </div>
        <div v-for="index in limit"
             :key="index"
             class="box rel">
            <div class="name">
                {{ players[index-1]?players[index-1].name:'' }}
            </div>
            <el-button v-if="isShowKick(players[index-1])"
                       type="warning"
                       icon="el-icon-close"
                       class="kick"
                       circle
                       @click="onClickKick(players[index-1])" />
            <div v-if="players[index-1]&&players[index-1].isReady"
                 class="ready">
                已准备
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
            const isExist = players.some(item => item.name === this.name);
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
            this.server.send({
                type: 'kick',
                id: player.name
            });
        },
        isShowKick (player) {
            return player && !player.isOwner;
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
        background: #409EFF;
        height: 50px;
        line-height: 50px;
        position: absolute;
        bottom: 0;
        width: 100%;
        color: #eeeeff;
        font-size: 30px;
    }

    .kick {
        position: absolute;
        right: 0;
        top: 0;
    }

    .name{
        color: #eeeeff;
        font-size: 30px;
    }
</style>
