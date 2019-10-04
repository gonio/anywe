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
                <el-button @click="onclickReady">
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
        <div v-if="status === statusMap.start"
             class="index-content">
            <block v-for="n in 400"
                   :key="n"
                   ref="blocks"
                   :index="n-1"
                   :is-show="map[n-1]"
                   :type="showType(map[n-1])"
                   :x="(n-1) % col"
                   :y="parseInt((n-1) / col, 10)"
                   @select="select" />
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
            <room :is-owner="isOwner" />
        </div>
    </div>
</template>

<script>

import { getRandom } from '../../util/util';
import { Communicate } from './communicate';
import Block from './block';
import Room from './room';
import { map1, type } from './map';

/**
 * 获取随机方块类型
 * @returns {number}
 */
function getType () {
    const random = getRandom();
    if (type[random] < 1) {
        return getExistType(random);
    }
    type[random]--;
    return random;
}

/**
 * 根据当前的随机数，寻找其右边、左边的还剩下的方块类型
 * @param {number} random        随机数
 * @returns         {number}
 */
function getExistType (random = 0) {
    const typeNum = 10;

    // 先寻找右边的还存在的类型
    for (; random < typeNum; random++) {
        if (type[random] > 0) {
            type[random]--;
            return random;
        }
    }

    // 在寻找其左边的还存在的类型
    for (let i = 0; i < random; i++) {
        if (type[i] > 0) {
            type[i]--;
            return i;
        }
    }
    return -1;
}

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
        Block,
        Room
    },
    data () {
        return {
            map: map1,
            col: 20, // 列、排方块的数量
            statusMap: STATUS_MAP,
            status: STATUS_MAP.init, // STATUS_MAP
            isOwner: false,
            isReady: false, // 是否准备
            roomList: {}
        };
    },
    computed: {
        isInRoom () {
            return this.status === STATUS_MAP.create || this.status === STATUS_MAP.join;
        }
    },
    mounted () {
        this.listGame();
    },
    methods: {

        /**
         * 把一维数组地图转成数组对象
         */
        initCoordinate () {
            let i = 0;
            this.coordinate = {}; // block数组对象，前端自用
            this.blockShowMap = {}; // block的isShown数组对象，用于和服务端同步

            this.$refs.blocks.forEach((item, key) => {
                if (key % this.col === 0 && key !== 0) {
                    i++;
                }
                this.coordinate[i] = this.coordinate[i] || [];
                this.coordinate[i].push(item);

                this.blockShowMap[i] = this.blockShowMap[i] || [];
                this.blockShowMap[i].push({ isShown: item.isShown });
            });
        },

        /**
         * 显示类型的计算
         * @param {number} isShow       1为显示，0为隐藏
         * @returns {number}
         */
        showType (isShow) {
            if (isShow === 1) {
                return getType();
            }
            return -1;
        },
        select (block) {

            // 不是点击同一个方块，要判断能不能消除
            if (this.block !== block && this.block) {
                if (this.canDestroy(this.block, block)) {
                    this.destroyBlock(this.block, block);
                    this.block = null;
                    if (this.checkAllDestroy()) {
                        this.gameOver();
                    }
                } else {
                    block.select();
                    this.block.deselect();
                    this.block = block;
                }
            } else {
                block.toggleSelect();
                this.block = block;
            }
        },

        /**
         * 判断两个方块是否能消除
         * @param {Block} block1
         * @param {Block} block2
         * @returns {boolean}
         */
        canDestroy (block1, block2) {
            if (block1.type === block2.type) {
                const [block1X, block1Y] = [block1.x, block1.y];
                const [block2X, block2Y] = [block2.x, block2.y];

                // 如果两方块靠在一起则直接返回true
                if ((Math.abs(block1X - block2X) === 1 && block1Y === block2Y) ||
                    (Math.abs(block1Y - block2Y) === 1 && block1X === block2X)) {
                    return true;
                }

                // 找出两个方块形成的矩形交集内是否可消除
                // 找出位置靠上、靠下的方块
                const [topYBlock, bottomYBlock] = this.getSortYBlocks(block1, block2);
                const [topYBlock1, topYBlock2] = this.getBlockYRange(topYBlock);
                const [bottomYBlock1, bottomYBlock2] = this.getBlockYRange(bottomYBlock);
                if (topYBlock2.y > bottomYBlock1.y) {
                    const intersectionTopY = Math.max(topYBlock1.y, bottomYBlock1.y);
                    const intersectionBottomY = Math.min(topYBlock2.y, bottomYBlock2.y);
                    for (let i = intersectionTopY + 1; i < intersectionBottomY; i++) {
                        if (!this.checkExistXLine(this.coordinate[i][block1X], this.coordinate[i][block2X])) {
                            return true;
                        }
                    }
                }

                // 找出位置靠左、靠右的方块
                const [leftXBlock, rightXBlock] = this.getSortXBlocks(block1, block2);
                const [leftXBlock1, leftXBlock2] = this.getBlockXRange(leftXBlock);
                const [rightXBlock1, rightXBlock2] = this.getBlockXRange(rightXBlock);
                if (leftXBlock2.x > rightXBlock1.x) {
                    const intersectionLeftX = Math.max(leftXBlock1.x, rightXBlock1.x);
                    const intersectionRightX = Math.min(leftXBlock2.x, rightXBlock2.x);
                    for (let i = intersectionLeftX + 1; i < intersectionRightX; i++) {
                        if (!this.checkExistYLine(this.coordinate[block1Y][i], this.coordinate[block2Y][i])) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        /**
         * 消除两个方块
         * @param {Block} block1
         * @param {Block} block2
         */
        destroyBlock (block1, block2) {
            block1.hide();
            block2.hide();
            this.blockShowMap[block1.y][block1.x] = { isShown: false };
            this.blockShowMap[block2.y][block2.x] = { isShown: false };
            this.server.send({});
        },

        /**
         * 检查是否全部消除完毕
         * @returns {boolean}
         */
        checkAllDestroy () {
            return !this.$refs.blocks.find((item) => item.isExist());
        },

        /**
         * 检查Y轴方向（竖线）两方块之间是否有遮挡
         * @param {Block} block1
         * @param {Block} block2
         * @returns {boolean}
         */
        checkExistYLine (block1, block2) {
            const [block1X, block1Y] = [block1.x, block1.y];
            const block2Y = block2.y;
            let minY = (block1Y > block2Y ? block2Y : block1Y) + 1;
            const maxY = (block1Y > block2Y ? block1Y : block2Y) - 1;
            for (; minY <= maxY; minY++) {
                if (this.coordinate[minY][block1X].isExist()) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 检查X轴方向（横线）两方块之间是否有遮挡
         * @param {Block} block1
         * @param {Block} block2
         * @returns {boolean}
         */
        checkExistXLine (block1, block2) {
            const [block1X, block1Y] = [block1.x, block1.y];
            const block2X = block2.x;
            let minX = (block1X > block2X ? block2X : block1X) + 1;
            const maxX = (block1X > block2X ? block1X : block2X) - 1;
            for (; minX <= maxX; minX++) {
                if (this.coordinate[block1Y][minX].isExist()) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 获取方块X轴方向（横线）可消除范围的边界方块
         * @param {Block}  block
         * @returns {*}
         */
        getBlockXRange (block) {
            const [blockX, blockY] = [block.x, block.y];
            let block1 = this.coordinate[blockY][0];
            let
                block2 = this.coordinate[blockY][this.col - 1];

            // 左边边界方块
            if (blockX === 0) {
                block1 = block;
            } else {
                for (let i = blockX - 1; i >= 0; i--) {
                    if (this.coordinate[blockY][i].isExist()) {
                        block1 = this.coordinate[blockY][i];
                        break;
                    }
                }
            }

            // 右边边界方块
            if (blockX === this.col - 1) {
                block2 = block;
            } else {
                for (let i = blockX + 1; i < this.col; i++) {
                    if (this.coordinate[blockY][i].isExist()) {
                        block2 = this.coordinate[blockY][i];
                        break;
                    }
                }
            }

            return [block1, block2];
        },

        /**
         * 获取方块Y轴方向（横线）可消除范围的边界方块
         * @param {Block}  block
         * @returns {*}
         */
        getBlockYRange (block) {
            const [blockX, blockY] = [block.x, block.y];
            let block1 = this.coordinate[0][blockX];
            let
                block2 = this.coordinate[this.col - 1][blockX];

            // 上边边界方块
            if (blockY === 0) {
                block1 = block;
            } else {
                for (let i = blockY - 1; i >= 0; i--) {
                    if (this.coordinate[i][blockX].isExist()) {
                        block1 = this.coordinate[i][blockX];
                        break;
                    }
                }
            }

            // 下边边界方块
            if (blockY === this.col - 1) {
                block2 = block;
            } else {
                for (let i = blockY + 1; i < this.col; i++) {
                    if (this.coordinate[i][blockX].isExist()) {
                        block2 = this.coordinate[i][blockX];
                        break;
                    }
                }
            }

            return [block1, block2];
        },

        /**
         * 获取按照X轴从小到大排序的方块
         * @param {Block} block1
         * @param {Block} block2
         * @returns {*[]}
         */
        getSortXBlocks (block1, block2) {
            return block1.x < block2.x ? [block1, block2] : [block2, block1];
        },

        /**
         * 获取按照Y轴从小到大排序的方块
         * @param {Block} block1
         * @param {Block} block2
         * @returns {*[]}
         */
        getSortYBlocks (block1, block2) {
            return block1.y < block2.y ? [block1, block2] : [block2, block1];
        },

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
                    isRoomOwner: true
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
            this.initCoordinate();
        },
        onclickReady () {
            this.isReady = true;
        },
        onclickQuit () {
            this.status = STATUS_MAP.init;
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
