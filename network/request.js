class Request{

    constructor() {
        this.instance = axios.create({
            baseURL:"http://localhost:43839"
        });
    }

    /**
     * get提交封装
     * @param url 接口url
     * @param params 提交参数
     * @returns {Promise<unknown>}
     */
    requestGet(url,params={}){
        return new Promise((resolve,reject) => {
            return this.instance.get(url,params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * post提交封装
     * @param url 接口url
     * @param data 提交参数
     * @returns {Promise<unknown>}
     */
    requestPost(url,data = {}){
        return new Promise((resolve,reject) => {
            return this.instance.post(url,data).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    /**
     * 失败提示信息
     * @param layer layer实例对象
     * @param msg 失败信息内容
     * @returns {*}
     */
    failMsgInfo(layer,msg){
        return layer.msg(msg,{icon:5,time:2000,shift:6})
    }

    /**
     * 成功提示信息
     * @param layer layer实例对象
     * @param msg 成功信息内容
     * @returns {*}
     */
    successMsgInfo(layer,msg){
        return layer.msg(msg,{time:2000,icon:6})
    }
}