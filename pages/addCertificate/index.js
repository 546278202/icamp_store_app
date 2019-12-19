const app = getApp()
Page({
    data: {
        disabled: false,
        handleSubmitType: 0, //0添加，1编辑
        list: [],
        options: null,
        certificates: {
            idCode: "",
            idType: 1,
            linkId: '',
            issuePlace: '',
            expiryDate: null,
            status: 1,
            type: 1,
        },
        index: 0,
        objectArray: [{
                id: 1,
                name: '男'
            },
            {
                id: 2,
                name: '女'
            }
        ],
        typeArray: [{
                id: 1,
                name: '身份证'
            },
            {
                id: 2,
                name: '护照'
            },
            {
                id: 3,
                name: '台胞证'
            },
            {
                id: 4,
                name: '港澳通行证'
            }
        ]
    },
    onLoad(options) {
        // 新增
        if (options.detail0) {
            this.setData({
                certificates: JSON.parse(decodeURIComponent(options.detail0)),
                handleSubmitType: 0,
            });
        }
        // 编辑
        if (options.detail1) {
            wx.setNavigationBarTitle({
                title: "编辑证件"
            })
            this.setData({
                certificates: JSON.parse(decodeURIComponent(options.detail1)),
                handleSubmitType: 1,
            });
        }
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
        let _certificates = this.data.certificates
        _certificates.sex = this.data.objectArray[e.detail.value].id
        this.setData({
            certificates: _certificates
        })
    },
    bindPickerChange1: function(e) {
        this.setData({
            index: e.detail.value
        })
        let certificates = this.data.certificates
        certificates.idType = this.data.typeArray[e.detail.value].id
        this.setData({
            certificates: certificates
        })
    },
    bindDateChange: function(e) {
        console.log(e.detail.value)
        let _certificates = this.data.certificates
        _certificates.expiryDate = e.detail.value
        this.setData({
            certificates: _certificates
        })
    },
    onChange(event) {
        let id = event.currentTarget.dataset.id
        if (id == "camperName") {
            let _certificates = this.data.certificates
            _certificates.camperName = event.detail
            this.setData({
                certificates: _certificates
            })
        } else if (id == "camperNameEn") {
            let _certificates = this.data.certificates
            _certificates.camperNameEn = event.detail
            this.setData({
                certificates: _certificates
            })
        }
    },
    onChangeIdCode(event) {
        let id = event.currentTarget.dataset.id
        let certificates = this.data.certificates
        certificates.idCode = event.detail
        this.setData({
            certificates: certificates
        })
    },

    onChangeIssuePlace(event) {
        let id = event.currentTarget.dataset.id
        let certificates = this.data.certificates
        certificates.issuePlace = event.detail
        this.setData({
            certificates: certificates
        })
    },
    handleSubmit() {
        let data = {
            linkId: this.data.certificates.linkId,
            idType: this.data.certificates.idType,
            idCode: this.data.certificates.idCode,
            issuePlace: this.data.certificates.issuePlace,
            expiryDate: this.data.certificates.expiryDate,
            type: 1
        }
        console.log(data)
        console.log(this.data.certificates)
            // 编辑
        if (this.data.handleSubmitType == 1) {
            data.id = this.data.certificates.id
        }
        // 验证参数
        if (data.linkId && data.idCode) {
            app.wxRequest('POST', app.globalData.URL + "/id", data, (res) => {
                if (res.statusCode == 200) {
                    if (res.data.status == 200) {
                        //返回
                        wx.showToast({
                            title: '操作成功',
                            icon: 'success',
                            duration: 1000
                        })
                        var pages = getCurrentPages();
                        setTimeout(function() {
                            if (pages[pages.length - 4].route === 'pages/createOrder/index') {
                                pages[pages.length - 4].getList()
                                wx.navigateBack({ delta: 3 });
                            } else {
                                console.log(pages)
                                pages[pages.length - 3].getList()
                                wx.navigateBack({ delta: 2 });
                            }
                        }, 1000)
                    }
                }
            }, true)
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
        console.log('加载更多')
        setTimeout(() => {
            this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    }
})