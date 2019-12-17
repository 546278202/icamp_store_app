const app = getApp()
const watch = require('../../utils/watch.js');

import Toast from '../../dist/toast/toast';
Page({
    data: {
        goodsId: null,
        detailData: null,
        checked: true,
        price: 0,
        show: false,
        camperList: [],
        campersName: ["请选择"],
        active: 0,
        current: 1,
        result: [],
        severPrice: 0,
        severAttributes: [],
        campDataAttributes: [],
        termsService: [
            { name: '我已阅读条款一', url: '../readClause/index', file: 'https://tstore.i-camp.com.cn/images/201912151639850754965.docx', checked: false },
            { name: '我已阅读条款二', url: '../readClause2/index', checked: false, file: 'https://tstore.i-camp.com.cn/images/201912151708994415801.docx' }
        ],
        allAmount: null

    },
    onLoad: function(options) {
        this.setData({
            goodsId: options.id
        })
        this.getDetail()
        this.getList()
        watch.setWatcher(this);
    },
    getList() {
        let url = app.globalData.URL + "/camper?type=1"
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            let list = res.data.data
            let camperList = []
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (i == 0) {
                        list[i]["isChecked"] = true
                        camperList.push(list[i])
                    } else {
                        list[i]["isChecked"] = false
                    }
                }
                this.setData({
                    camperList: camperList,
                    campersName: [camperList[0].camperName],
                    allAmount: (this.data.price + this.data.severPrice) * this.data.campersName.length

                })
            }
        }, true)
    },
    watch: {
        campersName(newVal, oldVal) {
            console.log(newVal, oldVal);
            if (newVal != oldVal) {
                this.getPrice()
            }
        }
    },
    tabToggle(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            active: index,
        })
        this.getPrice()
    },
    getSeverPrice() {
        var num = 0
        var arr = this.data.severAttributes
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].values.length; j++) {
                if (arr[i].values[j].checked) {
                    num += arr[i].values[j].sellPrice
                }
            }
        }
        this.setData({
            severPrice: num,
        })
    },
    //获取所有勾选的属性值
    getAttributeValues() {
        var arr = this.data.severAttributes
        var _arr = []
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].values.length; j++) {
                if (arr[i].values[j].checked) {
                    _arr.push({ attributeValueId: arr[i].values[j].attributeValueId })
                }
            }
        }
        var item = this.data.campDataAttributes[0].values[this.data.active]
        _arr.push({ attributeValueId: item.attributeValueId })
        return _arr
    },
    getPrice() {
        let item = this.data.detailData.goodsAttributes[0].values[this.data.active]
        this.setData({
            // price: item.sellPrice 
            price: (item.sellPrice + this.data.detailData.sellPrice)

        })
        console.log(this.data.price)
        console.log()
    },
    getCmpersName() {
        var arr = []
        this.data.camperList.forEach(element => {
            if (element.isChecked) {
                arr.push(element.camperName)
            }
        });
        this.setData({
            campersName: arr,
        });
        this.getPrice()
    },
    getCmpersIds() {
        var arr = []
        if (this.data.camperList) {
            this.data.camperList.forEach(element => {
                if (element.isChecked) {
                    arr.push(element.camperId)
                }
            });
            return arr.toString()
        }
    },
    getTermsServiceIds() {
        var arr = []
        this.data.termsService.forEach(element => {
            if (element.checked) {
                arr.push(element.name)
            }
        });
        if (arr.length == this.data.termsService.length) {
            return true
        } else {
            return false
        }
    },

    onChange(event) {
        let row = event.currentTarget.dataset.row
        let index = event.currentTarget.dataset.index
        var detailData = this.data.detailData
        if (detailData.goodsAttributes[row].values[index]["checked"]) {
            detailData.goodsAttributes[row].values[index]["checked"] = false
        } else {
            detailData.goodsAttributes[row].values[index]["checked"] = true
        }
        this.setData({
            detailData: detailData
        })

        this.getSeverPrice()
    },

    severChange(event) {
        let index = event.currentTarget.dataset.index
        var termsService = this.data.termsService
        if (termsService[index]["checked"]) {
            termsService[index]["checked"] = false
        } else {
            termsService[index]["checked"] = true
        }
        this.setData({
            termsService: termsService
        })
    },

    getDetail() {
        let data = {}
        app.wxRequest('GET', app.globalData.BASE_URL + `/goods/${this.data.goodsId}`, data, (res) => {
            let list = res.data.data.goodsAttributes
            var _arr = []
            var arr = []

            for (var i = 0; i < list.length; i++) {
                if (list[i].type != 1) {
                    _arr.push(list[i])
                } else {
                    arr.push(list[i])
                }
            }

            this.setData({
                detailData: res.data.data,
                severAttributes: _arr,
                campDataAttributes: arr,
            })

            app.globalData["detailData"] = this.data.detailData
        }, true)
    },

    submitData(event) {
        this.setTlement()
    },

    //结算
    setTlement() {
        if (!this.getCmpersIds()) {
            Toast('请选择营员~');
            return false
        }
        if (!this.getTermsServiceIds()) {
            Toast('请阅读服务条款~');
            return false
        }
        app.globalData["createOrder"] = this.data

        let paramer = {
            settleModels: [{
                goodsId: this.data.goodsId,
                attributeValues: this.getAttributeValues(),
                camperId: this.getCmpersIds()
            }],
            froms: 0,
            orderType: 1
        }
        app.globalData["paramer"] = paramer
        console.log(paramer)
        app.wxRequest('POST', app.globalData.URL + "/order/settlement", paramer, (res) => {
            console.log(res)
            if (res.data.status == 200) {
                app.globalData["createOrderList"] = res.data.data
                wx.navigateTo({
                    url: '../createOrder2/index',
                })
            }
        }, true)
    },

    getReadMe(event) {
        let index = event.currentTarget.dataset.index
        let url = this.data.termsService[index].file
        wx.downloadFile({
            url: url,
            success: function(res) {
                var filePath = res.tempFilePath
                wx.openDocument({
                    filePath: filePath,
                    fileType: "docx",
                    success: function(res) {
                        console.log('打开文档成功')
                        console.log(res)
                    },
                    fail: function(res) {
                        console.log('fail')
                        console.log(res)
                    },
                    complete: function(res) {
                        console.log('complete')
                        console.log(res)
                    }
                })
            },
            fail: function(res) {
                console.log('fail')
                console.log(res)
            },
            complete: function(res) {
                console.log('complete')
                console.log(res)
            }
        })
    }
})