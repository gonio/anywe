<template>
    <div class="block-item" :class="showClass" @click="onSelect">
        <i :class="showType"></i>
    </div>
</template>

<script>

    import { TYPE_MAP } from './Map';

    export default {
        name: 'Block',
        props: {
            isShow: {
                type: Number,
                default: 1
            },
            type: {
                type: Number,
                default: 0
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                selected: false,
                isShown: this.isShow === 1
            };
        },
        methods: {
            onSelect () {
                if (this.isShow === 1) {
                    this.$emit('select', this);
                }
            },
            select () {
                this.selected = true;
            },
            deselect () {
                this.selected = false;
            },
            toggleSelect () {
                this.selected = !this.selected;
            },
            hide () {
                this.isShown = false;
            },
            show () {
                this.isShown = true;
            },
            isExist () {
                return this.isShown;
            }
        },
        computed: {
            showClass () {
                let finalClass = this.isShown ? 'is-show' : 'is-hide';
                finalClass += this.selected ? ' is-selected' : '';
                return finalClass;
            },
            showType () {
                return TYPE_MAP[this.type];
            }
        }
    };
</script>

<style lang="less" scoped>
    .block-item {
        border: 1px #424242 solid;
        margin: 1px;
        flex: 0 0 40px;
        height: 40px;
        box-shadow: 3px 3px 3px 3px #ccc;
        i {
            display: inline-block;
            width: 40px;
            height: 40px;
            font-size: 30px;
            line-height: 40px;
        }
    }

    .is-show {
        visibility: visible;
    }

    .is-hide {
        visibility: hidden;
    }

    .is-selected {
        box-shadow: 2px 2px 3px 1px red;
        border: 1px red solid;
    }
</style>
