<template>
    <div class="block-item" :class="showClass" @click="onSelect">
        <i :class="showType"></i>
    </div>
</template>

<script>

    import { TYPE_MAP, STATUS_CLASS_MAP } from './Map';

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
            },
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                selected: false,
                isShown: this.isShow === 1,
                status: this.isShow === 1 ? 'show' : 'hide',
            };
        },
        methods: {
            onSelect () {
                if (this.isShown) {
                    this.$emit('select', this);
                }
            },
            select () {
                this.status = 'selected';
            },
            deselect () {
                this.status = 'show';
            },
            toggleSelect () {
                this.status = this.status === 'selected' ? 'show' : 'selected';
            },
            hide () {
                this.status = 'hide';
                this.isShown = false;
            },
            show () {
                this.status = 'show';
                this.isShown = true;
            },
            isExist () {
                return this.isShown;
            },
            destroy () {
                this.status = 'destroy';
                return this.isShown;
            }
        },
        computed: {
            showClass () {
                switch (this.status) {
                    case 'show':
                        return STATUS_CLASS_MAP.show;
                    case 'hide':
                        return STATUS_CLASS_MAP.hide;
                    case 'selected':
                        return STATUS_CLASS_MAP.selected;
                    case 'destroy':
                        return STATUS_CLASS_MAP.destroy;
                    default:
                        return STATUS_CLASS_MAP.show;
                }
            },
            showType () {
                return TYPE_MAP[this.type];
            }
        }
    };
</script>

<style lang="less" scoped>
    .normal-i() {
        display: inline-block;
        width: 40px;
        height: 40px;
        font-size: 30px;
        line-height: 40px;
    }

    .normal-block-item() {
        margin: 1px;
        flex: 0 0 40px;
        height: 40px;
    }

    .block-item {
        .normal-block-item();
        border: 1px #424242 solid;
        box-shadow: 3px 3px 3px 3px #ccc;
        i {
            .normal-i()
        }
    }

    /*横线*/
    .block-x-line {
        .normal-block-item();
        border: 1px transparent solid;
        border-top: 1px solid black;
    }

    /*竖线*/
    .block-y-line {
        .normal-block-item();
        border: 1px transparent solid;
        border-left: 1px solid black;
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
