var app = getApp()
Page({
    data: {

    },
    onLoad() {

    },
    // 授权登陆
    bindGetUserInfo(e) {
        console.log(e)
        if (e.detail.userInfo) {
            wx.setStorage({
                key: 'userInfo',
                data: e.detail.userInfo
            })
            app.globalData.userInfo = e.detail.userInfo
            wx.login({
                success: (res) => {
                    if (res.code) {
                        var d = app.globalData;
                        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
                        app.wxRequest('GET', url, {}, (res) => {
                            app.globalData.openid = res.data.openid
                            app.userLogin(0)
                        }, true)
                    }
                }
            });
        }
    }
})