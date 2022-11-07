import axios from "axios";
import { Message } from "element-ui";
import router from '../router'


//请求拦截器
// axios.interceptors.request.use(config => {
//     //从session中获取token
//     if (window.sessionStorage.getItem('tokenStr')) {
//         config.headers['Authoriztion'] = window.sessionStorage.getItem('tokenStr');
//     }
//     return config;
// }, error => {
//     console.log(error)
// }
// )

//响应拦截器
axios.interceptors.response.use(success => {
    //业务逻辑
    if (success.status && success.status == 200) {
        if(success.data.code == 401){
            window.sessionStorage.removeItem('user');
            Message.error({message:success.data.message})
            router.replace('/')
            return;
        }
        if (success.data.code == 500 || success.data.code == 403) {
            Message.error({ message: success.data.message });
            return;
        }
        if (success.data.message) {
            Message.success({ message: success.data.message });
        }
    }
    return success.data;
}, error => {
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({ message: "服务器被吃掉了" })
    } else if (error.response.code == 403) {
        Message.error({ message: "权限不足" })
    } else if (error.response.code == 401) {
        window.sessionStorage.removeItem('user');
        Message.error({ message: "尚未登陆,请登录" })
        router.replace('/')  // 重新返回login
    } else {
        if (error.response.data.message) {
            Message.error({ message: error.response.message })
        } else {
            Message.error({ message: '未知错误' })
        }
    }
    return;

})

let base = ' ';

//传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
//传送json格式的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}


export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
} 
