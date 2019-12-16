const app = getApp()
var util = require('../../utils/md5.js')
Page({
    data: {
        createOrder3: app.globalData["createOrder3"]
    },
    onLoad() {
        this.setData({
            createOrder3: app.globalData["createOrder3"]
        })
        console.log(this.data.createOrder3)

    },
    submitData(event) {
        this.orderPay()
    },
    //发起支付
    orderPay() {
        console.log(this.data.createOrder3)
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
                        wx.showToast({
                            title: '操作成功',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.navigateTo({
                            url: `../paysuccess/index`
                        })
                    },
                    fail(res) {
                        wx.showLoading({
                            title: '付款失败',
                            duration: 2000
                        })
                    }
                })
            }
        })
    }
})