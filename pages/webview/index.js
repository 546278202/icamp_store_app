const app = getApp()
Page({
    data: {
        title: null,
        url: null,
        options: null
    },
    onLoad: function(options) {
        if (options.detail == "huati") {
            this.setData({
                url: `https://www.ideas-camp.com/limesurvey/index.php?r=survey/index&sid=673322&lang=zh-Hans`
            })
        } else if (options.detail == "toupiao") {
            this.setData({
                url: `https://www.ideas-camp.com/limesurvey/index.php?r=survey/index&sid=754177&lang=zh-Hans`
            })
        } else if (options.detail == "fankui") {
            this.setData({
                url: `https://www.ideas-camp.com/limesurvey/index.php?r=survey/index&sid=647835&lang=zh-Hans`
            })
        } else {
            this.setData({
                options: JSON.parse(decodeURIComponent(options.detail)),
            });
            this.setData({
                url: `https://www.ideas-camp.com/camper_app/pages/camper.html?projectId=${this.options.projectNum}&linkId=${this.options.camperId}`
            })
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