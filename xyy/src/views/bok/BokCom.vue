<template>
  <div>
    <div class="bookInfo animate__animated animate__fadeInDown">
      <el-card shadow="hover">

        <div slot="header" class="clearfix">
          <span style="align-self: center;">我的预约</span>
          <el-button type="text" style="margin-top:10px;" @click="cancel">取消预约</el-button>
        </div>
        <div>教室信息:<span style="color:blueviolet">{{ roomList.children[0].name }}</span></div>
        <div style="margin-top:10px;">座位信息:<span style="color:blueviolet">{{ roomList.name }}</span></div>
        <div style="margin-top:10px">预定时间:<span style="color:blueviolet">{{ roomList.dateTime }}</span></div>
      </el-card>

      
    </div>


  </div>
</template>

<script>
export default {
  name: 'bokCom',
  data() {
    return {
      roomList: [],
      user: JSON.parse(sessionStorage.getItem('user')),
      time: '',
    }

  },
  created() {
    let params = {
      adminId: this.user.id
    }
    console.log(params);
    this.getRequest('/book/classroom/dataInfo', params).then(resp => {
      console.log(resp)
      if (resp) {
        this.roomList = resp;
        console.log(resp)
        console.log(this.roomList)
        let param = this.times()
        this.roomList.dateTime = param

      }
    })
  },
  methods: {
    times() {
      var d = new Date(this.roomList.dateTime);
      var time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      return this.roomList.dateTime = time

    },
    cancel() {
      this.$confirm('确定取消预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: this.roomList.id
        }
        console.log(this.roomList.id)
        this.getRequest('/book/classroom/cancel', params).then(resp => {
          if (resp) {
            this.$router.push('/rve/com')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消预定'
        });
      });
    }
  }

}
</script>

<style scope>
.bookInfo {
  width: 40%;
  height: 400px;
  display: inline-block;

}

/* .el-card__header {
  /* 渐变浅灰色背景 
  background: linear-gradient(to right, #e6e6e6, #f2f2f2);
  color: white;
} */

.clearfix {
  display: flex;
  justify-content: space-between;
  font-size: 1.12rem;
  color: dimgray;
}

.clearfix .el-button {
  margin-top: 0 !important;
}
</style>