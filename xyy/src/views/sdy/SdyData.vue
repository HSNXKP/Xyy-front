<template>
  <div class="DataInfo animate__animated animate__fadeInDown">
    <div v-html="SdyData.content"></div>
    <div style="text-align:right">
      <span class="DataInfoTime"><br>发布时间:{{ SdyData.time | dateTime }}</span>
      <span class="DataInfoTime" style="text-align:top"><br>发布人:系统管理员</span>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    SdyData() {
      return this.$store.state.SdyData
    }
  },
  // 加载页面之前渲染数据
  created() {
    this.getRequest('/study/data/').then(resp => {
      if (resp) {
        this.$store.commit('initSdyData', resp)
        console.log(resp)
      } else {
        this.$message.error('获取公告失败')
      }
    })
  }
}
</script>

<style >
.DataInfo {
  margin-top: 20px 20px 20px 20px;
  font-size: 16px;
  color: #000000;
  text-align: left;
  line-height: 30px;
}

.DataInfoTime {
  font-size: 12px;
  color: #a12020;
  text-align: right;
}
</style>