class Request{

    constructor() {
        this.instance = axios.create({
            baseURL:"http://localhost:43839"
        });
    }

    requestGet(url,params={}){
        return new Promise((resolve,reject) => {
            return this.instance.get(url,params).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    requestPost(url,data = {}){
        return new Promise((resolve,reject) => {
            return this.instance.post(url,data).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
}