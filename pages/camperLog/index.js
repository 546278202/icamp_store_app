// 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
    data: {
        loadingState: true,
        page: 0,
        size: 10,
        GoodsList: {},
        DayList: [1, 3, 4],
        active: 0,
        options: []
    },
    onLoad: function(options) {
        this.setData({
            options: JSON.parse(decodeURIComponent(options.detail)),
        });
        this.getList()
    },
    onChange(event) {
        this.setData({
            GoodsList: {},
            active: event.detail.index,
            loadingState: true,
        })
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

    },

    getList() {
        let url = app.globalData.domainName + `/api/synchro/getLivingRecord?projectNum=OP-BD-18-16&dayNum=${this.data.active+1}`;
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            if (res.statusCode == 200) {
                console.log(res)
                if (res.data.data) {
                    this.setData({
                        GoodsList: res.data.data,
                        loadingState: false
                    })
                    let article = this.data.GoodsList.content
                    console.log(article)
                    WxParse.wxParse('article', 'html', article, this, 5);
                } else {
                    this.setData({
                        GoodsList: {},
                        loadingState: false
                    })
                    WxParse.wxParse('article', 'html', '', this, 5);
                }
            }
        })
    },

    //图加载失败
    avatarError(e) {
        console.log(e)
        let index = e.currentTarget.dataset.index
        let data = this.data.GoodsList
        data[index]["icon"] = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            GoodsList: data
        })
    },
})