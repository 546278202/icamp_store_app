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
            this.getCamperDetail()
        }
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
        console.log(this.data.base)
        if (this.data.base.camperId && this.data.base.healthCondition) {
            app.wxRequest('POST', app.globalData.URL + "/camper/notice", this.data.base, (res) => {
                if (res.data.status == 200) {
                    let _item = res.data.data
                    this.getOrderDetail(_item.orderId)
                }
            }, true)
        }
    },
    getOrderDetail(id) {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/order/${id}`, data, (res) => {
            if (res.data.status == 200) {
                let item = res.data.data
                if (item.orderStatus == 2) {
                    // 跳详情
                    setTimeout(() => {
                        wx.redirectTo({
                            url: `../orderList/index?detail=1`
                        })
                    }, 1000)
                }
                if (item.orderStatus == 5) {
                    // 跳已完成
                    setTimeout(() => {
                        wx.redirectTo({
                            url: `../orderList/index?detail=2`
                        })
                    }, 1000)
                }
                wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        }, true)
    },
    //查看详情
    getCamperDetail() {
        let item = this.data.options
        let url = `orderId=${item.orderId}&camperId=${item.camperId}&projectCode=${item.orderGoodsAttributes[0].attributeValue}`
        app.wxRequest('GET', app.globalData.URL + `/order/camper/notice?${url}`, {}, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    if (res.data.data) {
                        // 编辑
                        let _base = {
                            camperId: res.data.data.camperId,
                            noticeId: res.data.data.noticeId,
                            healthCondition: res.data.data.healthCondition,
                            dieteticContraindication: res.data.data.dieteticContraindication,
                            allergy: res.data.data.allergy,
                            history: res.data.data.history,
                            vaccine: res.data.data.vaccine
                        }
                        this.setData({ base: _base })
                        console.log(res.data.data)
                    } else {
                        // 新增
                        let _base = {
                            camperId: this.data.options.camperId,
                            orderId: Number(this.data.options.orderId)
                        }
                        this.setData({ base: _base })
                    }
                }
            }
        }, true)
    }
})