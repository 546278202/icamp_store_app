const app = getApp()
Page({
    data: {
        dataList: null,
        options: null,
        show: false,
        actions: [{
            name: '编辑营员',
        }, ]
    },

    onLoad: function(options) {
        this.getList()
        this.setData({
            options: options,
        })
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
        })
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
        if (pages.length > 1) {
            // 上一个页面实例对象
            var prePage = pages[pages.length - 2];
            prePage.data.camperList = arr
            prePage.getCmpersList()
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
        const { position, instance } = event.detail;
        wx.showModal({
            title: '提示',
            content: '您确定删除当前数据么？',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定')
                    instance.close();

                    this.delList(index)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                    instance.close();


                }
            }
        })
    },
    //编辑人员
    editCamper(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.dataList[index]
        let arr = [item]
            // get证件信息
        app.wxRequest('GET', app.globalData.URL + `/id?linkId=${item.camperId}&type=1&idType=1`, {}, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    arr.push(res.data.data)
                    let str = JSON.stringify(arr)
                    wx.navigateTo({
                        url: `../addCamper/index?detail=${encodeURIComponent(str)}`
                    })
                }
            }
        }, true)
    },
    //商品列表默认图
    listAvatarError(e) {
        let index = e.currentTarget.dataset.index
        let data = this.data.dataList
        data[index]["image"]["originalFile"] = "../../image/base.png"
        this.setData({
            dataList: data
        })
    }
})