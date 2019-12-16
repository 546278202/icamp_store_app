const app = getApp()
Page({
    data: {
        projectId: null,
        camperId: null,
        title: null,
        dataList: []
    },
    onLoad: function(options) {
        this.setData({
            projectId: options.projectId,
            camperId: options.camperId,
            title: options.title
        })
        this.getList()
    },
    previewImg: function(e) {
        let imgArr = []
        var objkeys = Object.keys(this.data.dataList);
        for (var i = 0; i <= objkeys.length - 1; i++) {
            imgArr.push(this.data.dataList[i].pictureUrl);
        }
        var index = e.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.dataList[index].pictureUrl, //当前图片地址
            urls: imgArr, //所有要预览的图片的地址集合 数组形式
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },

    getList() {
        let url = app.globalData.domainName + "/api/synchro/getPictures?projectNum=BJ-20191116-112&camperId=123"
        app.wxRequest('GET', url, {}, (res) => {
            this.setData({
                dataList: res.data.data
            })
            console.log(this.data.dataList)
        }, true)
    }
})