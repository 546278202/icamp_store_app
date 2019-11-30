App({
    globalData: {
        // BASE_URL: 'http://172.16.10.24:8089', //商品全局 URL
        BASE_URL: 'http://172.16.10.24:8090', //商品全局 URL

        BASE_URL: 'https://t8090.i-camp.com.cn', //商品全局 URL
        URL: 'https://t8091.i-camp.com.cn', //app设置全局 URL
        domainName: "https://test.i-camp.com.cn",
        // domainName: "https://p.i-camp.com.cn",
        // URL: "http://172.16.10.24:8091", //设置全局 URL
        appid: 'wx7ff613d5d2eb8218', //appid需自己提供，此处的appid我随机编写
        secret: '37a58ab663fcf6117d080c2dfa735692', //secret需自己提供，此处的secret我随机编写
        openid: '',
        userInfo: {}
    },
    // loading配置，请求次数统计
    startLoading() {
        wx.showLoading({
            title: '加载中...',
        })
    },
    endLoading() {
        wx.hideLoading();
    },
    // 声明一个对象用于存储请求个数
    needLoadingRequestCount: 0,
    showFullScreenLoading() {
        if (this.needLoadingRequestCount === 0) {

            this.startLoading();
        }
        this.needLoadingRequestCount++;
    },
    tryHideFullScreenLoading() {
        if (this.needLoadingRequestCount <= 0) return;
        this.needLoadingRequestCount--;
        if (this.needLoadingRequestCount === 0) {
            this.endLoading();
        }
    },
    /**
     * 封装wx.request请求
     * method： 请求方式
     * url: 请求地址
     * data： 要传递的参数
     * callback： 请求成功回调函数
     * errFun： 请求失败回调函数
     **/

    wxRequest(method, url, data, callback, loading, errFun, ) {
        if (loading) {
            this.showFullScreenLoading();
        }
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                'cookie': wx.getStorageSync("sessionid"), //读取cookie
            },
            dataType: 'json',
            success: (res) => {
                this.tryHideFullScreenLoading();
                if (res.statusCode == 400) {
                    console.log(res)
                    wx.showLoading({
                        title: "参数错误",
                        duration: 2000
                    })
                }
                if (res.statusCode == 401) {
                    wx.navigateTo({
                        url: '../tologin/index',
                    })
                }
                if (res.statusCode == 500) {
                    wx.showLoading({
                        title: '操作失败',
                        duration: 2000
                    })
                }
                callback(res);
            },
            fail: (err) => {
                errFun(err);
                this.tryHideFullScreenLoading();
                wx.showLoading({
                    title: '操作失败',
                    duration: 2000
                })
            }
        })
    },
    //登陆||注册
    userLogin(type) {
        let data = {}
        if (type == 1) {
            data = {
                phone: this.globalData.phone,
                code: this.globalData.sms,
                from: 1
            }
        } else {
            data = {
                openId: this.globalData.openid,
                from: 0
            };
        }
        this.wxRequest('POST', this.globalData.URL + '/user/login', data, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    wx.setStorageSync("sessionid", res.header["Set-Cookie"])
                    wx.setStorageSync("userInfo", res.data.data)
                    this.globalData.userInfo = res.data.data
                    wx.reLaunch({ url: '../tab1/index' })
                }
            }
        }, true)
    },
    onLaunch: function() {
        // 页面出现在前台时执行
        var that = this
            // wx.checkSession({　
            //     success: function(res) {　　　　　　},
            //     fail: function(res) {　
            //         wx.navigateTo({
            //             url: '../tologin/index',
            //         })
            //     }
            // })
    },
})