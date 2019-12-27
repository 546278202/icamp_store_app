const app = getApp()
Page({
    data: {
        show: false,
        languageGradeShow: false,
        base: {
            language: 0,
            languageGrade: 0
        },
        // 语言(母语) 选单配置 0 = 中文 1 = 英语 2 = 日语 3 = 法语...
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
        }
        this.getCamperDetail()
    },
    onChangeHeight(event) {
        let _base = this.data.base
        _base.heigh = event.detail
        this.setData({
            base: _base
        })
    },
    onChangeWeigth(event) {
        let _base = this.data.base
        _base.weigth = event.detail
        this.setData({
            base: _base
        })
    },
    onChangeSchool(event) {
        let _base = this.data.base
        _base.school = event.detail
        this.setData({
            base: _base
        })
    },
    onChangeRemark(event) {
        let _base = this.data.base
        _base.remark = event.detail
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
        console.log(index)
        let _base = this.data.base
        _base.language = index
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
        _base.languageGrade = index
        console.log(_base.languageGrade)
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
        if (this.data.base.heigh) {
            app.wxRequest('POST', app.globalData.URL + "/camper/detail", this.data.base, (res) => {
                if (res.statusCode == 200) {
                    wx.redirectTo({
                        url: `../addCamper_notice/index?detail=${encodeURIComponent(JSON.stringify(this.data.options))}`
                    })
                }
            }, true)
        }
    },
    //查看详情
    getCamperDetail() {
        let item = this.data.options
        let url = `orderId=${item.orderId}&camperId=${item.camperId}&projectCode=${item.orderGoodsAttributes[0].attributeValue}`
        app.wxRequest('GET', app.globalData.URL + `/order/camper/detail?${url}`, {}, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    if (res.data.data) {
                        // 编辑
                        let _base = {
                            // camperId: res.data.data.camperId,
                            imgId: res.data.data.imgId,
                            heigh: res.data.data.heigh,
                            weigth: res.data.data.weigth,
                            language: res.data.data.language,
                            languageGrade: res.data.data.languageGrade,
                            school: res.data.data.school,
                            remark: res.data.data.remark,
                            id: res.data.data.id
                        }
                        this.setData({ base: _base })
                    } else {
                        // 新增
                        let _base = {
                            camperId: this.data.options.camperId,
                            orderId: Number(this.data.options.orderId),
                            language: 0,
                            languageGrade: 0
                        }
                        this.setData({ base: _base })
                    }
                }
            }
        }, true)
    }
})