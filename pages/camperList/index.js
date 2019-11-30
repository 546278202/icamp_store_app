const app = getApp()
Page({
    data: {
        dataList: null,
        options: null,
        show: false,
        actions: [{
                name: '编辑营员',
                url: '../addCamper/index?title=编辑营员'
            },
            // {
            //     name: '编辑详细信息',
            //     url: '../addCamper_detail/index?title=编辑详细信息'
            // },
            // {
            //     name: '编辑注意事项',
            //     url: '../addCamper_detail/index?title=编辑注意事项'
            // }
        ]
    },

    onLoad: function(options) {
        this.getList()
            // this.setData({
            //     options: options,
            // })
    },
    getList() {
        let url = app.globalData.URL + "/camper?type=1"
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            if (res.data.data) {
                var arr = []
                res.data.data.forEach(element => {
                    element["isChecked"] = false
                    arr.push(element)
                });
                this.setData({
                    dataList: arr,
                })
            }
        }, true)
    },

    onClose1(event) {
        this.setData({
            show: false,
        })
    },
    onSelect(event) {
        console.log(event);
        wx.navigateTo({
            url: event.detail.url
        })
    },
    // 删除
    delList(index) {
        let url = app.globalData.URL + `/camper/${index}`
        app.wxRequest('DELETE', url, {}, (res) => {
            console.log(res)
            wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
            })
            this.getList()
        }, true)
    },
    showPopup() {
        this.setData({ show: true });
    },
    handleShowPopup() {
        this.setData({
            show: false,
        });
    },
    chooseCamper(event) {
        let index = event.currentTarget.dataset.index
        let dataList = this.data.dataList

        console.log(index, dataList)
        if (dataList[index].isChecked) {
            dataList[index].isChecked = false
        } else {
            dataList[index]["isChecked"] = true
        }
        this.setData({
            dataList: dataList
        });
    },
    // 保存选择
    submitData(event) {
        let arr = []
        this.data.dataList.forEach(element => {
            if (element.isChecked) {
                arr.push(element)
            }
        });
        var pages = getCurrentPages();
        console.log(pages)
        if (pages.length > 1) {
            // 上一个页面实例对象
            var prePage = pages[pages.length - 2];
            prePage.data.camperList = arr
            prePage.getCmpersName()
            setTimeout(function() {
                wx.navigateBack()
            }, 100)
        }
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
    onClose(event) {
        let index = event.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '您确定删除当前数据么？',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定')
                    this.delList(index)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})