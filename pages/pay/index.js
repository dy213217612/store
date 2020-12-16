
import regeneratorRuntime from '../../lib/runtime/runtime';
import{getSetting,chooseAddress,openSetting, showToast}from"../../utils/asyncWx";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
// debugger
// 点击 收货地址
async handleChooseAddress() {    
  try {
    // 1 获取 权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 2 判断 权限状态
    if (scopeAddress === false) {
      await openSetting();
    }
    // 4 调用获取收货地址的 api
    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    // 5 存入到缓存中
    wx.setStorageSync("address", address);

  } catch (error) {
    console.log(error);
  }
},
//商品的选中
handeItemChange(e){
//1.获取被修改的商品的id
const goods_id=e.currentTarget.dataset.id;
//2.获取购物车数组
let{cart}=this.data;
//3 找到被修改的商品对象
let index = cart.findIndex(v=>v.goods_id===goods_id);
//4 选中状态取反
cart[index].checked=!cart[index].checked;
  this.setCart(cart);
},
//设置购物车状态同时 重新计算底部工具栏的数据  全选 总价格 购买的数量
setCart(cart) {
  // 1 总价格 总数量
  let totalPrice = 0;
  let totalNum = 0;
    // 计算全选
   //  every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都反回true  那么 every方法的返回值为true
   // 只要 有一个回调函数返回了 false 那么不在循环执行 ， 直接返回false
   // v 是里面的每一个循环项
   // 空数组 调用 every ,返回值就是true
  cart.forEach(v => {
    if (v.checked) {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    } else {
      allChecked = false;
    }
  })
  // 判断数组是否为空
  allChecked = cart.length != 0 ? allChecked : false;
  this.setData({
    cart,
    totalPrice, totalNum, allChecked
  });
  wx.setStorageSync("cart", cart);
},
//商品全选功能
handleItemAllCheck(){
  //1.获取data中的数据
  let{cart,allChecked}=this.data;
  //2.修改值
  allChecked=!allChecked;
  //3 循环修改cart数组 中的商品选中状态
  cart.forEach(v=>v.checked=allChecked);
  //4 修改后的值 填充回data或缓存中
  this.setCart(cart);
},

//商品数量的编辑功能
handleItemNumEdit(e){
//1.获取传递过来的参数
const {operation,id}=e.currentTarget.dataset;
//2 获取购物车数组
let {cart} = this.data;
//3 找到需要修改的商品的索引
const index= cart.findIndex(v=>v.goods_id===id);
//4 进行修改数量
if(cart[index].num===1&&operation===-1){
 wx.showModal({
   title:'提示',
   cancelColor: '你是否要删除',
   success:(res)=>{
    if(res.confirm){
      cart.splice(index,1);
      this.setCart(cart);
    }else if(res.cancel){
     console.log('用户取消')
    }
   },
 })
}else{
  cart[index].num+=operation;
  this.setCart(cart);
}

//5 设置回缓存和data中


},
// 点击结算
async handlePay(){
 //1.判断收货地址
 const {address,totalNum}=this.data;
 if(address.userName){
  await showToast({title:"你还没有选择收货地址"});
  return;
 }
 // 2 判断用户有没有选购商品
 if(totalNum===0){
  await showToast({title:"你还没有选择商品"});
  return;
 }
 wx.navigateTo({
   url: '/pages/pay/index',
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
  //1 获取缓存中的收货地址信息
  const address = wx.getStorageSync('address');
  //1 获取缓存中的购物车数据  当他不存在的时候就变成一个空数组
   const cart = wx.getStorageSync('cart')||[];  
   // 过滤后的购物车数组
   let checkedCart = cart.filter(v=>v.checked)
   this.setData(cart);
   this.setCart(checkedCart)
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