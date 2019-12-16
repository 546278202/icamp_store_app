const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


// 选择图片
function chooseImage(e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            console.log(res)
            var Arr = that.data.arr;
            var _arr = that.data.arr[e.currentTarget.dataset.key];
            var _name = e.currentTarget.dataset.name;
            var newarr = _arr[_name].concat(res.tempFilePaths);
            //选择一张图片的情况
            if (_name == "files1" || _name == "files2") {
                newarr = _arr[_name].concat(res.tempFilePaths[0])
            }
            _arr[_name] = newarr
            Arr[e.currentTarget.dataset.key] = _arr;
            that.setData({
                arr: Arr
            });
        }
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
    formatTime: formatTime,
    chooseImage: chooseImage,
    previewImage: previewImage
}