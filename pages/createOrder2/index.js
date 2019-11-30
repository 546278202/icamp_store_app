const app = getApp()
Page({
    data: {
        goodsId: null,
        detailData: null,
        checked: true,
        price: 0,
        show: false,
        camperList: [],
        campersName: ["请选择"],
        active: 0,
        current: 1,
        result: [],
        severPrice: 0,
        severAttributes: [],
        campDataAttributes: [],
        createOrderList: []
    },
    onLoad() {
        console.log(app.globalData.paramer)
        console.log(app.globalData.createOrder)
        console.log(app.globalData.createOrderList)


        this.setData({
            campersNum: app.globalData.createOrder.campersNum,
            campersName: app.globalData.createOrder.campersName,
            camperList: app.globalData.createOrder.camperList,
            createOrderList: app.globalData.createOrderList,
            detailData: app.globalData.detailData
        })
    },
    submitData(event) {
        app.wxRequest('POST', app.globalData.URL + `/order`, app.globalData.paramer, (res) => {
            console.log(res.data.data)
            app.globalData["createOrder3"] = res.data.data
            wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1500
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '../createOrder3/index',
                })
            }, 1500)
        }, true)
    }
})