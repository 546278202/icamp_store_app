const app = getApp()
Page({
    data: {
        list: null,
    },

    onLoad: function() {
        this.getList()
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
    getList() {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/user/wallet`, data, (res) => {
            console.log(res)
            this.setData({
                list: res.data.data,
            })
        }, true)
    },

})