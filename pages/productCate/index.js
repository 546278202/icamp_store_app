const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
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
            console.log(article)
            WxParse.wxParse('article', 'html', article, this, 5);
        }, true)
    },
    submitPostEnroll() {
        let attributeValueIds = [];
        this.data.detailData.goodsAttributes.forEach(element => {
            attributeValueIds.push(element.values[this.data.active].attributeValueId)
        });
        var data = [{
            "goodsId": this.data.detailData.goodsId,
            "attributeValueIds": attributeValueIds
        }]
        app.wxRequest('POST', app.globalData.URL + `/order/enroll`, data, (res) => {
            console.log(res.data)
            wx.navigateTo({
                url: '../createOrder/index',
            })
        }, true)
    },
    //报名
    postEnroll() {
        if (wx.getStorageSync("userInfo").campers) {
            this.submitPostEnroll()
        } else {
            wx.showModal({
                title: '体统提示',
                content: '营员信息未填写，建议填写完整',
                showCancel: true, //是否显示取消按钮
                cancelText: "现在填写", //默认是“取消”
                cancelColor: '#576B95', //取消文字的颜色
                confirmText: "继续报名", //默认是“确定”
                confirmColor: '#576B95', //确定文字的颜色
                success: (res) => {
                    if (res.cancel) {
                        wx.navigateTo({
                            url: '../camperList/index',
                        })
                    } else {
                        this.submitPostEnroll()
                    }
                },
                fail: function(res) {}, //接口调用失败的回调函数
                complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            })
        }
    }
})