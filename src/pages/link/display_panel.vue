<template>
    <div>
        <div v-for="player in players"
             :key="player.name"
             class="container h100p w100p">
            <div class="name">
                {{ player.name }}
            </div>
            <block v-for="(item, index) in Object.values(player.map).flat()"
                   :key="index"
                   :is-show="item.isShown"
                   :type="item.type" />
        </div>
    </div>
</template>

<script>

import Block from './block';

export default {
    name: 'DisplayPanel',
    components: {
        Block
    },
    props: {
        server: {
            type: Object,
            require: true,
            default: () => ({})
        }
    },
    data () {
        return {
            players: []
        };
    },
    methods: {
        update (info) {
            this.players = info;
        }
    }
};
</script>

<style lang="less" scoped>
    .container {
        flex-wrap: wrap;
        display: flex;

        .name{
            color: #eeeeff;
            width: 100%;
        }

        /deep/ .block-item {
            height: 20px;
            flex: 0 0 20px;

            /deep/ i {
                width: 20px;
                height: 20px;
                font-size: 15px;
                line-height: 20px;
            }
        }
    }
</style>
