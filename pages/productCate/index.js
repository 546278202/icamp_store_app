const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');

Page({
    data: {
        list: [
            { src: '../../image/tab4/1.png', name: "个人资料" },
            { src: '../../image/tab4/2.png', name: "成长记录" },
            { src: '../../image/tab4/3.png', name: "成长记录" },
            { src: '../../image/tab4/4.png', name: "营员信息" },
        ],
        active: 0,
        current: 1,
        goodsId: null,
        detailData: null,
    },
    onLoad(options) {
        console.log(options)
        this.setData({
            goodsId: options.id
        })
        this.getDetail()
    },
    //
    toggle(e) {
        console.log(e.currentTarget.dataset.index)
        this.setData({
            active: e.currentTarget.dataset.index,
        })
    },
    shareModel() {
        wx.updateShareMenu({
            withShareTicket: true,
            success() {

            }
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
    //
    getDetail() {
        let data = {}
        app.wxRequest('GET', app.globalData.BASE_URL + `/goods/${this.data.goodsId}`, data, (res) => {
            this.setData({
                detailData: res.data.data,
            })
            var article = res.data.data.goodsDesc;
            WxParse.wxParse('article', 'html', article, this, 5);
        }, true)
    },

    //  tap: util.throttle(function(e) {  
    //     console.log(this)   console.log(e)   console.log((new Date()).getSeconds())
    //     this.oDetailPage() 
    // }, 1000)
    // })

    goDetailPage(e) {
        let data = {
            active: this.data.active,
            current: this.data.current,
            detailData: this.data.detailData,
        }
        let str = JSON.stringify(data)
        wx.navigateTo({
            url: `../createOrder/index?detail=${encodeURIComponent(str)}`
        })
    }
})