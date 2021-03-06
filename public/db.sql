# 楼栋表表
CREATE TABLE IF NOT EXISTS `tung`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 单元门表
CREATE TABLE IF NOT EXISTS `unit`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    `tung_id` int unsigned NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 门牌号详情信息表
CREATE TABLE IF NOT EXISTS `house_info`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `tung_id` int UNSIGNED NOT NULL,
    `unit_id` int UNSIGNED NOT NULL,
    `home_number` varchar(20) NOT NULL,
    `alias_name` varchar(30) NOT NULL,
    `area_name` varchar(50) NOT NULL,
    `home_attr` varchar(30) NOT NULL,
    `check_date` varchar(30) NOT NULL,
    `home_measure` varchar(20) NOT NULL,
    `remarks_msg` varchar(20) NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 门牌号表
CREATE TABLE IF NOT EXISTS `house`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `tung_id` int UNSIGNED NOT NULL,
    `unit_id` int UNSIGNED NOT NULL,
    `home_number` varchar(20) NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

#小区总体信息表
CREATE TABLE IF NOT EXISTS `area_info`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `green_area` int UNSIGNED NOT NULL,
    `total_area` int UNSIGNED NOT NULL,
    `area_name` varchar(50) NOT NULL,
    `area_address` varchar(100) NOT NULL,
    `area_msg` varchar(200) NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

# 入住人员表
CREATE TABLE IF NOT EXISTS `personnel`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `house_id` int UNSIGNED NOT NULL,
    `username` varchar(30) NOT NULL,
    `gender` enum('男','女') NOT NULL,
    `age`  tinyint UNSIGNED NOT NULL,
    `phone` char(11) NOT NULL,
    `role` enum('业主','老婆','儿子','女儿','爷爷','奶奶','其他') NOT NULL,
    `id_number` char(18) NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

#报警信息表
CREATE TABLE IF NOT EXISTS `police_info`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `alias_name` varchar(30) NOT NULL,
    `police_msg` varchar(100) NOT NULL,
    `now_time` varchar(40) NOT NULL,
    `create_time` varchar(30) NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `police_info`(alias_name,police_msg,now_time,create_time) VALUES
("1-1-1001","燃气1","2020/10/22 11:22","1610084478000"),
("1-1-1002","燃气2","2020/10/22 12:22","1610084589000"),
("1-1-1003","燃气3","2020/10/22 10:22","1610083589000"),
("1-1-1004","燃气4","2020/10/22 09:22","1610083489000");

