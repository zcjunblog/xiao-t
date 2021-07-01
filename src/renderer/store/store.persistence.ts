/**
 * @创建: zhaozc
 * @时间: 2021/5/27
 * @说明: vuex数据持久化，防止F5之后数据消失
 */
import {Store} from "vuex";

export default<T> (store: Store<T>): void=>{
    // 数据存入localStorage
    if (localStorage.getItem('store')){
        store.replaceState(
            // 将刷新前存下的缓存数据同步到store
            Object.assign(
                {},
                store.state,
                JSON.parse(localStorage.getItem('store') as string)
            )
        );
    }
}
