const app = getApp()
Page({
    data: {
        value: null,
        list: null,
        activeNames: null,
        GoodsList: [
            { name: "100", couponId: 1, amount: 300 },
            { name: "200", couponId: 1, amount: 300 },
            { name: "300", couponId: 1, amount: 300 },
        ],
        options: null,
        show: false
    },
    onLoad: function(options) {
        this.setData({
            options: options
        });
    },
    onChange(event) {
        console.log(event)
        this.setData({
            activeNames: event.detail
        });
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

    switchPage(e) {
        console.log(this.options)
        let index = e.currentTarget.dataset.index
        let item = (this.data.GoodsList[index])
        if (this.options.back) {
            setTimeout(function() {
                var pages = getCurrentPages();
                var beforePage = pages[pages.length - 2];
                beforePage.data.couponData = item
                beforePage.changeWatch();
                wx.navigateBack({
                    delta: 1,
                })
            }, 1000)
        } else {
            wx.switchTab({
                url: '../tab1/index',
            })
        }
    },
    getList(status) {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/order?orderStatus=${status}`, data, (res) => {
            this.setData({
                list: res.data.data,
            })
        }, true)
    },
    getCouponInfo(event) {
        this.setData({ show: true });
    },

    onClose() {
        this.setData({ show: false });
    }

})