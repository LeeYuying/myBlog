const express = require("express");
const app = express();
const db = require("./db.js");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const ejs = require('ejs');
app.set('view engine','ejs');
var session = require('express-session');
var NedbStore = require('nedb-session-store')( session );
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie:{
		maxAge:1000000
	},
	store: new NedbStore({
        filename: 'path_to_nedb_persistence_file.db'
    })
}))



app.use(`/public`,express.static('./public'));
app.get(`/`,(req,res)=>{
	if (req.session.login) {
		res.render('my',{user:req.session.user});
	} else{
		res.render('login');
	}
})
app.get(`/register`,(req,res)=>{
	res.render('register');
})
app.get(`/login`,(req,res)=>{
	res.render('login');
})
app.post(`/regUser`,urlencodedParser,(req,res)=>{
	db.find('User','user',{user:req.body.name},(a)=>{
		if (a.length!=0) {
			res.send('error')
		} else {
			res.send('ok');
		}
	})
})
app.post(`/signUp`,urlencodedParser,(req,res)=>{
	db.insert('User','user',{user:req.body.user,pass:req.body.pass},()=>{
		res.render('login');
	})
})
app.post(`/signIn`,urlencodedParser,(req,res)=>{
	req.session.user = req.body.user;
	req.session.login = true;
	db.find('User','user',{user:req.body.user,pass:req.body.pass},(a)=>{
		if (a.length==0) {
			res.send('error');
		} else {
			res.send('ok');
		}
	})	
})
app.get(`/quit`,(req,res)=>{
	req.session.user = null;
	req.session.login = false;
	res.redirect('http://localhost:8989/');
})
app.get(`/add`,(req,res)=>{
	res.render('add');
})
app.use(`/getBlog`,(req,res)=>{
	db.find('Blog','blog',{user:req.session.user},(a)=>{
		console.log(a);
		res.send(a);
	})
})
app.use(`/addBlog`,(req,res)=>{
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	var time = y+'年'+m+'月'+d+'日'+' '+hour+':'+min+':'+sec;
	var obj = {
		user:req.session.user,
		title:req.query.title,
		msg:req.query.msg,
		time:time
	}
	db.insert('Blog','blog',obj,()=>{
		res.send('ok');
	})
})
app.use(`/delBlog`,(req,res)=>{
	var obj = {
		user:req.session.user,
		time:req.query.time
	}
	db.remove('Blog','blog',obj,()=>{
		res.send('ok');
	})
})



app.listen(8989,()=>{
	console.log('ok')
})
