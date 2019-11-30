const app = getApp()
Page({
    data: {
        id: null,
        provinces: [],
        citys: [],
        areas: [],

        province: '',
        city: '',
        county: '',

        valueArr: [0, 0, 0],
        show: false,

        name: '',
        phone: '',
        detailAddress: '',
        postCode: '',
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
        this.setData({ show: true });
        this.abc()
    },
    handleShowPopup() {
        console.log(this.data.valueArr)
        let province = this.data.provinces[this.data.valueArr[0]].district
        let city = this.data.citys[this.data.valueArr[1]].district
        let county = this.data.areas[this.data.valueArr[2]].district
        console.log(province, city, county)
        this.setData({
            show: false,
            province: province,
            city: city,
            county: county,
        });

    },

    onLoad(options) {
        this.setData({
            id: options.id,
        });

        if (options.title) {
            this.setTitle(options.title)
            this.getDetail(options.id)
        } else {
            this.abc()
        }
    },

    abc() {
        let url1 = app.globalData.BASE_URL + `/area/children?pid=1`
        app.wxRequest('GET', url1, {}, (res) => {
            this.setData({
                provinces: res.data.data
            })

            let url2 = app.globalData.BASE_URL + `/area/children?pid=${this.data.provinces[0].districtId}`
            app.wxRequest('GET', url2, {}, (res) => {
                this.setData({
                    citys: res.data.data
                })
                let url3 = app.globalData.BASE_URL + `/area/children?pid=${this.data.citys[0].districtId}`
                app.wxRequest('GET', url3, {}, (res) => {
                    this.setData({
                        areas: res.data.data
                    })
                })
            })
        })
    },

    bindchange(e) {
        this.getCitys(this.data.provinces[e.detail.value[0]].districtId)
        this.setData({
            valueArr: e.detail.value
        })
    },

    nameChange({ detail }) {
        this.setData({ name: detail });
    },
    phoneChange({ detail }) {
        this.setData({ phone: detail });
    },
    postCodeChange({ detail }) {
        this.setData({ postCode: detail });
    },
    addressDetailChange({ detail }) {
        this.setData({ detailAddress: detail });
    },
    checkedChange({ detail }) {
        this.setData({ checked: detail });
    },

    // 获取省
    getProvince(id) {
        let url = app.globalData.BASE_URL + `/area/children?pid=${id}`
        app.wxRequest('GET', url, {}, (res) => {
            console.log(res)
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
                    areas: res.data.data
                })
            })
        })
    },
    //添加地址||更新
    handleSubmit() {
        let data = {
            // linkId: wx.getStorageSync("userInfo").userId,
            areaId: this.data.areas[this.data.valueArr[2]].districtId,
            detailAddress: this.data.detailAddress,
            linkman: this.data.name,
            phone: this.data.phone,
            type: 0,
            isDefault: this.data.checked
        }
        if (this.data.id) {
            data = Object.assign({ id: Number(this.data.id) }, data)
        }

        let url3 = app.globalData.URL + "/address"
        app.wxRequest('POST', url3, data, (res) => {
            console.log(res)
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
    getDetail: function(id) {
        let url = app.globalData.URL + `/address/${id}`
        app.wxRequest('GET', url, {}, (res) => {
            let data = res.data.data
            console.log(data)
            this.setData({
                phone: data.phone,
                type: data.type,
                name: data.linkman,
                detailAddress: data.detailAddress,
                province: data.area.provinceName,
                city: data.area.cityName,
                county: data.area.countyName
            })
        }, true)
    }
})