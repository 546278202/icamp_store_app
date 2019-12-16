// 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成
const app = getApp()
Page({
    data: {
        loadingState: true,
        page: 0,
        size: 10,
        list: null,
        active: 0,
    },
    onLoad: function() {
        this.getList(1)
    },
    onChange(event) {
        // 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成 6=售后
        if (event.detail.index == 0) {
            this.getList(1)
        }
        if (event.detail.index == 1) {
            this.getList(2)
        }
        if (event.detail.index == 2) {
            this.getList(5)
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
        console.log('加载更多')
        setTimeout(() => {
            this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },
    getList(status) {
        let data = {}
        console.log(status)
        let arr = []
        app.wxRequest('GET', app.globalData.URL + `/order?orderStatus=${status}&page=${this.data.page}&size=${this.data.size}`, data, (res) => {
            console.log(res)
            arr = res.data.data
            this.setData({
                    loadingState: false,
                    list: res.data.data,
                })
                // if (arr.length < this.data.size) {
                //     console.log("已经最后一页了")
                //     this.setData({
                //         loadingState: false,
                //         list: res.data.data,
                //     })
                //     return
                // }
        }, true)
    },
    // 根据订单查人数
    getOrderCampList(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.list[index]
        let data = {}
        let arr = []
        app.wxRequest('GET', app.globalData.URL + `/order/camper/${item.orderId}`, data, (res) => {
            console.log(res)
            arr = res.data.data
            this.setData({
                    loadingState: false,
                    list: res.data.data,
                })
                // if (arr.length < this.data.size) {
                //     console.log("已经最后一页了")
                //     this.setData({
                //         loadingState: false,
                //         list: res.data.data,
                //     })
                //     return
                // }
        }, true)
    },
    goDetailPage(e) {



        let index = e.currentTarget.dataset.index
        let item = this.data.list[index]
            // 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成 6=售后
        if (item.orderStatus == 0) {

        }
        if (item.orderStatus == 1) {

            let str = JSON.stringify(item)
            wx.navigateTo({
                url: `../orderDetail/index?detail=${encodeURIComponent(str)}`
            })
        }
        if (item.orderStatus == 2) {
            let str = JSON.stringify(item)
            wx.navigateTo({
                url: `../orderDetail/index?detail=${encodeURIComponent(str)}`
            })
        }
    },

    //图加载失败
    avatarError(e) {
        let index = e.currentTarget.dataset.index
        let data = this.data.list
        data[index].orderGoods[0]["coverImg"]["originalFile"] = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            list: data
        })
    }
})