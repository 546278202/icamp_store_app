function fileUpload(url, imgdata) {
    return new Promise(function(resolve, reject) {
        wx.showLoading({ title: '加载中...', mask: true })
        wx.uploadFile({
            url: url,
            filePath: imgdata,
            name: 'imgs',
            async: false,
            success: (res) => {
                if (res.statusCode == 200) {
                    resolve(res);
                    // wx.showToast({
                    //     title: '上传成功',
                    //     icon: 'success',
                    //     duration: 2000
                    // })
                }
            },
            fail: function(res) {
                reject(res);
            },
            complete: function(res) {
                wx.hideLoading();
            }
        })
    })
}
//图片预览	
function previewImage(e) {
    console.log(e)
    var _name = e.currentTarget.dataset.name
    var _arr = this.data.arr[e.currentTarget.dataset.key];
    var _target = _arr[_name]
    console.log(_target)
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: _target // 需要预览的图片http链接列表
    });
}
module.exports = {
    previewImage: previewImage,
    fileUpload: fileUpload

}