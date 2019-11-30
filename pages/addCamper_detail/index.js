const app = getApp()
Page({
    data: {
        disabled: false,
        show: false,
        list: [],
        base: {},
        // 语言(母语) 选单配置 0 = 中文 1 = 英语 2 = 日语 3 = 法语...
        objectArray: [{
                id: 0,
                name: '中文'
            },
            {
                id: 1,
                name: '英语'
            },
            {
                id: 2,
                name: '日语'
            },
            {
                id: 3,
                name: '法语'
            }
        ]
    },
    onLoad(options) {
        if (options.title) {
            wx.setNavigationBarTitle({
                title: options.title
            })
        }
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
        _base.heigh = event.detail
        this.setData({
            base: _base
        })
    },
    handleShowPopup() {
        this.setData({
            show: true,
        });
    },
    bindPickerChange: function(e) {
        console.log(e.detail.value)

        // this.setData({
        //     index: e.detail.value
        // })
        // let _base = this.data.base
        // _base.sex = this.data.objectArray[e.detail.value].id
        // this.setData({
        //     base: _base
        // })
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
        console.log(this.data.base)
        let data = {
            camperId: 3,
            orderId: 1119103165536543,
            imgId: 23,
            heigh: 110,
            weigth: 40.6,
            language: 0,
            languageGrade: 2,
            scholl: "海文国际学校",
            remark: "希望有一个愉快的夏令营"
        }
        console.log(data)
            // if (data.camperName && data.camperNameEn) {
            //     app.wxRequest('POST', url, data, (res) => {
            //         let camperId = res.data.data.camperId
            //         if (camperId) {
            //             this.operationInformation(camperId)
            //         }
            //     }, true)
            // }
    }

})