<template>
    <div class="index-content">
        <block v-for="n in 40" :key="n" :is-show="map[n-1]" :type="showType(map[n-1])"></block>
    </div>
</template>

<script>

    import { getRandom } from '../../util/util';
    import Block from './Block';
    import { map1, type } from './Map';

    // 列、排方块的数量
    const col = 20;

    export default {
        data () {
            return {
                map: map1,
                count: 0
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
                this.map.forEach((item, key) => {
                    if (key % col === 0) {
                        i++;
                    }
                    this.coordinate[i] = this.coordinate[i] || [];
                    this.coordinate[i].push(item);
                });
            },
            getType () {
                const random = getRandom();
                window.console.log('get');
                --type[random];
                // if (--this.type[random] < 0) {
                //     return this.getType();
                // }
                return type[random];
            },
            showType (isShow) {
                this.count++;
                if (isShow === 1) {
                    return this.getType();
                }
                return 0;
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
