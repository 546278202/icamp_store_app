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
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        imgUrls2: [
            { src: '../../image/tab1/class1.png', name: "营会", id: 27 },
            { src: '../../image/tab1/class2.png', name: "夏校", id: 28 },
            { src: '../../image/tab1/class3.png', name: "博物", id: 29 },
            { src: '../../image/tab1/class4.png', name: "活动", id: 30 },
            { src: '../../image/tab1/class5.png', name: "年龄", id: null },
        ],
        imgUrls3: [
            { src: '../../image/class6.png', name: "启行夏校" },
            { src: '../../image/class7.png', name: "少年营" },
            { src: '../../image/class8.png', name: "营地视频" },
            { src: '../../image/class9.png', name: "体验中心" },
            { src: '../../image/class10.png', name: "营会话题" },
        ],
        GoodsList: [],
        hotGoodsList: [],
        searchModel: false,
        searchText: "搜索",
        searchValue: "",
        active: 1, //导航
        show: false,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,

        swiperH: '', //swiper高度
        nowIdx: 0, //当前swiper索引
        imgList: [ //图片列表
            "/public/img/idx-ad.png",
            "/public/img/idx-ad.png",
            "/public/img/idx-ad.png",
        ],
        indicatorDots: true
    },
    onLoad: function(options) {
        this.getCategory()
            //获取热销商品
        this.getHotGoodsList(4)
    },
    //获取swiper高度
    getHeight: function(e) {
        var winWid = wx.getSystemInfoSync().windowWidth - 2 * 50; //获取当前屏幕的宽度
        var imgh = e.detail.height; //图片高度
        var imgw = e.detail.width;
        var sH = winWid * imgh / imgw + "px"
        this.setData({
            swiperH: sH //设置高度
        })
    },
    //swiper滑动事件
    swiperChange: function(e) {
        this.setData({
            nowIdx: e.detail.current
        })
    },
    companyIntroduction() {
        wx.navigateTo({
            url: '../companyIntroduction/index'
        })
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

    },
    //轮播图点击事件
    swipclick: function(e) {
        let index = this.data.nowIdx
        let item = this.data.hotGoodsList[index]
        wx.navigateTo({
            url: `../productCate/index?id=${item.id}`
        })
    },
    //事件处理函数
    bindViewTap: function(e) {
        let index = e.currentTarget.dataset.index
        console.log(index)
        if (index == 4) {
            wx.switchTab({
                url: "../tab2/index"
            });
        } else {
            let item = this.data.imgUrls2[index]
            wx.navigateTo({
                url: `../product/index?title=${item.name}&tagId=${item.id}`
            })
        }
    },
    getCategory: function(e) {
        let data = {};
        app.wxRequest('GET', app.globalData.BASE_URL + "/category/1?page=0&size=10&type=0", data, (res) => {
            console.log(res.data)
        })
    },
    //获取热销
    getHotGoodsList(type) {
        // type=推荐2，最新3,最热4
        console.log(type)
        let url = app.globalData.BASE_URL + `/goods?status=1&page=${this.data.page}&size=${this.data.size}&cid=&tagIds=&goodsName=&keyWords=&type=${type}`;
        app.wxRequest('GET', url, {}, (res) => {
            console.log(res.data)
            let arr = res.data.data
            this.setData({
                hotGoodsList: arr
            })
        })
    },
    //获取商品
    getGoodsList() {
        // type=推荐2，最新3,最热4
        let arr = []
        let url = app.globalData.BASE_URL + `/goods?status=1&page=${this.data.page}&size=${this.data.size}&cid=&tagIds=&goodsName=&keyWords=&type=`;
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
    },
    //热销商品默认图
    hotAvatarError(e) {
        let index = e.currentTarget.dataset.index
        let data = this.data.hotGoodsList
        data[index].icon = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            hotGoodsList: data
        })
    },
    //商品列表默认图
    listAvatarError(e) {
        let index = e.currentTarget.dataset.index
        let data = this.data.GoodsList
        data[index].icon = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            GoodsList: data
        })
    }
});