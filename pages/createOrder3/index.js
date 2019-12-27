const app = getApp()
var util = require('../../utils/md5.js')
Page({
    data: {
        userInfo: null,
        createOrder3: app.globalData["createOrder3"],
        code: null
    },
    onLoad() {
        this.setData({
            createOrder3: app.globalData["createOrder3"]
        })
        wx.getStorage({
            key: 'userInfo',
            success: (res) => {
                this.setData({ userInfo: res.data })
                if (!res.data.openId) {
                    wx.login({
                        success: (res) => {
                            console.log(res)
                            this.setData({ code: res.code })
                        }
                    })
                }
            }
        })
    },
    submitData(event) {
        this.orderPay()
    },
    userLogin(paramer) {
        app.wxRequest('POST', app.globalData.URL + '/user/login', paramer, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    wx.setStorageSync("sessionid", res.header["Set-Cookie"])
                    wx.setStorageSync("userInfo", res.data.data)
                    wx.getStorage({
                        key: 'userInfo',
                        success: (res) => {
                            this.setData({ userInfo: res.data })
                        }
                    })
                }
            }
        }, true)
    },
    // 授权登陆
    bindgetphonenumber(e) {
        // wx.login({
        //     success: (res) => {
        //         console.log(res)
        //         this.setData({ code: res.code })
        let wxInfo = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
        }
        let paramer = {
            from: 0,
            code: this.data.code,
            wxInfo: wxInfo //手机号密文，非必填
        }
        this.userLogin(paramer)

    },
    //发起支付
    orderPay() {
        wx.getStorage({
            key: 'userInfo',
            success: (res) => {
                console.log(res)
                if (res.data.openId) {
                    let paramer = {
                        desc: this.data.createOrder3.settleModels[0].attributeValues[0].name,
                        orderId: this.data.createOrder3.orderId,
                        type: 1,
                        amount: this.data.createOrder3.payableAmount,
                    }
                    app.wxRequest('POST', app.globalData.URL + `/order/pay`, paramer, (res) => {
                        if (res.statusCode == 200) {
                            let data = res.data
                            wx.requestPayment({
                                timeStamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                package: data.package,
                                signType: data.signType,
                                paySign: data.paySign,
                                success(res) {
                                    console.log(res)
                                    wx.redirectTo({
                                        url: `../paysuccess/index`
                                    })
                                },
                                fail(res) {
                                    wx.redirectTo({
                                        url: `../orderList/index?detail=0`
                                    })
                                }
                            })
                        }
                    })
                } else {
                    //微信授权
                }
            }
        })

    }
})