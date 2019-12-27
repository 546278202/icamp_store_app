var app = getApp()
Page({
    data: {
        code: null
    },
    onLoad() {

    },
    // 授权登陆
    bindgetphonenumber(e) {
        wx.login({
            success: (res) => {
                console.log(res)
                this.setData({ code: res.code })
                let wxInfo = {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                }
                let paramer = {
                    from: 0,
                    code: this.data.code,
                    wxInfo: wxInfo //手机号密文，非必填
                }
                app.userLogin(paramer)
            }
        })
    }
})