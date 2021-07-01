import { createStore } from 'vuex'
import router from "@renderer/router";

const userData = [ // 与用户登录态和权限相关的数据
    {name:'vuex_user',value:{}},
    {name:'vuex_token',value:''},
    {name:'vuex_curRole',value:''},
]
export default createStore({
    state: {
        vuex_profile: {},
        vuex_user: {},
        vuex_token: '',
        vuex_curRole: '',
        vuex_menuIndex: '0',
        vuex_version: '',
    },
    mutations: {
        $clearUserData(state: any){
            let data = JSON.parse(localStorage.getItem('store'))
            userData.forEach(saveKey =>{
                state[saveKey.name] = saveKey.value
                data[saveKey.name] = saveKey.value
            })
            setTimeout(()=>{
                console.log('跳转登录')
                localStorage.setItem("store", JSON.stringify(data));
                router.push('/login')
            },300)
        },
        $changeStore(state: any,payload: any){
            // 判断是否为多层级调用，state中为对象存在的情况，诸如user.info.name = 'xxx'
            const nameArr = payload.name.split('.');
            const len = nameArr.length;
            if (len >= 2){

                let obj = state[nameArr[0]];
                for (let i = 1 ; i < len - 1 ; i++){
                    obj = obj[nameArr[i]];
                }
                obj[nameArr[len-1]] = payload.value;
            }else {
                state[payload.name] = payload.value;
            }
            localStorage.setItem("store", JSON.stringify(state));
        }
    }
})
