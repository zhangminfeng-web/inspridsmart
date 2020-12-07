const db = require("../model/db");
const DB = new db();

module.exports = {
    //获取小区基本信息
    getAreaInfo:(req,res,next) => {
        let sql = "SELECT * FROM `area_info`";
        DB.query(sql).then(result => {
            res.getAreaInfo = result;
            next();
        }).catch(err => {
            next(err);
        });
    },
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
    //提交小区基本信息
    submitAreaInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `area_info` SET area_address=?,area_name=?,green_area=?,total_area=?,area_introduction=? WHERE id=?";
        DB.update(sql,[obj.area_address,obj.area_name,obj.green_area,obj.total_area,obj.area_introduction,obj.id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
            next(err);
        })
    },
    //添加楼栋信息
    addFloorNumber:(req,res,next) => {
        let obj = req.body;
        let sql = "INSERT INTO `tung`(name) VALUES (?)";
        DB.add(sql,[obj.name]).then(result => {
            res.id = result.insertId;
            next();
        }).catch(err => {
            next(err);
        });
    },
    //添加单元门
    addUnitNameInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "INSERT INTO `unit`(name,tung_id) VALUES (?,?)";
        DB.add(sql,[obj.name,obj.tung_id]).then(result => {
            res.id = result.insertId;
            next();
        }).catch(err => {
            next(err);
        });
    },
    //添加门牌号
    addHouseNameInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "INSERT INTO `house`(house_number,tung_id,unit_id,alias_name) VALUES (?,?,?,?)";
        DB.add(sql,[obj.house_number,obj.tung_id,obj.unit_id,obj.alias_name]).then(result => {
            res.id = result.insertId;
            next();
        }).catch(err => {
            next(err);
        });
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
    //修改楼栋名称
    updateFloorName:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `tung` SET name=? WHERE id=?";
        DB.update(sql,[obj.name,obj.id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
            next(err);
        })
    },
    //修改单元门名称
    renameUnitOne:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `unit` SET name=? WHERE id=?";
        DB.update(sql,[obj.name,obj.id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
            next(err);
        })
    },
    //修改门牌号名称
    renameHouseOne:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `house` SET house_number=?,alias_name=? WHERE id=?";
        DB.update(sql,[obj.house_number,obj.alias_name,obj.id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
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
    //删除门牌号
    deleteHouse:(req,res,next) => {
        let obj = req.body;
        let sql = "DELETE FROM `house` WHERE id = ?";
        DB.delete(sql,[obj.id]).then(result => {
            res.result = result;
            next();
        }).catch(err => {
            next(err);
        });
    },
    //删除门牌号详情信息
    deleteHouseDetail:(req,res,next) => {
        let obj = req.body;
        let sql = "DELETE FROM `house_info` WHERE house_id = ?";
        DB.delete(sql,[obj.id]).then(result => {
            res.result = result;
            next();
        }).catch(err => {
            next(err);
        });
    },
    //删除门牌号对应的人员信息
    deleteHousePeople:(req,res,next) => {
        let obj = req.body;
        let sql = "DELETE FROM `personnel` WHERE house_id = ?";
        DB.delete(sql,[obj.id]).then(result => {
            res.result = result;
            next();
        }).catch(err => {
            next(err);
        });
    },
    //通过楼栋选择获取对应的单元门
    selectGetUnit:(req,res,next) => {
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
        let sql = "SELECT * FROM `house` WHERE tung_id = ? AND unit_id = ? AND alias_name = ?";
        DB.query(sql,[obj.tung_id,obj.unit_id,obj.alias_name]).then(result => {
            res.houseList = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //查询楼栋->单元门->门牌号的数组集合
    getHouseAll:(req,res,next) => {
        let obj = req.query;
        let sql = "SELECT * FROM `house` WHERE tung_id = ? AND unit_id = ? ORDER BY convert(`house_number`  using gbk)  asc";
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
    //获取门牌号详情信息
    getHouseInfo:(req,res,next) => {
        let houseId = req.params.id;
        let sql = "SELECT * FROM `house_info` WHERE house_id = ?";
        DB.query(sql,houseId).then(result => {
            res.houseInfoOne = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //添加门牌号详情信息
    addHouseDetailInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "INSERT INTO `house_info`(house_id) VALUES (?)";
        DB.query(sql,[obj.house_id]).then(result => {
            res.houseInfoOne = result;
            next();
        }).catch(err => {
            next(err);
        })
    },
    //更新住户详情的基本信息
    updateUserBaseInfo:(req,res,next) => {
        let obj = req.body;
        let sql = "UPDATE `house_info` SET check_date=?,house_number=?,home_measure=?,remarks_msg=? WHERE house_id=?";
        DB.update(sql,[obj.check_date,obj.house_number,obj.home_measure,obj.remarks_msg,obj.house_id]).then((result) =>{
            res.result = result;
            next();
        }).catch(err =>{
            next(err);
        })
    },
    //添加入住人员
    addUserPersonnel:(req,res,next) => {
        let obj = req.body;
        let sql = "INSERT INTO `personnel`(house_id,tung_id,unit_id,username,gender,age,phone,role,id_number) VALUES (?,?,?,?,?,?,?,?,?)";
        DB.add(sql,[obj.house_id,obj.tung_id,obj.unit_id,obj.username,obj.gender,obj.age,obj.phone,obj.role,obj.id_number]).then(result => {
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