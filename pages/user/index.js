const app = getApp()
const file = require('../../utils/file.js');
Page({
    data: {
        arr: [],
        count: 0,
        userInfo: {},
        objectArray: [{
                id: 1,
                name: '男'
            },
            {
                id: 2,
                name: '女'
            }
        ]
    },

    onLoad(options) {
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
    },
    bindPickerChange: function(e) {
        let userInfo = this.data.userInfo
        userInfo.sex = this.data.objectArray[e.detail.value].id
        this.setData({
            userInfo: userInfo
        })
    },
    getList() {
        let url = app.globalData.URL + "/camper?type=1"
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            console.log(res.data)
        }, true)
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
        let data = this.data.userInfo
        data.image["originalFile"] = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        this.setData({
            userInfo: data
        })
    },

    userNameChange(e) {
        let userInfo = this.data.userInfo
        userInfo.userName = e.detail
        this.setData({
            userInfo: userInfo
        })
    },

    emailChange(e) {
        let userInfo = this.data.userInfo
        userInfo.email = e.detail
        this.setData({
            userInfo: userInfo
        })
    },

    chooseImage() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                this.setData({
                    arr: res.tempFilePaths[0]
                })
                let url = app.globalData.BASE_URL + `/files`
                file.fileUpload(url, this.data.arr).then((data) => {
                    let url = JSON.parse(data.data).data[0].url
                    let fileId = JSON.parse(data.data).data[0].fileId
                    let userInfo = this.data.userInfo
                    userInfo.image["originalFile"] = url
                    userInfo.fileId = fileId
                    this.setData({
                        userInfo: userInfo
                    })

                }, (err) => {
                    console.log('失败' + err)
                })

            }
        })
    },

    handleSubmit(e) {
        let data = {
            // userName: this.data.userInfo.userName,
            // phone: 13880204719,
            userId: this.data.userInfo.userId,
            fileId: this.data.userInfo.fileId,
            email: this.data.userInfo.email,
            sex: this.data.userInfo.sex,
            froms: 0
        }
        app.wxRequest('PUT', app.globalData.URL + `/user`, data, (res) => {
            wx.setStorage({
                key: 'userInfo',
                data: this.data.userInfo
            })

            app.globalData.userInfo = this.data.userInfo
            wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
            })
            var pages = getCurrentPages();
            if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.onLoad()
                setTimeout(function() {
                    wx.navigateBack()
                }, 2000)
            }

        }, true)
    }
})