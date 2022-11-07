<template>
  <div>
    <el-card class="roomInfo animate__animated animate__fadeInDown">
      <span style="font-size:14px"> 自习室信息</span>
      <el-button size="mini" type="text" style="margin-left:10px" @click="classRoomAdd">增加自习室</el-button>
      <el-tree :data="listRoom" :props="defaultProps" :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => look(node, data)">
              查看
            </el-button>
            <el-button type="text" size="mini" @click="edit(node, data)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-card>
    <!-- 自习室 教师的弹窗 -->
    <el-dialog title="教师值班信息" :visible.sync="dialogTeacherInfo">
      <el-table :data="teacherInfo" v-if="teacherInfo.length != 0">
        <el-table-column property="admin.name" label="姓名" width="200"></el-table-column>
        <el-table-column property="dateTime" label="值班时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.dateTime | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column property="expireTime" label="结束时间" width="200">
          <template slot-scope="scope">
          <span>{{ scope.row.expireTime | dateTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 自习室 学生的弹窗 -->
    <el-dialog title="学生自习信息" :visible.sync="dialogStudentInfo">
      <el-table :data="studentInfo" v-if="studentInfo.length != 0">
        <el-table-column property="admin.name" label="姓名" width="200"></el-table-column>
        <el-table-column property="dateTime" label="自习时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.dateTime | dateTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 编辑自习室弹窗 -->
    <el-dialog :visible.sync="dialogClassRoomInfo" class="dialog">
      <span slot="title">
        更改自习室信息
        <el-button type="primary" size="mini" style="margin-left: 10px;" @click="classSeatAdd"><i
            class="el-icon-plus"></i>增加座位</el-button>
            <el-select size="mini" v-model="adminRoomId"  placeholder="请选择管理的教师" style="margin-left:10px" @change="changeTeacher">
          <el-option v-for="(item,index) of teacherList"  :label="item.name" :key="index" :value="item.id"></el-option>
        </el-select>
      </span>
      <!-- 内置自习室的增加座位弹窗 -->
      <el-dialog width="30%" title="增加自习室座位" :visible.sync="innerVisible" append-to-body>
        <div slot="footer" class="dialog-footer">
          <!-- 增加自习室座位  -->
          <el-form :model="classRoomForm">
            <el-form-item label="座位名称" :label-width="formLabelWidth">
              <el-input v-model="classRoomForm.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="dialogClassRoomInfo = false">取 消</el-button>
          <el-button type="primary" @click="addSeat">确 定</el-button>
        </div>
      </el-dialog>
      <el-form :model="classRoomForm">
        <el-form-item label="自习室名称" :label-width="formLabelWidth">
          <el-input v-model="classRoomForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassRoomInfo = false">取 消</el-button>
        <el-button type="primary" @click="classRoomUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑座位弹窗 -->
    <el-dialog :visible.sync="dialogClassSeatInfo" title="更改座位信息" class="dialog">
      <el-form :model="classSeatForm">
        <el-form-item label="座位名称" :label-width="formLabelWidth">
          <el-input v-model="classSeatForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassSeatInfo = false">取 消</el-button>
        <el-button type="primary" @click="classSeatUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加自习室弹窗 -->
    <el-dialog :visible.sync="dialogClassRoomAdd" class="dialog">
      <span slot="title">
        增加自习室
        <el-select size="mini" v-model="adminRoomId"  placeholder="请选择管理的教师">
          <el-option v-for="(item,index) of teacherList"  :label="item.name" :key="index" :value="item.id"></el-option>
        </el-select>
      </span>
      <el-form :model="classRoomForm">
        <el-form-item label="自习室名称" :label-width="formLabelWidth">
          <el-input v-model="classRoomForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClassRoomAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoom">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'SysCfg',
  data() {
    return {
      listRoom: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogTeacherInfo: false,
      dialogStudentInfo: false,
      dialogClassRoomInfo: false,
      dialogClassSeatInfo: false,
      dialogClassRoomAdd: false,
      innerVisible: false,
      teacherInfo: [],
      studentInfo: [],
      teacherList: [],
      adminRoomId: '',
      adminRoom:{
        adminId:'',
        roomId:''
      },
      classRoomForm: {
        id: '',
        name: '',
      },
      classSeatForm: {
        id: '',
        name: '',
      },
      formLabelWidth: '90px'
    }
  },
  mounted() {
    this.rooms();
  },
  methods: {
    rooms() {
      this.postRequest('/system/config/').then(resp => {
        if (resp) {
          this.listRoom = resp;
          console.log(resp)
        }
      })
    },
     // 查看
    look(node, data) {
      // 判断是否是父元素
      if (data.parentId == 0) {
        console.log(data.id)
        this.getRequest('/system/config/', {
          id: data.id
        }).then(resp => {
          if (resp) {
            this.dialogTeacherInfo = true;
            this.teacherInfo = resp;
            console.log(this.teacherInfo)
          }
        })
      } else if (data.parentId != 0) {
        console.log(data.id)
        this.getRequest('/system/config/', {
          id: data.id
        }).then(resp => {
          if (resp) {
            this.dialogStudentInfo = true;
            this.studentInfo = resp;
            console.log(resp)
          }
        })
      }
      console.log(data)
    },
    // 编辑
    edit(node, data) {
      if (data.parentId == 0) {
        console.log(data.id)
        this.classRoomForm.id = data.id;
        console.log(this.classRoomForm.id)
         // 将父id 下拉框的教师Id 传给后台
        this.adminRoom.roomId=data.id;
          console.log(this.adminRoomId)
        this.dialogClassRoomInfo = true;
        this.getRequest('/system/config/teacher').then(resp => {
        if (resp) {
          this.teacherList = resp;
        
          console.log(resp)
        }
      })
      } else if (data.parentId != 0) {
        this.dialogClassSeatInfo = true;
        console.log(data.id)
        this.classSeatForm.id = data.id;
      }
    },
    // 删除
    remove(node,data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: data.id
        }
        console.log(params)
        this.deleteRoom(params);
      })
    },
    classRoomUpdate() {
      this.postRequest('/system/config/update', this.classRoomForm).then(resp => {
        if (resp) {
          console.log(resp)
          this.dialogClassRoomInfo = false;
        }
      })
    },
    classSeatUpdate() {
      this.postRequest('/system/config/update', this.classSeatForm).then(resp => {
        if (resp) {
          console.log(resp)
          this.dialogClassSeatInfo = false;
        }
      })
    },
    classSeatAdd() {
      this.innerVisible = true;
  
    },
    classRoomAdd() {
      this.dialogClassRoomAdd = true;
      this.getRequest('/system/config/teacher').then(resp => {
        if (resp) {
          this.teacherList = resp;
          console.log(resp)
        }
      })
    },
    addSeat() {
      this.postRequest('/system/config/addSeat', this.classRoomForm).then(resp => {
        if (resp) {
          console.log(resp)
          this.innerVisible = false;
          this.classRoomForm.name = '';
        }
      })
    },
    addRoom() {
      this.classRoomForm.id = this.adminRoomId;
      console.log(this.classRoomForm)
      this.postRequest('/system/config/addRoom', this.classRoomForm).then(resp => {
        if (resp) {
          console.log(resp)
          this.dialogClassRoomAdd = false;
          this.classRoomForm.name = '';
        }
      })
    },
    deleteRoom(params) {
      this.getRequest('/system/config/delete', params).then(resp => {
        if (resp) {
          console.log(resp)
          this.rooms();
        }
      })
    },
    changeTeacher(){
      this.adminRoom.adminId=this.adminRoomId;
      console.log(this.adminRoom)
      this.postRequest('/system/config/updateAdminRoom', this.adminRoom).then(resp => {
        if (resp) {
          console.log(resp)
          this.dialogClassRoomInfo = false;
        }
      })
    }

  }

}





</script>

<style scoped>
.roomInfo {
  width: 50%;
  height: 100%;
  margin-top: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>