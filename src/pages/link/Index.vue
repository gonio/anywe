<template>
    <div class="index-content">
        <block v-for="n in 400" :key="n" ref="blocks"
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
                    this.coordinate[i] = this.coordinate[i] || [];
                    this.coordinate[i].push(item);
                    if (key % col === 0) {
                        i++;
                    }
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
                block.selected = !block.selected;
                window.console.log(block);
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
