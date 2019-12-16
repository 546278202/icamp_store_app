// 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成
const app = getApp()
Page({
    data: {
        options: null,
        animation: null,
        animationState: false,
        loadingState: true,
        page: 0,
        size: 10,
        status: 5,
        GoodsList: [],
        // camperList: [],
        active: 0,
        activeNames: { name: "100", couponId: 1, amount: 300 },

    },
    onLoad: function(options) {
        console.log(options)
        this.setData({
            options: options
        })
        this.getList()
    },
    onChange1(event) {
        console.log(event)
        this.setData({
            activeNames: event.detail
        });
    },
    onShow: function() {
        console.log('index---------onShow()')
        this.animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
            delay: 0,
            transformOrigin: '50% 50% 0',
            success: function(res) {
                console.log("res")
            }
        })
    },
    rotateAni: function(n) {
        console.log(this.data.animation)
        console.log(this)
        this.animation.rotate(90 * (n)).step()
        this.setData({
            animation: this.animation.export()
        })
        console.log(this.data.animation)
    },
    onChange(event) {
        this.setData({
                GoodsList: [],
                page: 0,
                isHideLoadMore: true
            })
            // 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成 6=售后
        if (event.detail.index == 0) {
            this.setData({
                status: 1
            })
            this.getList()
        }
        if (event.detail.index == 1) {
            this.setData({
                status: 2
            })
            this.getList()
        }
        if (event.detail.index == 2) {
            this.setData({
                status: 5
            })
            this.getList()
        }
        // if (event.detail.index == 3) {
        //     this.getList(6)
        // }
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
        this.getList(this.data.status)
        this.setData({
            isHideLoadMore: true
        })
    },
    getList() {
        let arr = []
        let url = app.globalData.URL + `/order?status=${this.data.status}&page=${this.data.page}&size=${this.data.size}`;
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            console.log(res.data)
            arr = res.data.data
            arr.forEach(element => {
                element.animationState = false
                element.camperList = []
            });
            let GoodsList = this.data.GoodsList.concat(arr)
            var page = this.data.page;
            page += 1;
            this.setData({
                GoodsList: GoodsList,
                page: page
            })
            if (arr.length < this.data.size) {
                console.log("已经最后一页了")
                this.setData({
                    loadingState: false,
                })
                return
            }
        }, true)
    },
    goCamperReport(e) {
        let index = e.currentTarget.dataset.index
        let index_b = e.currentTarget.dataset.index_b

        let item = this.data.GoodsList[index]
        let _GoodsList = this.data.GoodsList

        // 问卷
        if (this.options.detail == 1) {
            let str = {
                projectNum: item.attributeValues,
                camperId: item.camperList[index_b].camperId
            }
            console.log(str)
            wx.navigateTo({
                url: `../webview/index?detail=${encodeURIComponent(JSON.stringify(str))}`
            })
        }
        // 营会记录
        if (this.options.detail == 3) {
            let arr = []
            let url = app.globalData.domainName + `/api/synchro/getProjectDayCount?projectNum=OP-JP-18-P01623`;
            let data = {};
            app.wxRequest('GET', url, data, (res) => {
                if (res.statusCode == 200) {
                    let day = res.data.data
                    let arr = []
                    for (var i = 0; i < day; i++) {
                        arr.push(i)
                    }
                    let str = JSON.stringify(arr)
                    wx.navigateTo({
                        url: `../camperLog/index?detail=${encodeURIComponent(str)}`
                    })
                }
            }, true)
        }
        // 一封信
        if (this.options.detail == 4) {
            wx.navigateTo({
                url: `../camperReport/index`
            })
        }
    },

    goDetailPage(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.GoodsList[index]
        let _GoodsList = this.data.GoodsList
        if (item.animationState == false) {
            let data = {};
            app.wxRequest('GET', app.globalData.URL + `/order/camper/${item.orderId}`, data, (res) => {
                if (res.statusCode == 200) {
                    if (res.data.status == 200) {
                        _GoodsList[index].animationState = true
                        _GoodsList[index].camperList = res.data.data
                        this.setData({
                            GoodsList: _GoodsList
                        })
                    }
                }
            }, true)
        } else {

            _GoodsList[index].animationState = false
            this.setData({
                GoodsList: _GoodsList
            })
        }
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