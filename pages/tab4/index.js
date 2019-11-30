const app = getApp()
Page({
    data: {
        windowHeight: null,
        windowWidth: null,

        list: [
            { src: '../../image/tab4/1.png', name: "个人资料" },
            { src: '../../image/tab4/2.png', name: "我的营会" },
            { src: '../../image/tab4/3.png', name: "成长记录" },
            { src: '../../image/tab4/4.png', name: "营员信息" },
            { src: '../../image/tab4/5.png', name: "地址管理" },
        ],
        userInfo: {
            userName: "登陆/注册",
            image: { originalFile: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" }
        }
    },
    onLoad() {
        this.setData({
            windowHeight: wx.getSystemInfoSync().windowHeight,
            windowWidth: wx.getSystemInfoSync().windowWidth
        })
        wx.getStorage({
            key: 'userInfo',
            success: (res) => {
                var _data = res.data
                console.log(res)
                if (!_data.image) {
                    _data.image = { originalFile: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" }
                }
                this.setData({
                    userInfo: _data
                })
            }
        })
        console.log(this.data.userInfo)

    },
    isLogin() {
        if (this.data.userInfo.userName == "登陆/注册") {
            wx.navigateTo({
                url: '../tologin/index'
            })
        }
    },
    // handleResetPath(event) {
    //     var currentIndex = event.currentTarget.dataset.index
    //     if (currentIndex == 0) {
    //         wx.navigateTo({
    //             url: '../user/index'
    //         })
    //     }
    //     if (currentIndex == 1) {
    //         wx.navigateTo({
    //             url: '../orderList/index'
    //         })
    //     }
    //     if (currentIndex == 3) {
    //         wx.navigateTo({
    //             url: '../camperList/index'
    //         })
    //     }
    //     if (currentIndex == 4) {
    //         wx.navigateTo({
    //             url: '../addressList/index'
    //         })
    //     }
    // },
    onChange(event) {
        console.log(event.detail.index + 1)
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
        setTimeout(() => {
            this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },

    //图加载失败
    avatarError(e) {
        console.log(e)
        let data = this.data.userInfo
        data.image["originalFile"] = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            userInfo: data
        })
    }

})