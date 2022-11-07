<template>
    <el-card shadow="hover" style="width:60%">
      <el-form ref="DataInfo" v-model="DataInfo">
        <div style="color:blueviolet;justify-items: left;">公告修改:</div>
        <div class="block">
          <span class="demonstration" style="color:blueviolet">选择发布时间: </span>
          <el-date-picker v-model="DataInfo.time" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </div>

        <el-input type="textarea" v-model="DataInfo.content" :rows="10" placeholder="请输入发布的公告内容" maxlength="500"
          show-word-limit style="margin-top:8px">
        </el-input>
        <el-button type="primary" style="margin-top:10px" @click="submitData">发布公告</el-button>
      </el-form>


    </el-card>

</template>

<script>

export default {
  data() {
    return {
      DataInfo: {
        id: '',
        content: '',
        time: '',
      }
    }
  },
  computed:{
   
  },
  methods: {
    submitData() {
      let param = this.times();
      this.DataInfo.time = param;
      this.DataInfo.id = 1;
      console.log(this.DataInfo);
      this.postRequest('/study/data/', this.DataInfo).then(resp => {
        if (resp) {
          // 清除vuex中的公告信息
          this.$store.commit('initSysData', [])
          this.DataInfo.content = ''
          this.DataInfo.time = ''
        } else {
          this.$message.error('发布失败')
        }
      })
    },
    times(){
        var d = new Date(this.DataInfo.time);
        var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
         return datetime;
    }
   
  },
  
  

}
</script>

<style>

</style>