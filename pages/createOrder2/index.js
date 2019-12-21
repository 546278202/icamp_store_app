const app = getApp()
const watch = require('../../utils/watch.js');

Page({
    data: {
        goodsId: null,
        detailData: null,
        checked: true,
        price: 0,
        show: false,
        camperList: [],
        campersName: ["请选择"],
        couponData: { amount: 0.00 },
        payIntegral: 0,
        active: 0,
        current: 1,
        result: [],
        severPrice: 0,
        severAttributes: [],
        campDataAttributes: [],
        createOrderList: []
    },
    onLoad() {

        // 处理积分
        if (app.globalData.createOrderList.payableAmount > 10) {
            this.setData({
                payIntegral: 10
            })
        } else {
            this.setData({
                payIntegral: 0
            })
        }
        console.log(this.data.payIntegral)
        this.setData({
            campersNum: app.globalData.createOrder.campersNum,
            campersName: app.globalData.createOrder.campersName,
            camperList: app.globalData.createOrder.camperList,
            createOrderList: app.globalData.createOrderList,
            detailData: app.globalData.detailData
        })
    },
    // 选择优惠卷
    goCouponPage() {
        if (this.data.createOrderList.payableAmount - (this.data.payIntegral / 10) > 300) {
            wx.redirectTo({
                url: "../coupon/index?back=createOrder2"
            })
        }
    },

    //监听数据
    // watch: {
    //     couponData(newVal, oldVal) {
    //         console.log(newVal, oldVal);
    //         if (newVal != oldVal) {
    //             this.setData({
    //                 couponData: newVal
    //             })
    //         }
    //     }
    // },
    watch() {
        this.setData({
            couponData: this.data.couponData
        })
    },
    submitData(event) {
        //优惠卷
        if (this.data.createOrderList.payableAmount - (this.data.payIntegral / 10) > 300) {
            if (this.data.couponData.couponId) {
                app.globalData.paramer.couponId = this.data.couponData.couponId
            }
        }
        // 默认添加积分
        if (this.data.payIntegral > 0) {
            app.globalData.paramer.payIntegral = this.data.payIntegral
        }
        console.log(app.globalData.paramer)
        app.wxRequest('POST', app.globalData.URL + `/order`, app.globalData.paramer, (res) => {
            if (res.statusCode == 200) {
                app.globalData["createOrder3"] = res.data.data
                wx.redirectTo({
                    url: '../createOrder3/index',
                })
            }
        }, true)
    }
})