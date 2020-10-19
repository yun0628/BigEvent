$(function () {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //------------------------------------------
    //为上传按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        $('#file').click();

    })

    //为文件选择框绑定事件
    //触发时机：
    //a.文件选择框 选的文件发生改变时
    //b.有选中的文件到没选中文件（取消）也会触发
    $('#file').on('change', function (e) {
        var list = e.target.files;
        console.log(list);
        if (list.length == 0) {
            return layui.layer.msg('请选择要上传的图片')
        }
        //如果选中肋片，则设置给图片剪裁区域
        //a.获取选中的文件图片
        var file = e.target.files[0];
        //b.为文件图片 创建虚拟路径
        var newImgURL = URL.createObjectURL(file);
        console.log(newImgURL);
        //c.设置裁剪区
        $image.cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })


    //-------------------------
    //确定上传图片
    $('#btnOk').on('click', function () {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2. 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        })
    })
})