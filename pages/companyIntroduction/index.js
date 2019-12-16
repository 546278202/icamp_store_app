const app = getApp()
Page({
    data: {
        show: true
    },
    onLoad(options) {
        wx.checkSession({
            success: (res) => {
                console.log("已经登陆");
                this.setData({
                    show: false
                })
            },
            fail: (res) => {
                console.log("需要重新登录");
            }
        })
    },
    getDetail(id) {
        console.log(getCheckSession())
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
    },
})