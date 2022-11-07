<template>
    <div>
<!-- 插槽 学生信息和学生的座位信息 -->
        <el-dialog title="学生信息" :visible.sync="dialogFormVisible">
            <el-table :data="studentRoomInfo">
                <el-table-column label="座位" prop="name" >
                </el-table-column>
                <el-table-column label="姓名" prop="admin.name"  width="100">
                </el-table-column>
                <el-table-column label="用户名" prop="admin.username" width="150">
                </el-table-column>
                <el-table-column label="邮箱" prop="admin.email" width="180">
                </el-table-column>
                <el-table-column label="自习时间" prop="dateTime" width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.dateTime | dateTime}}</span>
                    </template>
                </el-table-column>
            </el-table>

        </el-dialog>


        <el-row :gutter="15" style="margin-top:10px">
            <div class="info">
                <!-- 在卡片上面进行遍历数据 -->
                <el-card shadow="hover" class="roomInfo animate__animated animate__fadeInDown"
                    v-for="(item, index) in teacherConfig" :key="index">
                    <div slot="header">
                        <div>自习室：<span style="color:blueviolet">{{ item.name }}</span></div>
                        <div>值班教师：<span style="color:blueviolet">{{ item.admin.name }}</span></div>
                    </div>
                    <div>

                        <div class="studentInfo">
                            <el-button v-for="(children, index) in item.children" :key="index" style="margin-left:10px"
                                class="buttonInfo"
                                @click="studentInfo(children.admin.id, children.id), dialogFormVisible = true"
                                slot="reference">
                                <i class="el-icon-user"></i>{{ children.name }}
                                <div>
                                    <span> {{ children.admin.name }}</span>
                                </div>
                            </el-button>

                        </div>
                    </div>
                </el-card>
            </div>
            <!-- </el-col> -->
        </el-row>


    </div>


</template>
  
<script>
export default {
    name: 'ComCfg',
    data() {
        return {
            dialogFormVisible: false,
            studentRoomInfo: [],
            

        }

    },
    methods: {
        // 学生信息请求 根据座位id和adminId 查询
        studentInfo(adminId, roomId) {
            let params = {
                adminId: adminId,
                roomId: roomId,
            }
            console.log(params);
            this.getRequest('/classroom/config/student', params).then(resp => {
                if (resp) {
                    console.log(resp);
                    // this.$store.commit('initStudentRoomInfo', resp);
                    // 将dateTime
                    this.studentRoomInfo = resp;
                    // 将studentRoomInfo.dateTime中的T替换成空格
                    

                    console.log(this.studentRoomInfo);
                    // this.studentRoomInfo.forEach(item => {
                    //     item.dateTime = this.$moment(item.dateTime).format('YYYY-MM-DD HH:mm:ss');
                    // })
                    
                    
                   
                    console.log(this.studentRoomInfo);
                }
            })
        },
        times() {
            var d = new Date(this.studentRoomInfo.dateTime);
            var time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
            return this.studentRoomInfo.dateTime = time
        },
    },
    computed: {
        teacherConfig() {
            return this.$store.state.teacherConfig
        },
        user() {
            // JSOn格式转换
            return JSON.parse(sessionStorage.getItem('user'))
        },

        // studentRoomInfo() {
        //     return this.$store.state.studentRoomInfo;

        // }
    },
    created() {
        let param = {
            adminId: this.user.id
        }
        // 老师管理的自习室信息请求
        this.getRequest('/classroom/config/', param).then(resp => {
            if (resp) {
                this.$store.commit('initTeacherConfig', resp)
                console.log(resp);
            }
        })
    }

}
</script>
  
<style scoped>
.info {
    display: grid;
    /* 4行排列 */
    grid-template-rows: 3fr 3fr 3fr 3fr;
    grid-template-columns: 3fr 3fr ;
    grid-column-gap: 10px;
    grid-row-gap: 20px;
    /* flex-direction: row;
    flex-wrap: wrap; */
}

.roomInfo {
    width: 400px;
}

.studentInfo {
    display: grid;
    grid-template-rows: 3fr 3fr 3fr;
    grid-template-columns: 3fr 3fr 3fr;
    grid-column-gap: 10px;
    grid-row-gap: 20px;
}

.buttonInfo:hover {
    scale: 1.1;
    border-radius: 12px;
}


</style>