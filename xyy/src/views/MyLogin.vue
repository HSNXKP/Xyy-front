<template>
    <div>
        <div v-show="show">
            <el-form ref="loginForm" :rules="rules" :model="loginForm" class="loginContainer " v-loading="loading"
                element-loading-text="正在登录......" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <h3 class="loginTitle">用户登录</h3>
                <el-form-item prop="username">
                    <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码">
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="请输入验证码"
                        style="width: 250px; margin-right: 5px;"></el-input>
                    <img :src="captchaUrl" @click="updateCaptcha">
                </el-form-item>
                    <div style="overflow:hidden">
                        <el-checkbox v-model="checked" class="loginRemember" >记住我</el-checkbox>
                    <el-link type="primary" @click="register" style="float:right">立即注册<i class="el-icon-d-arrow-right"></i></el-link>
                    </div>    
                <el-form-item>
                    <el-button type="primary" @click="submitLogin" style=" width:100%;margin-top: 10px;">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-show="!show">
            <el-form ref="registerForm" :rules="rules2" :model="registerForm" class="loginContainer" v-loading="loading"
                element-loading-text="正在注册......" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <h3 class="loginTitle">
                    账号注册</h3>
                <el-form-item prop="name" label="姓名">
                    <el-input type="text" auto-complete="false" v-model="registerForm.name" placeholder="请输入名字"
                        style="margin-left:13px"></el-input>
                </el-form-item>
                <el-form-item prop="username" label="用户名">
                    <el-input type="text" auto-complete="false" v-model="registerForm.username" placeholder="请输入用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" auto-complete="false" v-model="registerForm.password" placeholder="请输入密码"
                        style="margin-left:13px"></el-input>
                </el-form-item>
                <el-form-item style="margin-left:65px">
                    <el-radio v-model="registerForm.roleId" label="1">学生</el-radio>
                    <el-radio v-model="registerForm.roleId" label="2">老师</el-radio>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input type="text" auto-complete="false" v-model="registerForm.email" placeholder="请输入邮箱"
                        style="margin-left:13px"></el-input>
                </el-form-item>
                    <div>
                        <el-link type="primary" @click="login"> <i class="el-icon-d-arrow-left"></i>返回登录</el-link>
                    </div>
                <el-form-item>
                    <el-button v-loading="loading" type="primary" @click="submitRegister" style=" width:100%;margin-top: 10px;">注册
                    </el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>
<script>


export default {
    name: 'MyLogin',
    data() {
        return {
            captchaUrl: '/captcha?time=' + new Date(), //加入时间可换新的验证码图片
            loginForm: {
                username: '',
                password: '',
                code: '',
            },
            loading: false,
            checked: true,
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            },

            registerForm: {
                name: '',
                username: '',
                password: '',
                roleId: '1',
                email: '2979554858@qq.com',
            },
            rules2: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
            },
            show: true,

        }
    },
    methods: {
        submitLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.postRequest('/login', this.loginForm).then(resp => {
                        this.loading = false;
                        if (resp) {
                            // 请求具体的用户信息
                            this.getRequest('/admin/info').then(resp => {
                                if (resp) {
                                    // 拿到后端响应 提交用户信息到vuex、 
                                    this.$store.commit('initUserInfo', resp);
                                    // 存用户信息到sessionStorage 用于登录验证
                                    window.sessionStorage.setItem("user", JSON.stringify(resp));
                                    // 跳转页面
                                    let path = this.$route.query.redirect;
                                    this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                                }
                            });
                        }
                    }
                    )
                }
            })
        },
        register() {
            this.show = false;
            this.$nextTick(() => {
                this.$refs.registerForm.resetFields();
            });
        },
        login() {
            // 显示登录界面
            this.show = true;
            // 关闭登录界面的表单验证
            this.$nextTick(() => {
                this.$refs.loginForm.resetFields();
            });
        },
        updateCaptcha() {
            this.captchaUrl = '/captcha?time=' + new Date() //更新验证码
        },
        submitRegister() {
            // 表单校验
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.postRequest('/register', this.registerForm).then(resp => {
                        if (resp) {
                            //跳转首页
                            this.show = true;
                            // 关闭加载
                            this.loading = false;
                        } else {
                            this.loading = false;
                        }
                    })
                }
                else {
                    this.$message.error('请输入完整的信息！');
                    return false;
                }
            }
            );
        }

    },

}   
</script> 

<style >
.loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 80px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid rgb(231, 212, 212);
    box-shadow: 0 0 25px #cacaca;
}

.loginTitle {
    margin: 0px auto 40px auto;
    text-align: center
}

.loginRemember {
    text-align: left;
}

.el-form-item__content {
    display: flex;
    align-items: center;
}
</style>