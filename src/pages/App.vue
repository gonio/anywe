<template>
    <div id="app">
        <div class="index-header">
            <div class="header-content">
                <div class="col-sm-8 col-md-9 col-lg-9">
                    <div class="header-menu" v-for="nav in navs" :key="nav.path" @click="setActiveTab">
                        <router-link :to="nav.path" :class="{active: nav.actived}">{{nav.text}}</router-link>
                    </div>
                </div>
                <div v-if="!isLogin" class="col-sm-4 col-md-3 col-lg-3">
                    <div>
                        <div class="header-menu header-login" @click="onClickLogin">立即登录</div>
                        <login name="loginModal"/>
                        <div class="header-menu header-sign-up" @click="onClickSignUp">免费注册</div>
                        <login name="signUpModal"/>
                    </div>
                </div>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import Login from '../components/Login';

    export default {
        name: 'App',
        data () {
            const navs = [{
                path: '/',
                text: '连连看'
            }, {
                path: '/qa',
                text: '问答'
            }, {
                path: '/main',
                text: '专栏'
            }, {
                path: '/class',
                text: '讲堂'
            }].map((nav) => {
                nav.actived = nav.path === this.$route.path;
                return nav;
            });

            return {
                navs,
                isLogin: false
            };
        },
        // async beforeCreate () {
        //     const response = await this.Axios.post('init');
        //     if (response) {
        //         this.$store.dispatch({
        //             type: 'updateLoginInfo',
        //             userName: response.userName,
        //             isLogin: response.isLogin
        //         });
        //         this.isLogin = response.isLogin;
        //     }
        // },
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
                this.$modal.show('loginModal', { title: '登录' });
            },

            onClickSignUp () {
                this.$modal.show('signUpModal', { title: '注册' });
            }
        },
        components: {
            Login
        }
    };
</script>

<style lang="less" scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
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
</style>
