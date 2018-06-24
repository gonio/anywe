<template>
    <div class="hello">
        <h1>{{title}}</h1>
        <div v-if="isLogin">
            <div>
                <label for="user">用户名：</label>
                <input id="user" v-model="user" type="text" @keyup.enter="login">
            </div>
            <div>
                <label for="password">密码：</label>
                <input id="password" v-model="password" type="password" @keyup.enter="login">
            </div>
            <div class="btn btn-primary btn-lg" @click="login">登录</div>
            <div class="btn btn-primary btn-lg" @click="change2SignUp">注册</div>
        </div>
        <div v-if="!isLogin">
            <div>
                <label for="signUpUser">用户名：</label>
                <input id="signUpUser" v-model="user" type="text" @keyup.enter="signUp">
            </div>
            <div>
                <label for="signUpPassword">密码：</label>
                <input id="signUpPassword" v-model="password" type="password" @keyup.enter="signUp">
            </div>
            <div>
                <label for="confirmPassword">确认密码：</label>
                <input id="confirmPassword" v-model="confirmPassword" type="password"
                       @keyup.enter="signUp">
            </div>
            <div class="btn btn-primary btn-lg" @click="signUp">注册</div>
            <div class="btn btn-primary btn-lg" @click="back">返回登录</div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                title: '登录',
                user: '',
                password: '',
                confirmPassword: '',
                isLogin: true
            };
        },
        methods: {
            /**
             * 登录
             * @returns {Promise<void>}
             */
            async login () {
                const loader = this.$loading.show();
                const response = await this.Axios.post('login', { user: this.user, pwd: this.password });
                if (!response.success) {
                    this.$toast(response.msg);
                } else {
                    this.setUserInfo();
                    this.$router.push('/main');
                }
                loader.hide();
            },
            /**
             * 注册
             * @returns {Promise<void>}
             */
            async signUp () {
                if (!this.validate()) {
                    return;
                }
                const loader = this.$loading.show();
                const response = await this.Axios.post('signUp', { user: this.user, pwd: this.password });
                if (!response.success) {
                    this.$toast(response.msg);
                } else {
                    this.$toast('注册成功');
                    this.back();
                }
                loader.hide();
            },
            /**
             * 验证注册
             * @returns {boolean}
             */
            validate () {
                if (this.password !== this.confirmPassword) {
                    this.$toast('密码和确认密码不一致');
                    return false;
                }
                return true;
            },
            back () {
                this.isLogin = true;
                this.title = '登录';
            },
            change2SignUp () {
                this.isLogin = false;
                this.title = '注册';
            },
            setUserInfo () {
                this.$store.dispatch({
                    type: 'updateLoginInfo',
                    name: this.user
                });
            }
        }
    };

</script>

<style scoped>

</style>
