<template>
  <div>
    <el-card shadow="hover" class="dataInfo animate__animated animate__fadeInDown" v-show="show">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-link type="primary" @click="updateInfo" style="float: right;">修改个人信息<i class="el-icon-d-arrow-right"></i>
        </el-link>
      </div>

      <div>
        <el-form ref="updateForm" :model="updateForm" label-width="80px">
          <el-form-item label="姓名">
            <span>{{ user.name }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span>{{ user.username }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ user.email }}</span>
          </el-form-item>

        </el-form>
      </div>
    </el-card>


    <el-card shadow="hover" style="width:50%" v-show="!show">
      <div slot="header" class="clearfix">
        <span>个人信息修改</span>
      </div>

      <div>
        <el-form ref="updateForm" :model="updateForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="updateForm.name" type="text" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="updateForm.username" type="text" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="updateForm.email" type="text" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="update">修改信息</el-button>
            <el-button @click="cancle">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>


</template>

<script>
export default {
  name: 'userInfo',
  data() {
    return {
      updateForm: {
        id: '',
        name: '',
        username: '',
        email: ''
      },
      user: JSON.parse(sessionStorage.getItem('user')),
      // true 显示个人信息，false 显示修改个人信息
      show: true,
    }

  },
  methods: {
    update() {
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          this.updateForm.id = this.user.id;
          this.putRequest('/update', this.updateForm).then(resp => {
            if (resp) {
              // 清除vuex 和 sessionStorage中的user信息
              window.sessionStorage.removeItem('user');
              this.$store.commit('initUserInfo', []);
              this.$store.commit('user', '');
              // 请求用户信息
              this.getRequest('/admin/info').then(resp => {
                // 拿到后端响应 提交用户信息到vuex、 
                this.$store.commit('initUserInfo', resp);
                // 存用户信息到sessionStorage 用于登录验证
                window.sessionStorage.setItem("user", JSON.stringify(resp));
                // 跳转页面
                this.$router.push('/adminInfo');
              })
              this.show = true
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      })
    },
    updateInfo() {
      this.show = false
    },
    cancle() {
      this.show = true
    }
  },

}





</script>

<style scoped>
.dataInfo {
  width: 50%;
}
.clearfix {
  overflow: hidden;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>