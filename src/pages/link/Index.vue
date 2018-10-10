<template>
    <div class="index-content">
        <block v-for="n in 400" :key="n" :index="n-1" ref="blocks"
               :is-show="map[n-1]"
               :type="showType(map[n-1])"
               @select="select"></block>
    </div>
</template>

<script>

    import { getRandom } from '../../util/util';
    import Block from './Block';
    import { map1, type } from './Map';

    // 列、排方块的数量
    const col = 20;

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
                map: map1
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
                    if (key % col === 0 && key !== 0) {
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
                    const [block1X, block1Y] = this.getXY(block1);
                    const [block2X, block2Y] = this.getXY(block2);

                    // 如x轴或y轴相等，两点连线无遮挡则消除
                    if (block1X === block2X) {
                        let minY = (block1Y > block2Y ? block2Y : block1Y) + 1;
                        const maxY = (block1Y > block2Y ? block1Y : block2Y) - 1;
                        for (; minY <= maxY; minY++) {
                            if (this.coordinate[minY][block1X].isExist()) {
                                return false;
                            }
                        }
                    }
                    if (block1Y === block2Y) {
                        let minX = (block1X > block2X ? block2X : block1X) + 1;
                        const maxX = (block1X > block2X ? block1X : block2X) - 1;
                        for (; minX <= maxX; minX++) {
                            if (this.coordinate[block1Y][minX].isExist()) {
                                return false;
                            }
                        }
                    }
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
             * 获取方块的xy坐标
             * @param block
             * @returns {number[]}
             */
            getXY (block) {
                return [block.index % col, parseInt(block.index / col, 10)];
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
