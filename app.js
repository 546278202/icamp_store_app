App({
    globalData: {
        BASE_URL: 'https://t8090.i-camp.com.cn', //商品全局 URL
        URL: 'https://t8091.i-camp.com.cn', //app设置全局 URL

        // BASE_URL: 'http://172.16.10.24:8090',
        // URL: "http://172.16.10.24:8091",

        domainName: "https://test.i-camp.com.cn",
        // domainName: "https://p.i-camp.com.cn",
        userInfo: {},
        appid: "wx7ff613d5d2eb8218"
    },
    // loading配置，请求次数统计
    startLoading() {
        wx.showLoading({
            mask: true,
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
                'Content-Type': 'application/json',
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
                // if (res.statusCode == 404) {
                //     wx.showLoading({
                //         title: '操作失败',
                //         duration: 2000
                //     })
                // }
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
    userLogin(paramer) {
        this.wxRequest('POST', this.globalData.URL + '/user/login', paramer, (res) => {
            if (res.statusCode == 200) {
                if (res.data.status == 200) {
                    wx.setStorageSync("sessionid", res.header["Set-Cookie"])
                    wx.setStorageSync("userInfo", res.data.data)
                    wx.reLaunch({ url: '../tab1/index' })
                }
            }
        }, true)
    },
    // 微信授权更新用户信息
    getUserInfo() {
        wx.getUserInfo({
            success: (res) => {
                console.log(res)
                let data = {
                        encryptedData: res,
                        iv: res,
                        type: 1 //type 0=基本数据 1=手机号
                    }
                    // this.wxRequest('PUT', this.globalData.URL + "/user/info", data, (res) => {
                    //     if (res.statusCode == 200) {
                    //         this.globalData.userInfo = res.data.data
                    //     }
                    // }, true)
            }
        })
    },

    onLaunch: function() {
        /* 已授权之后，自动获取用户信息 */
        // 判断是否授权
        // wx.getSetting({
        //     success: (res) => { //箭头函数为了处理this的指向问题	
        //         if (res.authSetting["scope.userInfo"]) {
        //             console.log("已授权");
        //             // 获取用户信息
        //             wx.getUserInfo({
        //                 success: (res) => { //箭头函数为了处理this的指向问题
        //                     this.globalData.isok = true
        //                     var that = this
        //                     console.log(res.userInfo); //用户信息结果
        //                     wx.getStorage({
        //                         key: 'unionid',
        //                         success(res) {
        //                             that.globalData.unionid = res.data
        //                         }
        //                     })
        //                     this.globalData.userInfo = res.userInfo;
        //                     if (this.userInfoReadyCallback) { //当index.js获取到了globalData就不需要回调函数了，所以回调函数需要做做一个判断，如果app.js中有和这个回调函数，那么就对这个函数进行调用，并将请求到的结果传到index.js中
        //                         this.userInfoReadyCallback(res.userInfo);
        //                     }
        //                 }
        //             })
        //         } else {
        //             console.log("未授权");
        //             wx.removeStorage({
        //                 key: 'unionid'
        //             })
        //         }
        //     }
        // })

        // 页面出现在前台时执行
        var that = this
        wx.checkSession({　
            success: function(res) {
                console.log(res)
            },
            fail: function(res) {　
                console.log(res)


            }
        })
    },
})