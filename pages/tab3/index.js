const app = getApp()
Page({
    data: {
        loadingState: true,
        page: 0,
        size: 10,
        dataList: [],
    },
    onLoad: function() {
        this.getGoodsList()
    },
    // 刷新
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        this.setData({
            page: 0,
            dataList: []
        })
        this.getGoodsList()
    },
    //获取商品
    getGoodsList() {
        let arr = []
        let url = app.globalData.URL + `/discovery?page=${this.data.page}&size=${this.data.size}`;
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading();

            console.log(res.data)
            arr = res.data.data
            let dataList = this.data.dataList.concat(arr)
            var page = this.data.page;
            page += 1;
            this.setData({
                dataList: dataList,
                page: page
            })
            if (arr.length < this.data.size) {
                console.log("已经最后一页了")
                this.setData({
                    loadingState: false,
                })
                return
            }
        }, )
    },

    // 加载更多
    onReachBottom: function() {
        this.getGoodsList()
        this.setData({
            isHideLoadMore: true
        })
    },
    goDetailPage(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.dataList[index]
        let str = JSON.stringify(item)
        wx.navigateTo({
            url: `../tab3_detail/index?detail=${encodeURIComponent(str)}`
        })
    },
    // 跳转webview
    jumpWebview() {
        let type = "baidu"
        wx.navigateTo({
            url: `../webview/index?type=${type}`,
        })
    }
})