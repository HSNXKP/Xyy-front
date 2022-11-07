<template>
    <div>

        自习室预约:
        <el-row :gutter="15" style="margin-top:10px">

            <div class="info" >
                <!-- 在卡片上面进行遍历数据 -->
                <el-card shadow="hover" class="roomInfo animate__animated animate__fadeInDown"
                    v-for="(item, index) in rooms" :key="index"  >
                    <div slot="header">
                        <div style="color:blueviolet">{{ item.name }}</div>
                        <div>自习室值班教师：<span style="color:blueviolet" v-if="(teacherRoom[index].admin.name)">{{ teacherRoom[index].admin.name }}</span></div>
                    </div>
                    <div>
                        <div >
                            <div>自习室在线人数：<span style="color:green" v-if="(sumInfo[index])" >{{ sumInfo[index].sum }}</span></div>
                            <div>自习室剩余座位：<span style="color:red" v-if="(sumInfo[index])"> {{ sumInfo[index].sum1 }}</span></div>
                        </div>

                        <div class="seatInfo">
                            <el-button v-for="(children, index) in item.children" :key="index"
                                :disabled="children.disabled ? true : false" style="margin-left:10px"
                                @click="book(children.id)">
                                <i class="el-icon-user"></i>{{ children.name }}
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
    name: 'RveCom',
    data() {
        return {
            adminRoom: {
                adminId: '',
                roomId: '',
            },
            // sumInfo: [
            //     {
            //         sum: '',
            //         sum1: '',
            //     }
            // ],
            // teacherRoom: [],

        }

    },
    computed: {
        rooms() {
            return this.$store.state.rooms;
        },
        user() {
            return this.$store.state.user;
        },
        // 没有setter方法 设置setter方法
        teacherRoom: {
            get() {
                return this.$store.state.teacherRoom;
            },
            set(val) {
                this.$store.commit('initTeacherRoom', val)
            }
        },
        sumInfo() {
            return this.$store.state.sumInfo;
        }





        // user: JSON.parse(sessionStorage.getItem('user')),
    },
    methods: {
        book(id) {
            // 动态传参取值
            this.adminRoom.adminId = this.user.id
            this.adminRoom.roomId = id

            this.$confirm('是否预定该位置', '座位预定', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(this.adminRoom)
                this.putRequest('/reserve/classroom/', this.adminRoom).then(resp => {
                    if (resp) {
                        console.log('1');
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消预定'
                });
            });
        },
        // 遍历this.rooms打印当前this.rooms.children每个数组的disbaled为true的座位的总和 将每个children 的sum结果都放到数组里
        // 遍历this.rooms打印当前this.rooms.children每个数组的存在disbaled的座位的总和
        roomInfo() {
            let sum = 0;
            let sum1 = 0;
            let arr = [];
            for (let i = 0; i < this.rooms.length; i++) {
                for (let j = 0; j < this.rooms[i].children.length; j++) {
                    if (this.rooms[i].children[j].disabled) {
                        sum++;
                    }
                    sum1 += 1;
                }
                arr.push({
                    sum: sum,
                    sum1: sum1 - sum,
                })
                sum = 0;
                sum1 = 0;
            }
            return arr;
        },

    },
    // 创建 页面之前发送请求
    created() {
        // 查询老师所在的自习室
        this.postRequest('/reserve/classroom/').then(resp => {
            if (resp) {
                console.log(resp)
                this.$store.commit('initTeacherRoom', resp)
                this.teacherRoom = resp;
            }
        })



        // 查询自习室的座位信息
        this.getRequest('/reserve/classroom/').then(resp => {
            if (resp) {
                console.log(resp)
                this.$store.commit('initRooms', resp);

            }
        })

        // 将this.roomInfo()的结果赋值给this.roomsInfo
        this.$store.commit('initSumInfo', this.roomInfo())






    }

}
</script>
  
<style scoped>
.roomInfo {
    height: 400px;
    border-color: rgb(188, 166, 209);
}

.info {
    display: grid;
    grid-template-rows: 3fr 3fr 3fr;
    grid-template-columns: 3fr 3fr 3fr;
    grid-column-gap: 10px;
    grid-row-gap: 20px;
    /* flex-direction: row;
    flex-wrap: wrap; */
}

.seatInfo {
    display: grid;
    grid-template-rows: 3fr 3fr 3fr;
    grid-template-columns: 3fr 3fr 3fr;
    grid-column-gap: 4px;
    grid-row-gap: 4px;
    margin-top: 10px;
}
</style>