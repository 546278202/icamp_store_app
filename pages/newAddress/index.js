const app = getApp()
Page({
    data: {
        loading: false,
        detailData: {
            isDefault: true,
            area: {
                provinceName: "北京市",
                cityName: "北京",
                countyName: "东城区",
                countyId: 500
            }
        },
        handleSubmitType: 0, //0添加，1编辑
        id: null,
        provinces: [],
        citys: [],
        area: [],
        valueArr: [0, 0, 0],
        show: false,
        checked: true,

        objectArray: [{
                id: 0,
                name: '男'
            },
            {
                id: 1,
                name: '女'
            }
        ]
    },
    showPopup() {
        this.setData({
            show: true,
        });
        this.abc()
    },
    handleShowPopup() {
        let province = this.data.provinces[this.data.valueArr[0]].district
        let city = this.data.citys[this.data.valueArr[1]].district
        let county = this.data.area[this.data.valueArr[2]].district
        let countyId = this.data.area[this.data.valueArr[2]].districtId //区域id

        let _detailData = this.data.detailData
        _detailData.area.provinceName = province
        _detailData.area.cityName = city
        _detailData.area.countyName = county
        _detailData.area.countyId = countyId
        this.setData({
            detailData: _detailData,
            show: false
        });
    },
    onLoad(options) {
        // 新增
        if (options.detail) {
            console.log(JSON.parse(decodeURIComponent(options.detail)))
            this.setData({
                detailData: JSON.parse(decodeURIComponent(options.detail)),
                handleSubmitType: 1,
            });
            console.log(this.data.detailData)
        }

    },

    abc() {
        let index1 = this.data.valueArr[0]
        let index2 = this.data.valueArr[1]
        let url1 = app.globalData.BASE_URL + `/area/children?pid=1`
        app.wxRequest('GET', url1, {}, (res) => {
            this.setData({
                provinces: res.data.data,
                loading: false
            })

            let url2 = app.globalData.BASE_URL + `/area/children?pid=${this.data.provinces[index1].districtId}`
            app.wxRequest('GET', url2, {}, (res) => {
                this.setData({
                    citys: res.data.data
                })
                let url3 = app.globalData.BASE_URL + `/area/children?pid=${this.data.citys[0].districtId}`
                app.wxRequest('GET', url3, {}, (res) => {
                    this.setData({
                        area: res.data.data,

                    })
                })
            })
        })
    },

    bindchange(e) {
        let index1 = e.detail.value[0]
        let index2 = e.detail.value[1]
        let index3 = e.detail.value[2]
        this.getCitys(this.data.provinces[index1].districtId)
        this.setData({
            valueArr: e.detail.value
        })
    },

    nameChange({ detail }) {
        let _detailData = this.data.detailData
        _detailData.linkman = detail
        this.setData({ detailData: _detailData });
    },
    phoneChange({ detail }) {
        let _detailData = this.data.detailData
        _detailData.phone = detail
        this.setData({ detailData: _detailData });
    },

    addressDetailChange({ detail }) {
        let _detailData = this.data.detailData
        _detailData.detailAddress = detail
        this.setData({ detailData: _detailData });
    },
    checkedChange({ detail }) {
        let _detailData = this.data.detailData
        if (detail == true) {
            _detailData.isDefault = true
        } else {
            _detailData.isDefault = false
        }
        this.setData({ detailData: _detailData });
    },

    // 获取省
    getProvince(id) {
        let url = app.globalData.BASE_URL + `/area/children?pid=${id}`
        app.wxRequest('GET', url, {}, (res) => {
            this.setData({
                provinces: res.data.data
            })
        }, true)
    },
    // 获取城市
    getCitys(id) {
        let url = app.globalData.BASE_URL + `/area/children?pid=${id}`
        app.wxRequest('GET', url, {}, (res) => {
            this.setData({
                citys: res.data.data
            })
            let url3 = app.globalData.BASE_URL + `/area/children?pid=${this.data.citys[this.data.valueArr[1]].districtId}`
            app.wxRequest('GET', url3, {}, (res) => {
                this.setData({
                    area: res.data.data
                })
            })
        })
    },
    //添加地址||更新
    handleSubmit() {
        let data = {
                // linkId: wx.getStorageSync("userInfo").userId,
                areaId: this.data.detailData.area.countyId,
                detailAddress: this.data.detailData.detailAddress,
                linkman: this.data.detailData.linkman,
                phone: this.data.detailData.phone,
                type: 0,
                isDefault: this.data.detailData.isDefault
            }
            // 编辑
        if (this.data.handleSubmitType == 1) {
            data = Object.assign({ id: Number(this.data.detailData.id) }, data)
        }
        console.log(data)
        if (data.areaId && data.detailAddress && data.linkman) {
            app.wxRequest('POST', app.globalData.URL + "/address", data, (res) => {
                wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 1000
                })
                var pages = getCurrentPages();
                if (pages.length > 1) {
                    var prePage = pages[pages.length - 2];
                    prePage.getList()
                    setTimeout(function() {
                        wx.navigateBack()
                    }, 1000)
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

    setTitle: function(e) {
        wx.setNavigationBarTitle({
            title: e
        })
    },
    // getDetail: function(id) {
    //     let url = app.globalData.URL + `/address/${id}`
    //     app.wxRequest('GET', url, {}, (res) => {
    //         let data = res.data.data
    //         console.log(data)
    //         this.setData({
    //             phone: data.phone,
    //             type: data.type,
    //             name: data.linkman,
    //             detailAddress: data.detailAddress,
    //             province: data.area.provinceName,
    //             city: data.area.cityName,
    //             county: data.area.countyName
    //         })
    //     }, true)
    // }
})