import{request} from"../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
   tabs:[
     {
    id:0,
    value:"综合",
    isActive:true
   },
   {
    id:1,
    value:"销量",
    isActive:false
   },
   {
    id:2,
    value:"格合",
    isActive:false
   },
  ], 
  goods_list:[]
  },
  //接口要的数据
  QueryParams:{
   query:"",
   cid:"",
   pagenum:1,
   pagesize:10,
  },
  // 总页数
  totalPages:1,
//标题点击事件 从子组件传递过来
handleTabsItemChange(e){
  //1.获取被点击的标题索引()
const {index} = e.detail;
//2.修改原数组
let {tabs} = this.data;
tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
//3 赋值到data 中
this.setData({
  tabs
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 this.QueryParams.cid=options.cid;
 this.getGoodsList();
  },
//获取商品列表数据
async getGoodsList(){
  const res = await request({url:"/goods/search",data:this.QueryParams});
// 获取总条数
const total =res.total;
//计算总页数
this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  this.setData({
    // 拼接了数组
    goodsList:res.goods
  })
  wx.stopPullDownRefresh();
},
//页面上滑 滚动条触底事件
onReachBottom(){
 // 判断有没有下一页数据
 if(this.QueryParams.pagenum>=this.totalPages){
  console.log(没有下一页)
 }else{
   //还有下一页
   console.log(还有下一页)
   this.QueryParams.pagenum++;
   this.getGoodsList();
 }
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
    //1.重置数组
      this.setData({
        goodsList:[]
      })
      //2.重置页码
      this.QueryParams.pagenum=1;
      //3.发送请求
      this.getGoodsList()
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