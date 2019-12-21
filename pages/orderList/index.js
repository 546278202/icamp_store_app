// 0=已取消 1=待支付 2=待完善营员报名信息 3=待发货 4=待收货 5=订单完成
const app = getApp()
Page({
    data: {
        loadingState: true,
        page: 0,
        size: 10,
        status: 1,
        GoodsList: [],
        active: 0,
    },
    onLoad: function(options) {
        console.log(options)
        if (options.detail) {
            this.setData({
                active: parseInt(options.detail),
            })
        } else {
            this.getList()
        }
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
        this.getList()
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
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading();
            console.log(res.data)
            arr = res.data.data
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
    goDetailPage(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.GoodsList[index]
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
        if (item.orderStatus == 5) {
            let str = JSON.stringify(item)
            wx.navigateTo({
                url: `../orderDetail/index?detail=${encodeURIComponent(str)}`
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