<template>
    <div class="index-content">
        <div class="index-left">左</div>
        <div class="index-middle">内容</div>
        <div class="index-right">右</div>
    </div>
</template>

<style lang="less" scoped>
    .index-content {
        max-width: 1200px;
        display: flex;
        margin: 30px auto 0;
        padding: 0 15px 0;
        .index-left, .index-right {
            flex: 0 0 auto;
            width: 200px;
            padding: 0 15px 0;
        }

        .index-middle {
            flex: 1 1 auto;
            padding: 0 15px 0;
        }
    }
</style>
