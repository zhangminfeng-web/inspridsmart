/**
 *数据库操作文件
 */
const mysql = require('mysql');

module.exports = class Db{
    constructor() {
        //创建链接对象
        this.conn = null;

        //调用初始化链接数据库方法
        this.connection();
    }

    //初始化链接数据库方法
    connection(){
        //重写连接对象
        this.conn = mysql.createConnection({
            host:'127.0.0.1',
            user:'root',
            password:'123',
            database:'inspridsmart'
        })

        //如果链接发生错误
        this.conn.connect(err => {
            if(err){
                console.log(`数据库链接失败：${err.message}`);
            }
        })
    }

    //关闭数据库
    end(){
        if(this.conn != null){
            this.conn.end();
        }
    }

    //查询数据
    query(sql,params = []){
        return new Promise((resolve,reject) => {
            this.connection();
            this.conn.query(sql,params,(err,results) => {
                if(err){
                    return reject(err)
                }
                resolve(results);
            });
            this.end();
        })
    }

    //更新数据
    update(sql,params = []){
        return new Promise((resolve,reject) => {
            this.connection();
            this.conn.query(sql,params,(err,results) => {
                if(err){
                    return reject(err)
                }
                resolve(results);
            });
            this.end();
        })
    }

    //添加数据
    add(sql,params = []){
        return new Promise((resolve,reject) => {
            this.connection();
            this.conn.query(sql,params,(err,results) => {
                if(err){
                    return reject(err)
                }
                resolve(results);
            });
            this.end();
        })
    }

    //删除数据
    delete(sql,params = []){
        return new Promise((resolve,reject) => {
            this.connection();
            this.conn.query(sql,params,(err,results) => {
                if(err){
                    return reject(err)
                }
                resolve(results);
            });
            this.end();
        })
    }

}
