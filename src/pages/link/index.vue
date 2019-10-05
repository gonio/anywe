<template>
    <div class="h100p pt100 container">
        <div class="top">
            <div v-show="status === statusMap.init">
                <el-button @click="createGame">
                    创建游戏
                </el-button>
                <el-button @click="listGame">
                    刷新
                </el-button>
            </div>
            <div v-show="status === statusMap.create">
                <div>显示所有玩家形象</div>
                <div>等待玩家准备</div>
                <el-button v-if="isOwner"
                           @click="onclickReady">
                    开始
                </el-button>
                <el-button v-else
                           @click="onclickReady">
                    准备
                </el-button>
                <el-button @click="onclickQuit">
                    退出
                </el-button>
            </div>
            <div v-show="status === statusMap.join">
                <div>显示所有玩家形象</div>
                <div>等待玩家准备</div>
                <el-button @click="onclickReady">
                    准备
                </el-button>
                <el-button @click="onclickQuit">
                    退出
                </el-button>
            </div>
            <div v-show="status === statusMap.over">
                <div>输了</div>
                <el-button @click="onclickReady">
                    准备
                </el-button>
                <el-button @click="onclickQuit">
                    退出
                </el-button>
            </div>
            <div v-show="status === statusMap.win">
                <div>赢了</div>
                <el-button @click="onclickReady">
                    准备
                </el-button>
                <el-button @click="onclickQuit">
                    退出
                </el-button>
            </div>
        </div>
        <div v-if="status === statusMap.start">
            <game-panel class="index-content"
                        @gameOver="gameOver" />
        </div>
        <div v-if="status === statusMap.init">
            <div v-for="(item,index) in roomList"
                 :key="index"
                 class="room-list"
                 @click="selectRoom(item.id)">
                {{ item.title }}
            </div>
        </div>
        <div v-show="status === statusMap.over">
            <div>游戏结束</div>
        </div>
        <div v-if="isInRoom"
             class="h100p">
            <room :is-owner="isOwner"
                  :is-ready="isReady"
                  :server="server"
                  @kick="onclickQuit" />
        </div>
    </div>
</template>

<script>

import { Communicate } from './communicate';
import GamePanel from './game_panel';
import Room from './room';

const STATUS_MAP = {
    init: 1,
    create: 2,
    join: 3,
    start: 4,
    over: 5,
    win: 6
};

export default {
    components: {
        GamePanel,
        Room
    },
    data () {
        return {
            col: 20, // 列、排方块的数量
            statusMap: STATUS_MAP,
            status: STATUS_MAP.init, // STATUS_MAP
            isOwner: false,
            isReady: false, // 是否准备
            roomList: {},
            server: null
        };
    },
    computed: {
        isInRoom () {
            return this.status === STATUS_MAP.create || this.status === STATUS_MAP.join;
        },
        name () {
            return this.$store.state.user.userName;
        },
        players () {
            return this.$store.state.link.players || [];
        }
    },
    mounted () {
        this.listGame();
    },
    methods: {

        /**
         * 游戏结束gg
         */
        gameOver () {
            this.status = STATUS_MAP.over;
        },

        /**
         * 游戏赢了
         */
        win () {
            this.status = STATUS_MAP.win;
            this.server.send({ type: 'win' });
        },
        createGame () {
            this.status = STATUS_MAP.create;
            this.isOwner = true;
            this.server = new Communicate({
                vm: this,
                data: {
                    isRoomOwner: true,
                    roomID: this.name
                }
            });
        },
        async listGame () {
            const response = await this.Axios.post('/room/list');
            if (response) {
                this.roomList = response;
            }
        },
        startGame () {
            this.status = STATUS_MAP.start;
            this.$nextTick(() => this.initCoordinate());
        },
        onclickReady () {
            if (this.isOwner) {
                const isReady = this.players.some(player => player.name !== this.name && player.isReady);
                if (isReady) {
                    this.server.start();
                }
                return;
            }

            this.isReady = !this.isReady;
            this.server.send({ type: 'update', isReady: this.isReady });
        },
        onclickQuit () {
            this.status = STATUS_MAP.init;
            this.isReady = false;
            this.listGame();
            this.server.close();
        },
        selectRoom (id) {
            this.status = STATUS_MAP.join;
            this.isOwner = false;
            this.server = new Communicate({
                vm: this,
                data: {
                    isRoomOwner: false,
                    roomID: id
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
    .container {
        display: flex;
        flex-direction: column;
    }

    .index-content {
        width: 920px;
        display: flex;
        margin: 30px auto 0;
        padding: 15px;
        flex-wrap: wrap;
        border: 1px solid #eef;
        box-shadow: 3px 3px 10px 3px #ccc;
        height: 100%;
    }

    .top {
        height: 100px;
    }

    .room-list {
        height: 50px;
        width: 500px;
        border: 1px solid #eeeeff;
        border-radius: 5px;
        color: #eeeeff;
        line-height: 50px;
        cursor: pointer;
    }
</style>
