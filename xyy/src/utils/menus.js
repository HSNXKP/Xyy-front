import { getRequest } from "./api"; 


// 如果不为0 就初始化菜单
export const initMenu =(router,store) =>{
    if(store.state.routes.length>0){
        // 更新用户信息以后 返回空会有问题所以需要 重新初始化菜单 
        store.commit('initRoutes',store.state.routes)
    }
    // 获得后端请求地址的信息
    getRequest('/menu').then(data=>{
        if(data){
            // 格式化Router
            let fmtRoutes =formatRoutes(data);
            // 将遍历的数组 添加路由
            router.addRoutes(fmtRoutes);
            // 将数据存入vuex 
            store.commit('initRoutes',fmtRoutes);
        }
    })
}

export const formatRoutes = (routes) => {
    // 准备一个空数组
    let fmtRoutes=[];
    routes.forEach(router=>{
        let{
            path,
            component,
            name,
            iconCls,
            children,
        }=router;
        //判断children是否存在 是否为数组形式
        if(children && children instanceof Array){
            //递归 重新调用formatRoutes
            children=formatRoutes(children);
        }
        let fmRouter ={
            path:path,
            name:name,
            iconCls:iconCls,
            children:children,
            component(resolve){
                if(component.startsWith('Home')){
                    require(['../views/My'+component+'.vue'],resolve);
                }else if(component.startsWith('Bok')){
                    require(['../views/bok/'+component+'.vue'],resolve); 
                }else if(component.startsWith('Com')){
                    require(['../views/com/'+component+'.vue'],resolve);
                }else if(component.startsWith('Rve')){
                    require(['../views/rve/'+component+'.vue'],resolve);
                }else if(component.startsWith('Sdy')){
                    require(['../views/sdy/'+component+'.vue'],resolve);
                }else if(component.startsWith('Sys')){
                    require(['../views/sys/'+component+'.vue'],resolve);
                }                            
            },
        }

        fmtRoutes.push(fmRouter)
    })
    return fmtRoutes;
}