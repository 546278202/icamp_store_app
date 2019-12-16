const app = getApp()
Page({
    data: {
        show: true
    },
    onLoad(options) {
        wx.downloadFile({
            url: "https://tstore.i-camp.com.cn/images/201912151639850754965.docx",
            // url: 'https://cynthianc.github.io/images/123.pdf',
            success: function(res) {
                var filePath = res.tempFilePath
                debugger
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
    },
    getDetail(id) {
        console.log(getCheckSession())
    },
    // 刷新
    onPullDownRefresh() {
        wx.showNavigationBarLoading();
        setTimeout(() => {
            wx.stopPullDownRefresh()
            wx.hideNavigationBarLoading();
        }, 1000)
    },
    // 加载更多
    onReachBottom: function() {
        console.log('加载更多')
    },
})