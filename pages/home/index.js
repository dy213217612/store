// pages/home/index.js
// 0.引入 用来发送请求的 方法 一定要把路径补全
import{request} from"../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 轮播图数组
      swiperList:[],
      catesList:[],
      getFloorList:[],
      dots:true, // 指示点
      autoplay:true, // 自动播放
      interval:5000, // 间隔时间
      duration:1000,// 动画时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// wx.request({
//   // 1.发送异步其你去获取轮播图数据
//   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',

//   success:(result)=>{
//     // console.log(result)
//    this.setData({
//      swiperList:result.data.message
//    })
//   },
//   fail:()=>{},
//   complete:()=>{}
// })
this.getSwiperList();
this.getCateList();
this.getFloorList();
  },
  // 获取轮播图数据
getSwiperList(){
  request({url:"/home/swiperdata"})
.then(result=>{
  this.setData({
    swiperList:result
  })
})
},
// 获取分类导航数据
getCateList(){
  request({url:"/home/catitems"})
.then(result=>{
  this.setData({
    catesList:result
  })
})
},
// 获取楼层数据
getFloorList(){
  request({url:"/home/floordata"})
.then(result=>{
  this.setData({
    floorList:result
  })
})
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})