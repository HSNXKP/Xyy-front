import Vue from 'vue';
import Vuex from 'vuex'
import vuexPersistedstate from "vuex-persistedstate";

Vue.use(Vuex);





export default new Vuex.Store({
    state: {
        routes: [],
        user: {
            username: '', // 用户名
            id: null,    // 用户id
            name: '',    // 用户姓名
            email: '',   // 用户邮箱
            password: '', // 用户密码
        },
        SdyData: {
            id: '',    // 公告id
            content: '',    // 公告内容
            time: '',   // 公告时间
        },
        rooms:[],  // 房间信息
        teacherRoom:[],  // 教师房间信息
        sumInfo:[   // 在线人数的计算
            {
                sum:'',
                sum1:'',
            }
        ], 
        teacherConfig:[], // 教师管理教室信息（教师端口）
      

    },
    plugins: [
        vuexPersistedstate({
            storage: window.localStorage
        })
    ],
    //同步执行
    mutations: {
        // 初始化路由
        initRoutes(state, data) {
            state.routes = data;
        },
        // 初始化用户信息
        initUserInfo(state, data) {
            state.user = data;

        },
        // 初始化公告信息
        initSdyData(state, data) {
            state.SdyData = data;
        },
        // 初始化自习室信息
        initRooms(state, data) {
            state.rooms = data;
        },
        // 初始化教师自习室信息
        initTeacherRoom(state, data) {
            state.teacherRoom = data;   
        },
        // 初始化自习室座位的计算信息
        initSumInfo(state, data) {
            state.sumInfo = data;
        },
        // 初始化教师管理自习室信息
        initTeacherConfig(state, data) {
            state.teacherConfig = data;
        }
    },
    // 异步执行
    action: {

    }
})