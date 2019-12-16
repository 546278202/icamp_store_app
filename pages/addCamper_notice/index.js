const app = getApp()
Page({
    data: {
        show: false,
        languageGradeShow: false,
        base: {},
        objectArray: ["中文", "英语", "日语", "法语"],
        languageGradeArray: ["一般", "良好", "优秀"],
        options: null,
        dataList: []
    },
    onLoad(options) {
        if (options.detail) {
            this.setData({
                options: JSON.parse(decodeURIComponent(options.detail)),
            });
            console.log(JSON.parse(decodeURIComponent(options.detail)))
        }
        this.getCamperDetail()
    },

    onChangehealthCondition(event) {
        let _base = this.data.base
        _base.healthCondition = event.detail
        this.setData({
            base: _base
        })
    },
    onChangedieteticContraindication(event) {
        let _base = this.data.base
        _base.dieteticContraindication = event.detail
        this.setData({
            base: _base
        })
    },
    onChangeAllergy(event) {
        let _base = this.data.base
        _base.allergy = event.detail
        this.setData({
            base: _base
        })
    },
    onChangeHistory(event) {
        let _base = this.data.base
        _base.history = event.detail
        this.setData({
            base: _base
        })
    },
    onChangevaccine(event) {
        let _base = this.data.base
        _base.vaccine = event.detail
        this.setData({
            base: _base
        })
    },

    handleShowPopup() {
        this.setData({
            show: true,
        });
    },
    handleOnClose() {
        this.setData({
            show: false,
        });
    },
    handleOnConfirm(event) {
        const { picker, value, index } = event.detail;
        let _base = this.data.base
        _base.language = value
        _base.languageType = index
        this.setData({
            base: _base,
            show: false
        });
    },
    languageGradeShowPopup() {
        this.setData({
            languageGradeShow: true,
        });
    },
    languageGradeOnConfirm(event) {
        const { picker, value, index } = event.detail;
        let _base = this.data.base
        _base.languageGrade = value
        _base.languageGradeType = index
        this.setData({
            base: _base,
            languageGradeShow: false
        });
    },
    languageGradeOnClose() {
        this.setData({
            languageGradeShow: false,
        });
    },
    handleSubmit() {
        this.operationCamper()
    },
    operationCamper() {
        let data = {
            camperId: this.data.options.camperId,
            orderId: Number(this.data.options.orderId),
            healthCondition: this.data.base.healthCondition,
            dieteticContraindication: this.data.base.dieteticContraindication,
            allergy: this.data.base.allergy,
            history: this.data.base.history,
            vaccine: this.data.base.vaccine
        }
        if (data.healthCondition && data.healthCondition && data.healthCondition) {
            app.wxRequest('POST', app.globalData.URL + "/camper/notice", data, (res) => {
                if (res.data.status == 200) {
                    wx.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 1500
                    })
                    setTimeout(() => {
                        wx.navigateTo({
                            url: `../orderList/index`
                        })
                    }, 1500)
                }
            }, true)
        }
    },
    //查看详情
    getCamperDetail() {
        let item = this.data.options
        let url = `orderId=${item.orderId}&camperId=${item.camperId}&projectCode=${item.attributeValue}`
        app.wxRequest('GET', app.globalData.URL + `/order/camper/detail?${url}`, {}, (res) => {
            if (res.statusCode == 200) {
                console.log(res)
                this.data.dataList = res.data.data
            }
        }, true)
    }
})