# 用户表
CREATE TABLE IF NOT EXISTS `user`(
    `id` INT UNSIGNED AUTO_INCREMENT,
    `username` varchar(30) NOT NULL,
    `password` varchar(18) NOT NULL,
    `isSuper` enum('0','1') NOT NULL,
    PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user`(username,password,isSuper) VALUES
("adminlove",'123456','1');

#向楼栋表插入数据
INSERT INTO `tung`(name) VALUES
("1栋"),("2栋"),("3栋"),("4栋"),("5栋"),("6栋"),("7栋"),("8栋"),("9栋"),
("10栋"),("11栋"),("12栋"),("13栋"),("14栋"),("15栋"),("16栋"),("17栋"),
("18栋"),("19栋"),("20栋");

#单元门表插入数据
INSERT INTO `unit`(name,tung_id) VALUES
("1单元",1),("2单元",1),("3单元",1),
("4单元",1),("5单元",1),("6单元",1),
("1单元",2),("2单元",2),("3单元",2),
("4单元",2),("5单元",2),("6单元",2),
("1单元",3),("2单元",3),("3单元",3),
("4单元",3),("5单元",3),("6单元",3),
("1单元",4),("2单元",4),("3单元",4),
("4单元",4),("5单元",4),("6单元",4),
("1单元",5),("2单元",5),("3单元",5),
("4单元",5),("5单元",5),("6单元",5),
("1单元",6),("2单元",6),("3单元",6),
("4单元",6),("5单元",6),("6单元",6),
("1单元",7),("2单元",7),("3单元",7),
("4单元",7),("5单元",7),("6单元",7),
("1单元",8),("2单元",8),("3单元",8),
("4单元",8),("5单元",8),("6单元",8),
("1单元",9),("2单元",9),("3单元",9),
("4单元",9),("5单元",9),("6单元",9),
("1单元",10),("2单元",10),("3单元",10),
("4单元",10),("5单元",10),("6单元",10),
("1单元",11),("2单元",11),("3单元",11),
("4单元",11),("5单元",11),("6单元",11),
("1单元",12),("2单元",12),("3单元",12),
("4单元",12),("5单元",12),("6单元",12),
("1单元",13),("2单元",13),("3单元",13),
("4单元",13),("5单元",13),("6单元",13),
("1单元",14),("2单元",14),("3单元",14),
("4单元",14),("5单元",14),("6单元",14),
("1单元",15),("2单元",15),("3单元",15),
("4单元",15),("5单元",15),("6单元",15),
("1单元",16),("2单元",16),("3单元",16),
("4单元",16),("5单元",16),("6单元",16),
("1单元",17),("2单元",17),("3单元",17),
("4单元",17),("5单元",17),("6单元",17),
("1单元",18),("2单元",18),("3单元",18),
("4单元",18),("5单元",18),("6单元",18),
("1单元",19),("2单元",19),("3单元",19),
("4单元",19),("5单元",19),("6单元",19),
("1单元",20),("2单元",20),("3单元",20),
("4单元",20),("5单元",20),("6单元",20);

#向门牌号表插入数据
INSERT INTO `house`(tung_id,unit_id,home_number,alias_name,area_name,home_attr) VALUES
(2,6,"101","2-6-101","银花公寓","产权房"),
(2,6,"102","2-6-102","银花公寓","产权房"),
(2,6,"103","2-6-103","银花公寓","产权房"),
(2,6,"104","2-6-104","银花公寓","产权房"),
(2,6,"201","2-6-201","银花公寓","产权房"),
(2,6,"202","2-6-202","银花公寓","产权房"),
(2,6,"203","2-6-203","银花公寓","产权房"),
(2,6,"204","2-6-204","银花公寓","产权房"),
(2,6,"301","2-6-301","银花公寓","产权房"),
(2,6,"302","2-6-302","银花公寓","产权房"),
(2,6,"303","2-6-303","银花公寓","产权房"),
(2,6,"304","2-6-304","银花公寓","产权房"),
(2,6,"401","2-6-401","银花公寓","产权房"),
(2,6,"402","2-6-402","银花公寓","产权房"),
(2,6,"403","2-6-403","银花公寓","产权房"),
(2,6,"404","2-6-404","银花公寓","产权房"),
(2,6,"501","2-6-501","银花公寓","产权房"),
(2,6,"502","2-6-502","银花公寓","产权房"),
(2,6,"503","2-6-503","银花公寓","产权房"),
(2,6,"504","2-6-504","银花公寓","产权房"),
(2,6,"601","2-6-601","银花公寓","产权房"),
(2,6,"602","2-6-602","银花公寓","产权房"),
(2,6,"603","2-6-603","银花公寓","产权房"),
(2,6,"604","2-6-604","银花公寓","产权房"),
(2,6,"701","2-6-701","银花公寓","产权房"),
(2,6,"702","2-6-702","银花公寓","产权房"),
(2,6,"703","2-6-703","银花公寓","产权房"),
(2,6,"704","2-6-704","银花公寓","产权房"),
(2,6,"801","2-6-801","银花公寓","产权房"),
(2,6,"802","2-6-802","银花公寓","产权房"),
(2,6,"803","2-6-803","银花公寓","产权房"),
(2,6,"804","2-6-804","银花公寓","产权房"),
(2,6,"901","2-6-901","银花公寓","产权房"),
(2,6,"902","2-6-902","银花公寓","产权房"),
(2,6,"903","2-6-903","银花公寓","产权房"),
(2,6,"904","2-6-904","银花公寓","产权房"),
(2,6,"1001","2-6-1001","银花公寓","产权房"),
(2,6,"1002","2-6-1002","银花公寓","产权房"),
(2,6,"1003","2-6-1003","银花公寓","产权房"),
(2,6,"1004","2-6-1004","银花公寓","产权房"),
(2,6,"1101","2-6-1101","银花公寓","产权房"),
(2,6,"1102","2-6-1102","银花公寓","产权房"),
(2,6,"1103","2-6-1103","银花公寓","产权房"),
(2,6,"1104","2-6-1104","银花公寓","产权房"),
(2,6,"1201","2-6-1201","银花公寓","产权房"),
(2,6,"1202","2-6-1202","银花公寓","产权房"),
(2,6,"1203","2-6-1203","银花公寓","产权房"),
(2,6,"1204","2-6-1204","银花公寓","产权房"),
(2,6,"1301","2-6-1301","银花公寓","产权房"),
(2,6,"1302","2-6-1302","银花公寓","产权房"),
(2,6,"1303","2-6-1303","银花公寓","产权房"),
(2,6,"1304","2-6-1304","银花公寓","产权房"),
(2,6,"1401","2-6-1401","银花公寓","产权房"),
(2,6,"1402","2-6-1402","银花公寓","产权房"),
(2,6,"1403","2-6-1403","银花公寓","产权房"),
(2,6,"1404","2-6-1404","银花公寓","产权房"),
(2,6,"1501","2-6-1501","银花公寓","产权房"),
(2,6,"1502","2-6-1502","银花公寓","产权房"),
(2,6,"1503","2-6-1503","银花公寓","产权房"),
(2,6,"1504","2-6-1504","银花公寓","产权房"),
(2,6,"1601","2-6-1601","银花公寓","产权房"),
(2,6,"1602","2-6-1602","银花公寓","产权房"),
(2,6,"1603","2-6-1603","银花公寓","产权房"),
(2,6,"1604","2-6-1604","银花公寓","产权房"),
(2,6,"1701","2-6-1701","银花公寓","产权房"),
(2,6,"1702","2-6-1702","银花公寓","产权房"),
(2,6,"1703","2-6-1703","银花公寓","产权房"),
(2,6,"1704","2-6-1704","银花公寓","产权房"),
(2,6,"1801","2-6-1801","银花公寓","产权房"),
(2,6,"1802","2-6-1802","银花公寓","产权房"),
(2,6,"1803","2-6-1803","银花公寓","产权房"),
(2,6,"1804","2-6-1804","银花公寓","产权房"),
(2,6,"1901","2-6-1901","银花公寓","产权房"),
(2,6,"1902","2-6-1902","银花公寓","产权房"),
(2,6,"1903","2-6-1903","银花公寓","产权房"),
(2,6,"1904","2-6-1904","银花公寓","产权房"),
(2,6,"2001","2-6-2001","银花公寓","产权房"),
(2,6,"2002","2-6-2002","银花公寓","产权房"),
(2,6,"2003","2-6-2003","银花公寓","产权房"),
(2,6,"2004","2-6-2004","银花公寓","产权房");

#向入住人员表中插入数据
INSERT INTO `personnel`(house_id,username,gender,age,phone,role,id_number) VALUES
(1,"张三",1,30,"13720456888",1,"420703199010288014");


