<template>
  <div>
    <div>
      <!-- 绑定clearable 可以清除 clear绑定获取人员的菜单 -->
      <el-input size="mini" style="width: 200px;" type="text" clearable @clear="initAdminInfo"
        @keydown.enter.native="initAdminInfo" v-model="adminName" placeholder="请输入姓名查询"></el-input>
      <el-button style="margin-left:10px" type="primary" size="mini" icon="el-icon-search" @click="initAdminInfo">搜索
      </el-button>
      <el-button style="margin-left:10px" type="primary" size="mini" icon="el-icon-plus"
        @click="dialogFormVisible = true">添加用户
      </el-button>
      <el-select placeholder="请选择角色" size="mini" v-model="adminRole" style="margin-left:10px" @change="initAdminInfo">
        <el-option :value="0" label="所有人">所有用户</el-option>
        <el-option :value="1" label="学生">学生</el-option>
        <el-option :value="2" label="教师">教师</el-option>
        <el-option :value="3" label="管理员">管理员</el-option>
      </el-select>

      <!-- 弹出框 添加用户信息 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="adminForm" :rules="rules" ref="adminForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="adminForm.name" auto-complete="false" type="text"></el-input>
          </el-form-item>
          <el-form-item label="用户" prop="username">
            <el-input v-model="adminForm.username" auto-complete="false" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adminForm.password" auto-complete="false" type="password"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select placeholder="请选择角色" v-model="adminForm.roleId">
              <el-option :value="1" label="学生">学生</el-option>
              <el-option :value="2" label="教师">教师</el-option>
              <el-option :value="3" label="管理员">管理员</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adminForm.email" auto-complete="false" type="text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAdminInfo">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出框 更改用户信息 -->
      <el-dialog title="更新用户" :visible.sync="dialogFormUpdate">
        <el-form :model="adminFormUpdate" :rules="rules" ref="adminFormUpdate">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="adminFormUpdate.name" auto-complete="false" type="text"></el-input>
          </el-form-item>
          <el-form-item label="用户" prop="username">
            <el-input v-model="adminFormUpdate.username" auto-complete="false" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adminFormUpdate.password" auto-complete="false" type="password"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select placeholder="请选择角色" v-model="adminFormUpdate.roleId">
              <el-option :value="1" label="学生">学生</el-option>
              <el-option :value="2" label="教师">教师</el-option>
              <el-option :value="3" label="管理员">管理员</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adminFormUpdate.email" auto-complete="false" type="text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹出框 学生的选座信息 根据学生id查询 -->
      <el-dialog title="学生自习信息" :visible.sync="dialogStudentTable">
        <el-table :data="studentRoomInfo">
          <el-table-column label="自习室" prop="children[0].name">
          </el-table-column>
          <el-table-column label="座位" prop="name">
          </el-table-column>
          <el-table-column label="自习时间" prop="dateTime" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.dateTime | dateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 弹出框 老师的管理自习室信息 根据老师id查询 -->
      <el-dialog title="学生自习信息" :visible.sync="dialogTeacherTable">
        <el-table :data="teacherRoomInfo">
          <el-table-column label="自习室" prop="name">
          </el-table-column>
          <el-table-column label="管理时间" prop="dateTime" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.dateTime | dateTime  }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" prop="expireTime" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.expireTime | dateTime }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-dialog>
    </div>

    <!-- admin资料 -->
    <el-table :data="adminInfo" border style="width: 100% ;margin-top:10px" v-if="adminInfo">
      <el-table-column fixed prop="name" label="姓名" width="150">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="400">
      </el-table-column>
      <el-table-column prop="roles[0].name" label="角色" width="120">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="updateClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: right;">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :page-sizes="[5, 15, 20, 25, 30]" layout="sizes, prev,pager, next, jumper ,-> ,total" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SysBasic',
  data() {
    return {
      // 数据库中的admin信息
      adminInfo: [],
      total: 0,
      currentPage: 1,
      size: 5,
      adminName: '',
      adminRole: '',
      dialogStudentTable: false,
      dialogTeacherTable: false,
      dialogFormVisible: false,
      dialogFormUpdate: false,
      adminForm: {
        name: '',
        username: '',
        password: '',
        roleId: '',
        email: ''
      },
      adminFormUpdate: {
        id: '',
        name: '',
        username: '',
        password: '',
        roleId: '',
        email: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      },
      studentRoomInfo: [],
      teacherRoomInfo: [],

    }
  },
  mounted() {
    this.initAdminInfo()

  },
  methods: {
    handleSizeChange(size) {
      this.size = size
      this.initAdminInfo()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.initAdminInfo()
    },
    initAdminInfo() {
      this.getRequest('/system/basic/?currentPage=' + this.currentPage + '&size=' + this.size + '&name=' + this.adminName + '&roleId=' + this.adminRole).then(resp => {
        if (resp) {
          console.log(resp)
          this.adminInfo = resp.data;
          this.total = resp.total;
          console.log(this.adminName)
        }
      })
    },
    // 查看框的methods
    handleClick(row) {
      if (row.roles[0].name == 'student') {
        console.log(row)
        this.dialogStudentTable = true
        // 复用我的自习室预约接口
        let params = {
          adminId: row.id
        }
        console.log(params);
        this.getRequest('/system/basic/dataInfo', params).then(resp => {
          console.log(resp)
          if (resp) {
            this.studentRoomInfo = resp;
            console.log(resp)

          }
        })
      } else if (row.roles[0].name == 'teacher') {
        console.log(row)
        this.dialogTeacherTable = true
        // 复用我的自习室预约接口
        let params = {
          id: row.id
        }
        console.log(params);
        this.postRequest('/system/basic/dataInfo', params).then(resp => {
          if (resp) {
            this.teacherRoomInfo = resp;
            console.log(resp)

          }
        })
      }
    },
    updateClick(row) {
      this.dialogFormUpdate = true
      this.adminFormUpdate.id = row.id
      console.log(this.adminFormUpdate.id)

    },
    deleteClick(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id
        }
        console.log(params)
        this.getRequest('/system/basic/delete', params).then(resp => {
          if (resp) {
            this.initAdminInfo()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 复用的注册接口
    addAdminInfo() {
      console.log(this.adminForm)
      // 表单校验
      this.$refs.adminForm.validate((valid) => {
        if (valid) {
          this.postRequest('/register', this.adminForm).then(resp => {
            if (resp) {
              console.log(resp)
              this.dialogFormVisible = false
              this.adminForm = ''
            }
          })
        }
        else {
          this.$message.error('请输入完整的信息！');
          return false;
        }
      }
      );
    },
    updateAdminInfo() {
      console.log(this.adminFormUpdate)
      this.postRequest('/system/basic/', this.adminFormUpdate).then(resp => {
        if (resp) {
          console.log(resp)
          this.dialogFormUpdate = false
          this.adminFormUpdate = ''
        }
      })
    }
  },


}
</script>

<style scoped>

</style>