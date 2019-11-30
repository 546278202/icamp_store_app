// 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成
const app = getApp()
Page({
    data: {
        list: null,
    },

    onLoad: function() {
        this.getList(0)
    },

    // 刷新
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        setTimeout(() => {
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading();
        }, 1000)
    },

    // 加载更多
    onReachBottom: function() {
        console.log('加载更多')
        setTimeout(() => {
            this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },
    getList(status) {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/order?orderStatus=${status}`, data, (res) => {
            this.setData({
                list: res.data.data,
            })
        }, true)
    },

})