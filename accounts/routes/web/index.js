var express = require('express');
var router = express.Router();

//导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
const checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');


router.get('/', (req, res) => {
  res.redirect('/account');
})


//Account list
router.get('/account', checkLoginMiddleware, function (req, res, next) {

  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.status(500).send('读取数据');
      return;
    }
    res.render('list', { accounts: data, moment: moment });
  }
  )
});

//Add record
router.get('/account/create', checkLoginMiddleware, function (req, res, next) {
  res.render('create');
});

//New record
router.post('/account', checkLoginMiddleware, (req, res, next) => {
  //获取请求体里面的数据
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if (err) {
      res.status(500).send('插入失败');
      return;
    }
  })
  res.render('success', { msg: '添加成功', url: '/account' });
});

//Delete record
router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  let id = req.params.id;

  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send('删除失败');
      return;
    }
  });

  res.render('success', { msg: '删除成功', url: '/account' });
});

module.exports = router;
