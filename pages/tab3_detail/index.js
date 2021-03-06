const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        active: 1,
        options: null,
        detailData: null
    },
    onLoad: function(options) {
        this.setData({
            options: JSON.parse(decodeURIComponent(options.detail)),
        });
        console.log(this.data.options)
        this.getDetail()
    },
    getDetail() {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/discovery/${this.data.options.id}`, data, (res) => {
            this.setData({
                detailData: res.data.data,
            });
            var article = this.data.detailData.content;
            WxParse.wxParse('article', 'html', article, this, 5);
        }, true)
    },
    // 导航切换
    toggle: function(e) {
        console.log(e)
        var a = e.currentTarget.dataset.no
        this.setData({
            active: a
        })
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
})