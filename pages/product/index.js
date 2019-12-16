const app = getApp()

Page({
    data: {

        goodsList: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        title: null,
        tagIds: null
    },
    onLoad(options) {
        this.setData({
            title: options.title,
            tagIds: options.tagId,
        })
        wx.setNavigationBarTitle({
            title: options.title
        })
        this.getGoodsList()
    },
    onChange(event) {
        console.log(event.detail.index + 1)
    },
    //获取商品分类
    getGoodsList() {
        wx.request({
            url: app.globalData.BASE_URL + `/goods?status=1&page=0&size=10&cid=&tagIds=${this.data.tagIds}&goodsName=&keyWords=&type=`,
            data: {},
            method: 'GET',
            header: {}, // 设置请求的 header  
            success: (res) => {
                console.log(res)
                wx.hideLoading()
                this.setData({
                    goodsList: res.data.data,
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
    }
})