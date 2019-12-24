var util = require('../../utils/md5.js')
const app = getApp()
Page({
    data: {
        list: null,
        severList: [],
        options: null
    },
    onLoad: function(options) {
        this.setData({
            options: JSON.parse(decodeURIComponent(options.detail)),
        });
        console.log(this.data.options)
        this.getDetail()
    },
    //根据订单号，营员id、项目编号查询详细信息
    getCamperDetail(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.list[index]
            // console.log(item)
            //     let data = {
            //         camperId: item.camperId,
            //         orderId: item.orderId,
            //         attributeValue: item.orderGoodsAttributes[0].attributeValue
            //     }
        console.log(item)

        wx.redirectTo({
            url: `../addCamper_detail/index?detail=${encodeURIComponent(JSON.stringify(item))}`
        })
    },
    getDetail() {
        let data = {}
        app.wxRequest('GET', app.globalData.URL + `/order/${this.data.options.orderId}`, data, (res) => {
            this.setData({
                list: res.data.data.orderGoods,
            });
            this.getSeverList()
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
    // 筛选服务属性
    getSeverList() {
        // let arr = this.data.list.orderGoodsAttributes
        // this.data.list.forEach(element => {
        //     console.log()
        // });
        // let _arr = []
        // for (var i = 0; i < arr.length; i++) {
        //     if (arr[i].type !== 1) {
        //         _arr.push(arr[i])
        //     }
        // }
        // this.setData({
        //     severList: _arr,
        // });
    },
    //发起支付
    orderPay() {
        console.log(this.data.list)
        let paramer = {
            desc: this.data.list[0].goodsAttr,
            orderId: this.data.list[0].orderId,
            type: 1,
            amount: this.data.options.payableAmount,
        }
        app.wxRequest('POST', app.globalData.URL + `/order/pay`, paramer, (res) => {
            if (res.statusCode == 200) {
                let data = res.data
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success(res) {
                        console.log(res)
                        wx.showToast({
                            title: '操作成功',
                            icon: 'success',
                            duration: 1500
                        })
                        setTimeout(() => {
                            wx.navigateTo({
                                url: `../paysuccess/index`
                            })
                        }, 1500)
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            }
        })
    }
})