const app = getApp()

Page({
    data: {
        dataList: null,
        camperId: null
    },
    onLoad: function(options) {
        this.setData({ camperId: options.camperId });
        this.getList()
    },
    getList() {
        let url = app.globalData.URL + `/user/camp?camperId=${this.data.camperId}`
        let data = {};
        app.wxRequest('GET', url, data, (res) => {
            this.setData({ dataList: res.data.data });
        }, true)
    }
})