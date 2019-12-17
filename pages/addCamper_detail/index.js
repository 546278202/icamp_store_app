const app = getApp()
Page({
    data: {
        show: false,
        languageGradeShow: false,
        base: {
            languageType: 0,
            language: "中文",
            languageGrade: "一般",
            languageGradeType: 0
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
        console.log(this.data.options)
        let data = {
                camperId: this.data.options.camperId,
                attributeValueId: this.data.options.orderGoodsAttributes[0].attributeValueId,
                heigh: this.data.base.heigh,
                weigth: this.data.base.weigth,
                language: this.data.base.languageType,
                languageGrade: this.data.base.languageGradeType,
                scholl: this.data.base.school,
                remark: this.data.base.remark
            }
            // 编辑
        if (this.data.base.id) {
            data.id = this.data.base.id
        } else {
            data.orderId = Number(this.data.options.orderId)
        }

        console.log(data)
        if (data.camperId && data.attributeValueId && data.heigh) {
            app.wxRequest('POST', app.globalData.URL + "/camper/detail", data, (res) => {

                if (res.statusCode == 200) {
                    wx.navigateTo({
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
            console.log(res)
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    wx.navigateTo({
                        url: `../addCamper_notice/index?detail=${encodeURIComponent(JSON.stringify(this.data.options))}`
                    })
                }
            }
        }, true)
    }
})