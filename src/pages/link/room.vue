<template>
    <div class="room-container">
        <div style="height: 5%;width: 100%;">
            {{ title }}
        </div>
        <div v-for="index in limit"
             :key="index"
             class="box">
            <div>{{ players[index-1]?players[index-1].name:'' }}</div>
            <el-button v-if="isOwner && index !==1">
                踢
            </el-button>
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
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
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
</style>
