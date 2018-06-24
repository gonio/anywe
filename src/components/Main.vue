<template>
    <div v-if="isInit">
        <div>
            <div>{{name}}</div>
        </div>
        <div>
            <div class="btn btn-default">最新内容</div>
            <div>
                <div>分类</div>
                <div v-for="type in typeList" :key="type.id" class="btn btn-default">
                    {{type.text}}
                </div>
            </div>
        </div>
        <div v-for="title in titleList" :key="title.id">
            {{title.text}}
        </div>
        <div>
            <div class="btn btn-default">提问题</div>
            <div class="btn btn-default">写文章</div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isInit: true,
                name: '',
                titleList: [],
                typeList: []
            };
        },
        methods: {
            /**
             * 初始化请求
             * @returns {Promise<void>}
             */
            async initBlogData () {
                const loader = this.$loading.show();
                const response = await this.Axios.post('init');
                if (!response.success) {
                    this.$toast(response.msg);
                } else {
                    this.isInit = true;
                    this.name = response.data.name;
                    this.titleList = response.data.titleList || [];
                    this.typeList = response.data.typeList || [];
                }
                loader.hide();
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => vm.initBlogData());
        }
    };

</script>

<style scoped>

</style>
