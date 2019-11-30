const app = getApp()
Page({
    data: {
        list: null,
        active: 0,
    },
    onLoad: function() {
        this.getList(0)
    },
    onChange(event) {
        // 1=退款 2=更换 3=延期
        if (event.detail.index == 0) {
            this.getList(0)
        }
        // 最新
        if (event.detail.index == 1) {
            this.getList(1)
        }
        // 最热
        if (event.detail.index == 2) {
            this.getList(2)
        }
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
        }, (err) => {
            console.log(err.errMsg)
        })
    },
    //图加载失败
    avatarError(e) {
        let index = e.currentTarget.dataset.index
        let data = this.data.list
        data[index].orderGoods[0]["coverImg"]["originalFile"] = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            list: data
        })
    }
})