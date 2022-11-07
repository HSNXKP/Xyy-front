<template>
  <div>
    <el-container style="height: 100vh;">
      <!--  侧边栏 -->
      <el-aside width="220px" style="height: 100%">
        <div class="homeAsideHeader">
          <h3 class="homeTitle">
            校园Yue
          </h3>
        </div>
        <el-menu style="height: calc(100% - 60px)" router unique-opened>
          <el-menu-item index="/home">
            <i class="el-icon-menu" style="color:blueviolet"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu :index="index + ''" v-for="(item,index) in routes" :key="index" v-show="!item.hidden">
            <template slot="title">
              <i :class="item.iconCls" style="color: blueviolet;margin-right: 5px"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item :index="children.path" v-for="(children, index) in item.children" :key="index">
              {{ children.name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>


      <!--  头导航栏 -->
      <el-container>
        <el-header class="homeHeader">

          <div class="userInfoName">
            <span>欢迎您，</span>
            <span style="margin:0 5px; color: blueviolet;">{{ user.name }}</span>
          </div>

          <el-dropdown class="userInfo" @command="commandHandler">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="adminInfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </el-header>
        <!--  main导航栏 -->
        <el-main>

          <el-breadcrumb v-if="this.$router.currentRoute.path != '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="mainInfo" v-if="this.$router.currentRoute.path == '/home'">
            欢迎来到校园Yue
          </div>
          <!-- 路由渲染栏 -->
          <router-view class="RouterView" />
          <el-dialog title="更新密码" :visible.sync="passwordDialogVisible" width="30%">
            <div>
              <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="请输入旧密码" prop="oldPass">
                  <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="请输入新密码" prop="pass">
                  <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPass">
                  <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitPassword('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
        </el-main>


      </el-container>
    </el-container>

  </div>
</template>
<script>
export default {
  name: 'MyHome',
  data() {
    // 2-5 修改密码校验规则 一定要放最前面
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      user: JSON.parse(sessionStorage.getItem('user')),
      ruleForm: {
        id: '',
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      passwordDialogVisible: false,
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes
    },


  },
  methods: {
    commandHandler(command) {
      if (command == 'logout') {
        this.$confirm('确定退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRequest('/logout');
          window.sessionStorage.removeItem('user');
          this.$store.commit('initUserInfo', []);
          this.$store.commit('initMenu', [])
          this.$store.commit('initRoutes', [])
          this.$store.commit('user', '');
          this.$store.commit('SdyData', '');
          this.$store.commit('initRooms',[])
          this.$store.commit('rooms',[])
          this.$router.replace('/')
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        })

      } else if (command == 'adminInfo') {
        this.$router.push('/AdminInfo')
      } else if (command == 'updatePassword') {
        this.passwordDialogVisible = true
      }
    },
    // 预处理表单 先进行自定义的密码校验 通过以后再校验
    submitPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 传递id 知道是哪个用户
          this.ruleForm.id = this.user.id
          this.postRequest('/', this.ruleForm).then(resp => {
            if (resp) {
              window.sessionStorage.removeItem('user');
              this.$store.commit('initUserInfo', []);
              this.$store.commit('initMenu', [])
              this.$store.commit('initRoutes', [])
              this.$store.commit('user', '');
              this.$store.commit('SdyData', '');
              this.$store.commit('initTeacherConfig',[])
              this.$router.push('/')
            }
          })
        }
      })
    },
    // 重置密码
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }

  },

}



</script>
<style scoped>
.homeHeader {
  /* 清除空白 */
  background-color: #a5b1bd;
  font-size: 12px;
  border-radius: 2px;
  display: flex;
  justify-content: right;
}

.homeTitle {
  display: flex;
  text-align: center;
  justify-content: space-between;
  margin-top: 0px;
  padding: 15px 15px;
  box-sizing: border-box;
}

.homeAsideHeader {
  background-color: #616d79;
  height: 60px;
  border-radius: 2px;
}

.userInfo {
  display: flex;
  align-items: center;
}

.userInfoName {
  display: flex;
  align-items: center;
}

.mainInfo {
  display: flex;
  justify-content: center;
  align-items: top;
  height: 100%;
  font-size: 20px;
  color: #616d79;
}

.RouterView {
  margin-top: 10px;
}
</style>
