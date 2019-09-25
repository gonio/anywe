<template>
    <div>
        <div v-if="isLogin" class="login-content">
            <el-form v-if="isLogin" :model="form" :rules="rules" ref="form" label-width="130px">
                <el-form-item label="手机号 或 Email" prop="user">
                    <el-input v-model="form.user" @keyup.enter="signUp" placeholder="11 位手机号 或 Email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"
                              placeholder="请输入密码"
                              @keyup.enter="signUp"
                              type="password"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="text" class="forget">忘记密码</el-button>
            <el-button type="text" class="lf">手机验证码登录</el-button>
            <el-button class="w100p" type="primary" @click="login">登录</el-button>
            <el-button class="w100p" @click="change2SignUp">注册新账号</el-button>
        </div>
        <div v-if="!isLogin" class="login-content">
            <el-form v-if="!isLogin" :model="form" :rules="rules" ref="form" label-width="130px">
                <el-form-item label="手机号 或 Email" prop="user">
                    <el-input v-model="form.user" @keyup.enter="signUp" placeholder="11 位手机号 或 Email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"
                              placeholder="不少于 6 位的密码"
                              @keyup.enter="signUp"
                              type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="form.confirmPassword"
                              placeholder="不少于 6 位的密码"
                              @keyup.enter="signUp"
                              type="password"></el-input>
                </el-form-item>
            </el-form>
            <el-button class="w100p" type="primary" @click="signUp">注册</el-button>
            <el-button class="w100p" @click="back">已有账号登录</el-button>
        </div>
    </div>
</template>

<script>

    import { require, emailOrPhone } from '../util/valid';

    export default {
        props: {
            name: {
                type: String,
                default: 'loginModal'
            },
        },
        data () {
            return {
                form: {
                    user: '',
                    password: '',
                    confirmPassword: '',
                },
                title: '登录',

                isLogin: this.name === 'loginModal',
                rules: {
                    user: [require(), emailOrPhone()],
                    password: [require()],
                    confirmPassword: [require()],
                }
            };
        },
        methods: {
            /**
             * 登录
             * @returns {Promise<void>}
             */
            async login () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        const response = await this.Axios.post('login', {
                            user: this.form.user,
                            pwd: this.form.password
                        });
                        if (response) {
                            this.$store.dispatch('updateLoginInfo', response);
                        }
                    }
                });
            },
            /**
             * 注册
             * @returns {Promise<void>}
             */
            signUp () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        const response = await this.Axios.post('sign_up', {
                            user: this.form.user,
                            pwd: this.form.password
                        });
                        if (response) {
                            this.$message('注册成功');
                            this.back();
                        }
                    }
                });
            },
            back () {
                this.isLogin = true;
                this.title = '登录';
            },
            change2SignUp () {
                this.isLogin = false;
                this.title = '注册';
            },
        },
    };

</script>

<style lang="less" scoped>
    .login-content {
        width: 100%;
    }

    .el-button + .el-button {
        margin-left: 0;
        margin-top: 10px;
    }

    .forget {
        float: right;
        margin-top: -20px;
    }
</style>
