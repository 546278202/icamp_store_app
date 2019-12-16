import Toast from '../../dist/toast/toast';
var app = getApp()
Page({
    data: {
        phone: null,
        sms: null,
        sendMsgDisabled: true,
        time: 120,
    },
    onLoad() {

    },
    //手机号校验
    getCheckPhone(e) {
        if (!(/^[0-9]\d{6,15}$/.test(e))) {
            Toast('请输入正确手机号~');
            return false
        } else {
            return true
        }
    },
    //获取验证号
    getCode(e) {
        if (this.getCheckPhone(this.data.phone)) {
            app.wxRequest('GET', app.globalData.URL + `/code/${this.data.phone}`, {}, (res) => {
                if (res.data.status == 200) {
                    console.log(res)
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.send()
                } else {
                    wx.showLoading({
                        title: res.data.message,
                        duration: 2000
                    })
                }
            }, true)
        }
    },
    // 倒计时
    send() {
        this.setData({
            sendMsgDisabled: false
        })
        let time = this.data.time;
        let interval = setInterval(() => {
            time--
            this.setData({
                time: time,
            })
            if (this.data.time < 1) {
                clearInterval(interval);
                this.setData({
                    sendMsgDisabled: true,
                    time: this.data.time
                })
                return false
            }
        }, 1000);
    },

    //获取手机号
    getPhone(e) {
        this.setData({
            phone: e.detail,
        })
    },
    //获取验证码
    getSms(e) {
        this.setData({
            sms: e.detail,
        })
    },
    //登陆
    userLogin() {
        console.log(wx.getStorageSync("sessionid"))
        if (this.getCheckPhone(this.data.phone)) {
            if (this.data.sms) {
                let paramer = {
                    phone: this.data.phone,
                    code: this.data.sms,
                    from: 1
                }
                app.userLogin(paramer)
            }
        }
    }
})