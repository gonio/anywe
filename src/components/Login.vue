<template>
    <modal class="hello" :name="name" height="auto" :title="我十一个">
        <div v-if="isLogin" class="login-content">
            <div class="form-group">
                <label for="username" class="control-label">手机号 或 Email</label>
                <input type="text" v-model="user" class="form-control" id="username"
                       @keyup.enter="login" placeholder="11 位手机号 或 Email" autocomplete="off">
            </div>
            <div class="form-group clearfix">
                <label class="control-label">密码</label>
                <span class="pull-right">
                        <span class="a-link float-right">忘记密码</span>
                    </span>
                <input type="password" class="form-control" name="password" v-model="password"
                       @keyup.enter="login" placeholder="请输入密码">
            </div>
            <div class="form-group clearfix">
                <span class="a-link">手机验证码登录</span>
            </div>
            <div class="form-group">
                <div class="btn-block btn btn-primary pl20 pr20" @click="login">登录</div>
            </div>
            <div class="form-group">
                <div class="btn-block btn btn-default pl20 pr20" @click="change2SignUp">注册新账号</div>
            </div>
        </div>
        <div v-if="!isLogin" class="login-content">
            <div class="form-group">
                <label for="name" class="control-label">你的名字</label>
                <input type="text" class="form-control" id="name" required="" placeholder="真实姓名或常用昵称">
            </div>
            <div class="form-group">
                <label for="mail" class="control-label">手机号 或 Email</label>
                <input type="text" class="form-control" id="mail" placeholder="11 位手机号 或 Email">
            </div>
            <div class="form-group">
                <label for="password" class="control-label">密码</label>
                <input type="password" class="form-control" id="password" required="" placeholder="不少于 6 位的密码">
            </div>
            <div class="form-group">
                <label for="confirmPassword" class="control-label">确认密码</label>
                <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword"
                       placeholder="不少于 6 位的密码" @keyup.enter="signUp">
            </div>
            <div class="form-group clearfix">
                <div class="btn-block btn btn-primary pl20 pr20" @click="signUp">注册</div>
            </div>
            <div class="form-group clearfix">
                <div class="btn-block btn btn-default pl20 pr20" @click="back">已有账号登录</div>
            </div>
        </div>
    </modal>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: 'loginModal'
            },
        },
        data () {
            return {
                user: '',
                password: '',
                confirmPassword: '',
                isLogin: this.name === 'loginModal'
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

<style lang="less" scoped>
    .login-content {
        padding: 0 150px;
    }
</style>
