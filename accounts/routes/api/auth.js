var express = require('express');
const UserModel = require('../../models/UserModel');
var router = express.Router();
const md5=require('md5');
const jwt=require('jsonwebtoken');

router.get('/reg',(req,res)=>{
    res.render('login/reg');
});

router.post('/reg',(req,res)=>{
    UserModel.create({...req.body,password:md5(req.body.password)},(err, data)=>{
        if(err){
            res.status(500).send('注册失败');
            return;
        }
        res.render('success',{msg:'注册成功',url:'/login'});
    })

});

router.get('/login',(req,res)=>{
    res.render('login/login');
});


router.post('/login',(req,res)=>{
    let {username,password}=req.body;
    UserModel.findOne({username:username,password:md5(password)},(err,data)=>{
        if(err){
            res.json({
                code:'2001',
                msg:'数据读取失败',
                data:null
            })
            return;
        }
        if(!data){
            res.json({
                code:'2002',
                msg:'用户名或密码错误',
                data:null
            })
            return;
        }

        let token =jwt.sign({
            username:data.username,
            _id:data._id
        },'hlx',{
            expiresIn:60*60*24*7
        });


        res.json({
            code:'0000',
            msg:'登陆成功',
            data:token
        })
    });

});

router.post('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.render('success',{msg:'退出成功',url:'/login'});
    });
});

module.exports = router;
