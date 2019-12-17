const app = getApp()
Page({
    data: {
        list: null,
        windowHeight: null,
        windowWidth: null,
        loadingState: true,
        page: 0,
        size: 10,
        cid: null,
        GoodsList: [],
        searchModel: false,
        searchText: "搜索",
        searchValue: "",
        active: 0,
    },
    onLoad: function(options) {
        // this.getCategory()
        this.setData({
            windowHeight: wx.getSystemInfoSync().windowHeight,
            windowWidth: wx.getSystemInfoSync().windowWidth
        })
        this.getTreeCategory()
    },
    lower: function(e) {
        this.getGoodsList(this.data.cid)
        this.setData({
            isHideLoadMore: true
        })

    },
    onChangeLeftItem(e) {
        let index = e.currentTarget.dataset.index
        console.log(this.data)
        this.setData({
            page: 0,
            active: index,
            cid: this.data.list[index].id,
            GoodsList: [],
            loadingState: true,
        })
        setTimeout((res) => {
            this.getGoodsList(this.data.cid)
        }, 300)

    },

    // 树形分类
    getTreeCategory(e) {
        let data = {};
        app.wxRequest('GET', app.globalData.BASE_URL + "/category/tree/2?type=0", data, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    let array = res.data.data[1].children
                    let list = []
                    array.forEach(element => {
                        element.children.forEach(e => {
                            list.push(e)
                        })
                    });
                    this.setData({
                        list: list
                    })
                    this.getGoodsList(this.data.list[0].id)
                }
            }
        }, true)
    },

    //
    // getCategory(e) {
    //     let data = {};
    //     app.wxRequest('GET', app.globalData.BASE_URL + "/category/17?page=0&size=10&type=0", data, (res) => {
    //         this.setData({
    //             list: res.data.data
    //         })
    //         console.log(this.data.list)
    //         this.getGoodsList(this.data.list[0].id)
    //     }, true)
    // },
    onFocus(event) {
        console.log(event)
        this.setData({
            searchModel: true,
            searchText: "取消",
            pageBackgroundColor: "#fff"
        })
    },
    onSearchCancel() {
        this.setData({
            searchModel: false,
            searchText: "搜索",
            searchValue: ''
        })
    },
    onSearchChange(event) {
        this.setData({
            searchValue: event.detail,
            pageBackgroundColor: "#fff"
        })
    },
    onSearch(event) {
        wx.navigateTo({
            url: '../product/index?title=' + this.data.searchValue
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
        console.log("加载更多")
    },

    //获取商品
    getGoodsList(cid) {
        let arr = []
        let url = app.globalData.BASE_URL + `/goods?status=1&page=${this.data.page}&size=${this.data.size}&cid=${cid}&tagIds=&goodsName=&keyWords=&type=`;
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
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
        }, )
    }
});