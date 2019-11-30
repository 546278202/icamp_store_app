const app = getApp()
Page({
    data: {
        loadingState: true,
        page: 0,
        size: 10,
        pageBackgroundColor: "",
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        imgUrls2: [
            { src: '../../image/class1.png', name: "亲子营" },
            { src: '../../image/class2.png', name: "冬夏令营" },
            { src: '../../image/class3.png', name: "周末营" },
            { src: '../../image/class4.png', name: "国内营" },
            { src: '../../image/class5.png', name: "国外营" },
        ],
        imgUrls3: [
            { src: '../../image/class6.png', name: "启行夏校" },
            { src: '../../image/class7.png', name: "少年营" },
            { src: '../../image/class8.png', name: "营地视频" },
            { src: '../../image/class9.png', name: "体验中心" },
            { src: '../../image/class10.png', name: "营会话题" },
        ],
        GoodsList: [],
        searchModel: false,
        searchText: "搜索",
        searchValue: "",
        active: 1, //导航
        show: false,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
    },
    onLoad: function(options) {
        this.getCategory()
        this.getGoodsList(3)
    },

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
    onChange(event) {
        this.setData({
                GoodsList: [],
                page: 0
            })
            // 推荐
        if (event.detail.index == 0) {
            this.getGoodsList(2)
        }
        // 最新
        if (event.detail.index == 1) {
            this.getGoodsList(3)
        }
        // 最热
        if (event.detail.index == 2) {
            this.getGoodsList(4)
        }
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
        this.getGoodsList(3)
        this.setData({
            isHideLoadMore: true
        })
    },

    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    getCategory: function(e) {
        let data = {};
        app.wxRequest('GET', app.globalData.BASE_URL + "/category/1?page=0&size=10&type=0", data, (res) => {
            console.log(res.data)
        })
    },
    //获取商品分类
    getGoodsList(type) {
        // type=推荐2，最新3,最热4
        console.log("load page " + (this.data.page + 1));
        let arr = []
        let url = app.globalData.BASE_URL + `/goods?status=1&page=${this.data.page}&size=${this.data.size}&cid=&tagIds=&goodsName=&keyWords=&type=${type}`;
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            console.log(res.data)
            arr = res.data.data
            if (arr.length < this.data.size) {
                console.log("已经最后一页了")
                this.setData({
                    loadingState: false,
                })
                return
            }
            let GoodsList = this.data.GoodsList.concat(arr)
            var page = this.data.page;
            page += 1;
            this.setData({
                GoodsList: GoodsList,
                page: page
            })
        }, )
    }
});