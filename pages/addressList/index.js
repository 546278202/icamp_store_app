const app = getApp()
import Dialog from '../../dist/dialog/dialog';
Page({
    data: {
        dataList: null,
    },

    onLoad: function() {
        this.getList()
    },

    getList() {
        let url = app.globalData.URL + `/address?type=0`
        app.wxRequest('GET', url, {}, (res) => {
            console.log(res)
            this.setData({
                dataList: res.data.data
            })
        }, true)
    },
    // 删除
    delList(index) {
        let url = app.globalData.URL + `/address/${index}`
        app.wxRequest('DELETE', url, {}, (res) => {
            console.log(res)
            wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
            })
            this.getList()
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

    // 加载更多
    onReachBottom: function() {
        console.log('加载更多')
        setTimeout(() => {
            this.setData({
                isHideLoadMore: true,
            })
        }, 1000)
    },

    onClose(event) {
        let index = event.currentTarget.dataset.index
        wx.showModal({
            title: '提示',
            content: '您确定删除当前数据么？',
            success: (res) => {
                if (res.confirm) {
                    console.log('用户点击确定')
                    this.delList(index)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //编辑人员
    editCamper(e) {
        let index = e.currentTarget.dataset.index
        let item = this.data.dataList[index]
        let str = JSON.stringify(item)
        wx.navigateTo({
            url: `../newAddress/index?detail=${encodeURIComponent(str)}`
        })
    }
})