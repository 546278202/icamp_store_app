const app = getApp()
Page({
    data: {
        categoryData: null,
        list: [{
                src: '../../image/tab2/1.png',
                name: "主题营",
                list: [
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "亲子营" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "研学营" },
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "亲子营" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "研学营" },

                ]
            },
            {
                src: '../../image/tab2/2.png',
                name: "特色营",
                list: [
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "科技营" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "军事营" },
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "太空营" },
                ]
            },
            {
                src: '../../image/tab2/3.png',
                name: "假日营",
                list: [
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "周末营" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "周末营" },
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "周末营" }

                ]
            },
            {
                src: '../../image/tab2/4.png',
                name: "营地培训",
                list: [
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "导师培训" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "公开课" },
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "公开课" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "公开课" },
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "公开课" },
                ]
            },
            {
                src: '../../image/tab2/5.png',
                name: "其他",
                list: [
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "体验中心" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "技能培训" },
                    { src: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640', name: "体验中心" },
                    { src: 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640', name: "体验中心" },
                ]
            }
        ]
    },
    onLoad: function(options) {
        this.getCategory()
    },
    //分类数据
    getCategory() {
        wx.request({
            url: app.globalData.BASE_URL + "/category/1?page=0&size=10&type=0",
            data: {},
            method: 'GET',
            // header: {}, // 设置请求的 header  
            success: (res) => {
                wx.hideLoading()
                this.setData({
                    categoryData: res.data.data,
                })
            }
        });
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
    //图加载失败
    avatarError(e) {
        var index = e.currentTarget.dataset.index
        var categoryDataArr = JSON.parse(JSON.stringify(this.data.categoryData))
        categoryDataArr[index].logoFile.originalFile = "https://ideas-camp.com/img/help_banner.png"
        this.setData({
            categoryData: categoryDataArr
        })
    }
})