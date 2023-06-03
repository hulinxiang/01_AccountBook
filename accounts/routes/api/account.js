var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//导入moment
const moment =require('moment');
const AccountModel = require('../../models/AccountModel');
const checkTokenMiddleware=require('../../middlewares/checkTokenMiddleware');


//Account list
router.get('/account',checkTokenMiddleware, function(req, res, next) {
    AccountModel.find().sort({ time: -1 }).exec((err, data) => {
        if (err) {
          res.json({
            code: '1001',
            msg: '读取失败~~',
            data: null
          })
          return;
        }
        //响应成功的提示
        res.json({
          //响应编号
          code: '0000',
          //响应的信息
          msg: '读取成功',
          //响应的数据
          data: data
        });
      })
});

//New record
router.post('/account',checkTokenMiddleware,(req,res,next)=>{
  //获取请求体里面的数据
  AccountModel.create({
    ...req.body,
    time:moment(req.body.time).toDate()
  },(err,data)=>{
    if(err){
        return res.json({
            code:'1002',
            msg:'插入失败',
            data:null
        })
    }
    res.json({
        code:'0000',
        msg:'创建成功',
        data: data
  })
  })
});

//Delete record
router.delete('/account/:id',checkTokenMiddleware,(req,res)=>{
let id=req.params.id;

AccountModel.deleteOne({_id:id},(err,data)=>{
  if(err){
    return res.json({
    code:'1003',
    msg:'删除账单失败',
    data:null
   })
  }
  res.json({
    code:'0000',
    msg:'删除成功',
    data:null
    });
});
});

//获取单个账单信息
router.get('/account/:id',checkTokenMiddleware,(req,res)=>{
    let id=req.params.id;

    AccountModel.findById(id,(err,data)=>{
        if(err){
            return res.json({
                code:'1004',
                msg:'读取失败',
                data:null
            })
        }
        res.json({
            code:'0000',
            msg:'读取成功',
            data: data
        })
    })
})

//更新单个账单信息
router.patch('/account/:id',checkTokenMiddleware,(req,res)=>{
    let id = req.params.id;
    AccountModel.updateOne({_id:id},req.body,(err,data)=>{
        if(err){
            return res.json({
                code:'1005',
                msg:'更新失败',
                data:null
            })
        }
        AccountModel.findById(id,(err,data)=>{
            if(err){
                return res.json({
                    code:'1004',
                    msg:'读取失败',
                    data:null
            })
            }
            res.json({
                data:'0000',
                msg:'更新成功',
                data:data
            })
        });
    })
});

module.exports = router;
