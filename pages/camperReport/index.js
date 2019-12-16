const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
    data: {
        show: true,
        detailData: null
    },
    onLoad(options) {
        this.getDetail()
    },

    getDetail() {
        let data = {}
        app.wxRequest('GET', app.globalData.domainName + `/api/synchro/getCamperReport?camperId=120&projectNum=OP-JP-18-P01623`, data, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    console.log(res.data.data.content)
                    this.setData({
                        detailData: res.data.data,
                    })
                    var article = this.data.detailData.content;
                    WxParse.wxParse('article', 'html', article, this, 5);
                }
            }
        }, true)
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