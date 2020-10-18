$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();

    // 点击 退出 按钮，实现退出功能
    $('#logoutBtn').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('亲，你确定要离开吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //如果确认退出 则
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})

//1.异步获取用户完整信息 的方法-------------
function getUserInfo() {
    //a.获取 token
    var token = localStorage.getItem('token');
    //b.发送异步请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //在 baseAPI 里设置公共判断条件
        /*   headers: {
              Authorization: token
          }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //如果加载信息成功，则调用renderAvatar 渲染用户信息
            renderUserinfo(res.data);
        }
    });

    //var xhr =new XMLHttpRequest();
    //xhr.setRequestHeader('key','value')
}

//2.渲染用户信息 的方法-----------------
function renderUserinfo(userinfo) {
    // a. 获取用户的名称
    var name = userinfo.nickname || userinfo.username
    // b. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // c. 按需显示用户的头像
    if (userinfo.user_pic !== null) {
        // c.1 显示图片头像
        $('.layui-nav-img')
            .attr('src', userinfo.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // c.2 显示文本头像
        $('.layui-nav-img').hide()
        //提取名字的首字符，并转成大写
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}