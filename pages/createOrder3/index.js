const app = getApp()
Page({
    data: {
        createOrder3: app.globalData["createOrder3"]
    },
    onLoad() {
        this.setData({
            createOrder3: app.globalData["createOrder3"]
        })
    },
    submitData(event) {
        this.orderPay()
    },
    orderPay() {
        console.log(this.data.createOrder3)
        let paramer = {
                "orderId": this.data.createOrder3.orderId,
                "type": 1,
                "amount": this.data.createOrder3.orderAmount
            }
            // app.wxRequest('POST', app.globalData.URL + `/order/pay`, paramer, (res) => {
            //     console.log(res)
            //     console.log("正在支付...")
            // })
    }
})