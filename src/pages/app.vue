<template>
    <div id="app">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal">
            <el-menu-item index="1">
                <router-link :to="'/'">
                    连连看
                </router-link>
            </el-menu-item>
            <el-button v-if="!isLogin"
                       @click="onClickLogin">
                立即登录
            </el-button>
            <el-button v-if="!isLogin"
                       @click="onClickSignUp">
                免费注册
            </el-button>
            <div v-if="isLogin">
                {{ name }}
            </div>
        </el-menu>
        <el-dialog :visible.sync="dialogVisible"
                   :close-on-click-modal="false">
            <div v-if="!isLogin">
                <login v-show="dialogType === TYPE_MAP.login"
                       name="loginModal" />
                <login v-show="dialogType === TYPE_MAP.sign"
                       name="signUpModal" />
            </div>
        </el-dialog>
        <router-view class="content" />
    </div>
</template>

<script>
import Login from '../components/login';

const TYPE_MAP = {
    login: 1,
    sign: 2
};

export default {
    name: 'App',
    components: {
        Login
    },
    data () {
        return {
            activeIndex: '1',
            TYPE_MAP,
            dialogVisible: false,
            dialogType: TYPE_MAP.login
        };
    },
    computed: {
        isLogin () {
            return this.$store.state.user.isLogin;
        },
        name () {
            return this.$store.state.user.userName;
        }
    },
    watch: {
        isLogin (isLogin) {
            if (isLogin) {
                this.dialogVisible = false;
            }
        }
    },
    created () {
        this.getUserInfo();
    },
    methods: {
        setActiveTab () {
            this.setNav(this.$route.path);
        },

        setNav (tab) {
            this.navs.forEach((nav) => {
                nav.actived = nav.path === tab;
            });
        },

        onClickLogin () {
            this.dialogVisible = true;
            this.dialogType = TYPE_MAP.login;
        },

        onClickSignUp () {
            this.dialogVisible = true;
            this.dialogType = TYPE_MAP.sign;
        },
        async getUserInfo () {
            const response = await this.Axios.post('/init', this.config);
            if (response) {
                this.$store.dispatch('updateLoginInfo', response);
                if (response.isLogin) {
                    this.dialogVisible = false;
                }
            }
        }
    }
};
</script>

<style lang="less" scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        background: #333333;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .index-header {
        height: 67px;
        border-top: 3px solid #009a61;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.1);
        background: #fafafa;

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .header-menu {
            position: relative;
            margin: 0;
            vertical-align: middle;
            line-height: 34px;
            display: inline-block;
            padding: 0 12px;
            height: 34px;
            color: #757575;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            border-radius: 4px;
            font-size: 16px;
            text-decoration: none;
            font-weight: 500;

            :hover {
                background-color: #F3F3F3;
            }

            .active {
                font-weight: 600;
                color: #009a61;
            }

            a {
                display: inline-block;
                padding: 0 12px;
                height: 34px;
                color: #757575;
                font-weight: 500;
                -moz-border-radius: 4px;
                -webkit-border-radius: 4px;
                border-radius: 4px;
                text-decoration: none;
            }
        }

        .header-login {
            color: #009a61;
            display: inline-block;
            padding: 0 12px;
            height: 34px;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: #F3F3F3;
            }
        }

        .header-sign-up {
            color: #fff;
            background-color: #009a61;
            border-color: #008151;
            padding: 0 13px;
            font-size: 14px;
            border-radius: 4px;
            height: 34px;
            font-weight: 500;
            display: inline-block;
            cursor: pointer;

            &:hover {
                color: #fff;
                background-color: #006741;
                border-color: #00432a;
            }
        }
    }

    .content{
        height: 100%;
    }
</style>
