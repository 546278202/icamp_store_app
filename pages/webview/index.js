const app = getApp()
Page({
    data: {
        title: null,
        url: null,
        options: null
    },
    onLoad: function(options) {
        this.setData({
            options: JSON.parse(decodeURIComponent(options.detail)),
        });
        console.log(this.data.options)
        if (options) {
            this.setData({
                    url: `https://www.ideas-camp.com/camper/pages/camper.html?projectId=${this.options.projectNum}&linkId=${this.options.camperId}`
                        // url: `https://www.ideas-camp.com/camper/pages/children.html?projectId=${this.options.projectNum}&linkId=${this.options.camperId}`

                })
                // this.setData({
                //     url: "https://www.ideas-camp.com/new.html"
                // })
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
        console.log('加载更多')
    }
})