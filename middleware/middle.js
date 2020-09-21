const db = require("../model/db");
const DB = new db();

module.exports = {
    //获取楼栋列表
    getTung:(req,res,next) => {
        let sqlTung ="SELECT * FROM `tung`";
        DB.query(sqlTung).then(result => {
            res.listTung = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //获取单元门列表
    getUnit:(req,res,next) => {
        let tung_id = null;
        let sqlUnit = "SELECT * FROM `unit` WHERE tung_id = ?";
        if(!req.query.tung_id){
            tung_id = 1;
        }
        DB.query(sqlUnit,tung_id).then(result => {
            res.listUnit = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //获取门牌号
    getHouseNumber:(req,res,next) => {
        let tung_id = unit_id = null;
        let sqlHouse = "SELECT id,alias_name FROM `house` WHERE tung_id = ? AND unit_id = ?";
        if(!req.query.tung_id || !req.query.unit_id){
            tung_id = unit_id = 1;
        }
        DB.query(sqlHouse,[tung_id,unit_id]).then(result => {
            res.listHouse = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //通过楼栋选择获取对应的单元门
    selectGetUnit:(req,res,next) => {
        console.log(req.query.tung_id);
        let tung_id = req.query.tung_id;
        let sql = "SELECT * FROM `unit` WHERE tung_id = ?";
        DB.query(sql,tung_id).then(result => {
            res.chengeUint = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //搜索单个门牌号
    getHouseOne:(req,res,next) => {
        let obj = req.body;
        let sql = "SELECT id,alias_name FROM `house` WHERE tung_id = ? AND unit_id = ? AND home_number = ?";
        DB.query(sql,[obj.tung_id,obj.unit_id,obj.home_number]).then(result => {
            res.houseList = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //查询楼栋->单元门->门牌号的数组集合
    getHouseAll:(req,res,next) => {
        let obj = req.query;
        let sql = "SELECT id,alias_name FROM `house` WHERE tung_id = ? AND unit_id = ?";
        DB.query(sql,[obj.tung_id,obj.unit_id]).then(result => {
            res.houseAllList = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //住户详情页展示
    getUserDetail:(req,res,next) => {
        let houseId = req.params.id?req.params.id:req.query.id;
        let sql = "SELECT * FROM `house` WHERE id = ?";
        DB.query(sql,houseId).then(result => {
            res.houseInfo = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //获取住户对应的入住人员数组列表信息
    getPeopleInfo:(req,res,next) => {
        let houseId = req.params.id;
        let sql = "SELECT * FROM `personnel` WHERE house_id = ?";
        DB.query(sql,houseId).then(result => {
            res.peopleInfoList = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //更新住户详情的基本信息
    updateUserBaseInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `house` SET check_date=?,home_measure=?,remarks_msg=? WHERE id=?";
        DB.update(sql,[obj.check_date,obj.home_measure,obj.remarks_msg,obj.id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
            next(err);
        })
    },
    //添加入住人员
    addUserPersonnel:(req,res,next) => {
        let obj = req.body;
        let sql = "INSERT INTO `personnel`(house_id,username,gender,age,phone,role,id_number) VALUES (?,?,?,?,?,?,?)";
        DB.add(sql,[obj.house_id,obj.username,obj.gender,obj.age,obj.phone,obj.role,obj.id_number,]).then(result => {
            result.id = result.insertId;
            res.result = result;
            next();
        }).catch(err => {
           next(err);
        });
    },
    //查询单个入住人员信息
    showOnePeopleInfo:(req,res,next) => {
        let id = req.query.id;
        let sql = "SELECT * FROM `personnel` WHERE id = ?";
        DB.query(sql,id).then(result => {
            res.userInfo = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //更新住户人员信息
    editUserPeopleInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `personnel` SET house_id=?,username=?,gender=?,age=?,phone=?,role=?,id_number=? WHERE id=?";
        DB.update(sql,[obj.house_id,obj.username,obj.gender,obj.age,obj.phone,obj.role,obj.id_number,obj.id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
            next(err);
        })
    },
    //删除住户人员信息
    deleteUserInfo:(req,res,next) => {
        let id = req.query.id;
        let sql = "DELETE FROM `personnel` WHERE id=?";
        DB.delete(sql,id).then(result => {
            res.result = result;
            next();
        }).catch(err => {
           next(err);
        });
    },
}