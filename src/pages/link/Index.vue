<template>
    <div class="index-content">
        <block v-for="n in 400" :key="n" :index="n-1" ref="blocks"
               :is-show="map[n-1]"
               :type="showType(map[n-1])"
               :x="(n-1) % col"
               :y="parseInt((n-1) / col, 10)"
               @select="select"></block>
    </div>
</template>

<script>

    import { getRandom } from '../../util/util';
    import Block from './Block';
    import { map1, type } from './Map';

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
     * @param random    {number}    随机数
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

    export default {
        data () {
            return {
                map: map1,
                col: 20 // 列、排方块的数量
            };
        },
        components: {
            Block
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
                this.coordinate = {};
                this.$refs.blocks.forEach((item, key) => {
                    if (key % this.col === 0 && key !== 0) {
                        i++;
                    }
                    this.coordinate[i] = this.coordinate[i] || [];
                    this.coordinate[i].push(item);
                });
            },
            /**
             * 显示类型的计算
             * @param isShow    {number}    1为显示，0为隐藏
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
             * @param block1
             * @param block2
             * @returns {boolean}
             */
            canDestroy (block1, block2) {
                if (block1.type === block2.type) {
                    const [block1X, block1Y] = [block1.x, block1.y];
                    const [block2X, block2Y] = [block2.x, block2.y];

                    // 如x轴相等
                    if (block1X === block2X) {
                        const [block11, block12] = this.getBlockXRange(block1);
                        const [block21, block22] = this.getBlockXRange(block2);

                        // 找出最小可消除X轴范围
                        const minX = block11.x > block21.x ? block11.x : block21.x;
                        const maxX = block12.x < block22.x ? block12.x : block22.x;
                        for (let i = minX + 1; i < maxX; i++) {
                            if (this.checkExistOneYLine(this.coordinate[block1Y][i], this.coordinate[block2Y][i])) {
                                return false;
                            }
                        }
                    }

                    // 如y轴相等
                    if (block1Y === block2Y) {
                        const [block11, block12] = this.getBlockYRange(block1);
                        const [block21, block22] = this.getBlockYRange(block2);

                        // 找出最小可消除Y轴范围
                        const minY = block11.y > block21.y ? block11.y : block21.y;
                        const maxY = block12.y < block22.y ? block12.y : block22.y;
                        for (let i = minY + 1; i < maxY; i++) {
                            if (this.checkExistOneXLine(this.coordinate[i][block1X], this.coordinate[i][block2X])) {
                                return false;
                            }
                        }
                        window.console.log(minY, maxY);
                    }

                    // 如x轴和y轴都不等
                    return true;
                }
                return false;
            },
            /**
             * 消除两个方块
             * @param block1
             * @param block2
             */
            destroyBlock (block1, block2) {
                block1.hide();
                block2.hide();
            },
            /**
             * 检查是否全部消除完毕
             * @returns {boolean}
             */
            checkAllDestroy () {
                return !this.$refs.blocks.find(item => item.isExist());
            },
            gameOver () {

            },
            /**
             * 检查Y轴方向（竖线）两方块之间是否有遮挡
             * @param block1
             * @param block2
             * @returns {boolean}
             */
            checkExistOneYLine (block1, block2) {
                const [block1X, block1Y] = [block1.x, block1.y];
                const block2Y = block2.y;
                let minY = (block1Y > block2Y ? block2Y : block1Y) + 1;
                const maxY = (block1Y > block2Y ? block1Y : block2Y) - 1;
                for (; minY <= maxY; minY++) {
                    if (this.coordinate[minY][block1X].isExist()) {
                        return true;
                    }
                }
                window.console.log(minY, maxY);
                return false;
            },
            /**
             * 检查X轴方向（横线）两方块之间是否有遮挡
             * @param block1
             * @param block2
             * @returns {boolean}
             */
            checkExistOneXLine (block1, block2) {
                const [block1X, block1Y] = [block1.x, block1.y];
                const block2X = block2.x;
                let minX = (block1X > block2X ? block2X : block1X) + 1;
                const maxX = (block1X > block2X ? block1X : block2X) - 1;
                for (; minX <= maxX; minX++) {
                    if (this.coordinate[block1Y][minX].isExist()) {
                        return true;
                    }
                }
                window.console.log(minX, maxX);
                return false;
            },
            /**
             * 获取方块X轴方向（横线）可消除范围的边界方块
             * @param block
             * @returns {*}
             */
            getBlockXRange (block) {
                const [blockX, blockY] = [block.x, block.y];
                let block1 = this.coordinate[blockY][0], block2 = this.coordinate[blockY][this.col - 1];

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
             * @param block
             * @returns {*}
             */
            getBlockYRange (block) {
                const [blockX, blockY] = [block.x, block.y];
                let block1 = this.coordinate[0][blockX], block2 = this.coordinate[this.col - 1][blockX];

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
            }
        }
    };
</script>

<style lang="less" scoped>
    .index-content {
        width: 920px;
        display: flex;
        margin: 30px auto 0;
        padding: 15px;
        flex-wrap: wrap;
        border: 1px solid #eef;
        box-shadow: 3px 3px 10px 3px #ccc;
    }
</style>
