const app = getApp()
Page({
    data: {
        disabled: false,
        list: [],
        base: {
            camperName: "",
            camperNameEn: "",
            sex: 1,
            birth: "1988-09-20",
            imgId: 20,
            status: 1,
        },
        certificateInformation: {
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
        if (options.title) {
            wx.setNavigationBarTitle({
                title: options.title
            })
            this.getDetail(options.id)
        }
    },

    getDetail(id) {
        let url = app.globalData.URL + `/address?type=0`
            // app.wxRequest('GET', url, {}, (res) => {
            //     console.log(res)
            //     this.setData({
            //         list: res.data.data
            //     })
            // }, true)
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
        let certificateInformation = this.data.certificateInformation
        certificateInformation.idType = this.data.typeArray[e.detail.value].id
        this.setData({
            certificateInformation: certificateInformation
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
        let certificateInformation = this.data.certificateInformation
        certificateInformation.idCode = event.detail
        this.setData({
            certificateInformation: certificateInformation
        })
    },

    onChangeIssuePlace(event) {
        let id = event.currentTarget.dataset.id
        let certificateInformation = this.data.certificateInformation
        certificateInformation.issuePlace = event.detail
        this.setData({
            certificateInformation: certificateInformation
        })
    },
    handleSubmit() {
        this.operationCamper()

    },
    operationCamper() {
        let url = app.globalData.URL + "/camper";
        let data = {
            camperName: this.data.base.camperName,
            camperNameEn: this.data.base.camperNameEn,
            sex: this.data.base.sex,
            birth: this.data.base.birth,
            imgId: 20,
            status: 1,
            // addressId: this.data.list[0].areaId
        }
        if (data.camperName && data.camperNameEn) {
            app.wxRequest('POST', url, data, (res) => {
                let camperId = res.data.data.camperId
                if (camperId) {
                    this.operationInformation(camperId)
                }
            }, true)
        }
    },
    // 证件信息
    operationInformation(id) {
        let url = app.globalData.URL + "/id";
        let data = {
            linkId: id,
            idType: this.data.certificateInformation.idType,
            idCode: this.data.certificateInformation.idCode,
            issuePlace: this.data.certificateInformation.issuePlace,
            expiryDate: this.data.base.birth,
            type: 1
        }
        console.log(data)
        if (data.idCode) {
            app.wxRequest('POST', url, data, (res) => {
                wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 1500
                })
                var pages = getCurrentPages();
                if (pages.length > 1) {
                    var prePage = pages[pages.length - 2];
                    prePage.getList()
                    setTimeout(function() {
                        wx.navigateBack()
                    }, 100)
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
    },
})