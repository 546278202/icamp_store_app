const app = getApp()
Page({
    data: {
        id: null,
        list: null,
    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            id: options.id,
        });

        this.getDetail()
    },
    getDetail() {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/order/${this.data.id}`, data, (res) => {
            this.setData({
                list: res.data.data[0],
            });
            console.log(this.data.list)
        }, true)
    },
    // 刷新
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        setTimeout(() => {
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading();
        }, 1000)
    }
})