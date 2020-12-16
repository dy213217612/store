// pages/cart/index.js
/*
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
4 把获取到的收货地址 存入到 本地存储中 
*/ 

/*
2 页面加载完毕
 0 onload onShow
 1 获取本地存储中的地址数据
 2 把数据 设置给data中的一个变量
 3 onshow
      0 回到商品详情页面 第一次添加商品的时候 手动添加了属性
        1 num=1；
        2 checked=true
      1 获取缓存中的购物车数组
      2 把购物车数据 填充到data中
 4 全选的实现 数据展示 
   1 onshow 获取缓存中的购物车数组
   2 根据购物车中的商品数据 所有的商品被选中 checked=true
 5 总价格和总数量
  1都需要商品被选中
  2获取购物车数组
  3遍历
  4判断商品是否被选中
  5总价格 += 商品的单价 * 商品的数量
  6把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change 事件
  2 获取到被修改的商品的对象
  3 商品对象的选中状态反选
  4 重新填充回data中的缓存中
  5 重新计算全选等功能
7  全选和反选
 1 全选复选框绑定事件 change
 2 获取data中的全选变量 allChecked
 3 直接取反 allChecked =!allChecked
 4 遍历购物车数组 让里面 商品选中状态跟随 allChecked 改变面改变
 5 把购物车数组 和allchecked 重新设置回data中 把够购物车重新设置回缓存中
8 商品数量的编辑
 1 给加减 绑定同一个点击事件 区分的关键 自定义属性
  1 
  2 传递被点击的商品的id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 直接修改商品对象的数量 num 
  5 把cart数组 重新设置回 缓存data中 this.setcart 
9 点击结算
 1 判断有木有收货地址
 2 判断用户有没有选购商品
 3 经过以上的验证 跳转到 支付页面！
*/
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
 ohja:{// //1获取 权限状态 
// wx.getSetting({
//   success:(result)=>{
//    //2获取 权限状态 只要发现一些 属性名都很怪异的时候 都要使用 []形式 来获取属性值
//   //  console.log(result);
//    // authSetting  用户获取结果 
//    const scopeAddress  = result.authSetting["scope.address"];
//    if(scopeAddress===true||scopeAddress===undefined){
//      wx.chooseAddress({
//        success: (result1) => {
//          console.log(result1);
//        }
//      });
//    }else{
//      //3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
//      wx.openSetting({
//        success:(result2)=>{
//          console.log(result2)
//           // 4 可以调用 收货地址代码
//           wx.chooseAddress({
//             success: (result3) => {
//               console.log(result3);
//             },
//           });
//        },
//      })
//    }
//   },
//   fail:()=>{},
//   complete:()=>{},
// })
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
  let allChecked = true;
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
   this.setCart(cart);
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