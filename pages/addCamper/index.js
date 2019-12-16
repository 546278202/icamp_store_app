const app = getApp()
Page({
    data: {
        disabled: false,
        handleSubmitType: 0, //0添加，1编辑
        list: [],
        base: {
            sex: 1,
            birth: "1988-11-20",
            imgId: 20,
            status: 1,
        },
        certificates: {
            idCode: "",
            idType: 1,
            linkId: '',
            issuePlace: '',
            expiryDate: '',
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
            },
            {
                id: 5,
                name: '企业营业执照 '
            },
        ]
    },
    onLoad(options) {
        if (options.detail) {
            wx.setNavigationBarTitle({
                title: "编辑营员"
            })
            this.setData({
                handleSubmitType: 1,
                base: JSON.parse(decodeURIComponent(options.detail))[0],
                certificates: JSON.parse(decodeURIComponent(options.detail))[1],
            });
        }
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
        let _base = this.data.base
        _base.sex = this.data.objectArray[e.detail.value].id
        this.setData({
            base: _base
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

        let _base = this.data.base
        _base.birth = e.detail.value
        this.setData({
            base: _base
        })
    },
    onChange(event) {
        let id = event.currentTarget.dataset.id
        if (id == "camperName") {
            let _base = this.data.base
            _base.camperName = event.detail
            this.setData({
                base: _base
            })
        } else if (id == "camperNameEn") {
            let _base = this.data.base
            _base.camperNameEn = event.detail
            this.setData({
                base: _base
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
                camperName: this.data.base.camperName,
                camperNameEn: this.data.base.camperNameEn,
                sex: this.data.base.sex,
                birth: this.data.base.birth,
                imgId: 20,
                status: 1,
            }
            // 编辑
        if (this.data.handleSubmitType == 1) {
            data.camperId = this.data.base.camperId
        }
        // 验证参数
        if (data.camperName && data.camperNameEn) {
            app.wxRequest('POST', app.globalData.URL + "/camper", data, (res) => {
                if (res.statusCode == 200) {
                    if (res.data.status == 200) {
                        let camperId = res.data.data.camperId
                        this.getCertificate(camperId)
                    }
                }
            }, true)
        }
    },
    // 查询证件
    getCertificate(linkId) {
        app.wxRequest('GET', app.globalData.URL + `/id?linkId=${linkId}&type=1&idType=1`, {}, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    let list = res.data.data
                    if (list.length == 0) {
                        // 代表新增
                        list = { linkId: linkId }
                        let str = JSON.stringify(list)
                        wx.navigateTo({
                            url: `../addCertificate/index?detail0=${encodeURIComponent(str)}`
                        })
                    } else {
                        let str = JSON.stringify(list)
                        wx.navigateTo({
                            url: `../addCertificate/index?detail1=${encodeURIComponent(str)}`
                        })
                    }
                }
            }
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
    }
})