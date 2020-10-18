$(function () {
    //a.添加自定义校验规则：昵称长度
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1 ~ 6位之间"
            }
        }
    })

    //b.获取用户的基本信息
    getUserInfo();

    //c.重置功能
    $('#btnReset').on('click', function () {
        getUserInfo();
    })

    //d.提交修改功能
    $('#btnSubmit').on('click', function () {
        modifyUserInfo();
    })
})

//1.获取用户的基本信息---------------
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            console.log(res);
            //为表单赋值
            layui.form.val('formUserInfo', res.data)
        }
    })
}

//2.提交修改的用户信息---------------------
function modifyUserInfo() {
    //a.获取表单的数据 username=james&id777....
    var dataStr = $('#formModify').serialize();
    //b.异步提交到服务器 修改数据的 接口
    $.ajax({
        url: '/my/userinfo',
        method: 'POST',
        data: dataStr,
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('修改用户信息失败！');
            }
            layui.layer.msg(res.message);
            //调用父页面中的方法，重新渲染用户的头像和用户的信息
            window.parent.getUserInfo();
        }
    })
}