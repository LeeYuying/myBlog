var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

function connect (callback) {
	MongoClient.connect(url,(err,db)=>{
		if (err) return;
		callback(db);
	})
}

module.exports.insert = function (dbname,collection,obj,callback) {
	connect(function (db) {
		if(obj instanceof Array){
			obj=obj
		}else{
			obj=[obj]
		}
		db.db(dbname).collection(collection).insertMany(obj,(err,res)=>{
			console.log("文档插入成功！");
			callback(res)
		})
	})	
}

module.exports.find = function (dbname,collection,obj,callback,mysort,myskip,mylimit) {
	var l = arguments.length;
	connect(function (db) {
		var x = {};
		var y = 0;
		var z = 0;
		if (l==5) {
			x = mysort;
		}else if (l==6) {
			x = mysort;
			y = myskip;
		}else if (l==7) {
			x = mysort;
			y = myskip;
			z = mylimit;
		}
		db.db(dbname).collection(collection).find(obj).sort(x).skip(y).limit(z).toArray((err,result)=>{
			if (err) return;
			callback(result);
		})
	})
}

module.exports.update = function (dbname,collection,objOld,objNew) {
	connect(function (db) {
		db.db(dbname).collection(collection).updateMany(objOld,objNew,(err,res)=>{
			if (err) return;
			console.log("文档更新成功！");
		})
	})
}

module.exports.remove = function (dbname,collection,obj,callback) {
	connect(function (db) {
		db.db(dbname).collection(collection).deleteMany(obj,(err,res)=>{
			if (err) return;
			console.log("文档删除成功！");
			callback(res);
		})
	})	
}