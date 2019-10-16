<template>
    <div class="w100p">
        <block v-for="(item, index) in blocks"
               :key="index"
               ref="blocks"
               :is-show="item.isShown"
               :type="item.type"
               :x="index % col"
               :y="parseInt(index / col, 10)"
               @select="select" />
    </div>
</template>

<script>

import Block from './block';
import { map1 } from './map';

export default {
    name: 'GamePanel',
    components: {
        Block
    },
    props: {
        server: {
            type: Object,
            require: true,
            default: () => {
                return {};
            }
        },
        blockShowMap: {
            type: Object,
            require: true,
            default: () => {
                return {};
            }
        }
    },
    data () {
        return {
            count: 0, // 方块的数量
            map: map1,
            col: 20 // 列、排方块的数量
        };
    },
    computed: {
        blocks () {
            return Object.values(this.blockShowMap).flat();
        }
    },
    mounted () {
        this.initCoordinate();
    },
    methods: {

        /**
         * 把一维数组地图转成数组对象
         */
        initCoordinate () {
            let i = 0;
            this.coordinate = {}; // block数组对象，前端自用

            this.$refs.blocks.forEach((item, key) => {
                if (key % this.col === 0 && key !== 0) {
                    i++;
                }
                this.coordinate[i] = this.coordinate[i] || [];
                this.coordinate[i].push(item);
                if (item.isShown) {
                    this.count++;
                }
            });
        },

        select (block) {

            // 不是点击同一个方块，要判断能不能消除
            if (this.block !== block && this.block) {
                if (this.canDestroy(this.block, block)) {
                    this.destroyBlock(this.block, block);
                    this.block = null;
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
            this.blockShowMap[block1.y][block1.x] = { isShown: 0 };
            this.blockShowMap[block2.y][block2.x] = { isShown: 0 };
            this.count += -2;

            if (this.count === 0) {
                this.server.send({ type: 'win' });
                return;
            }
            this.server.send({
                type: 'update',
                map: this.blockShowMap
            });
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
            let block2 = this.coordinate[blockY][this.col - 1];

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
