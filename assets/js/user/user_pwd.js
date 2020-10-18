$(function () {
    //1.为提交按钮添加点击事件
    $('#btnSubmit').on('click', function () {
        changePwd();
    });
})

//2.修改 用户密码--------------------
function changePwd() {
    //a.通过 jq 获取表单数据（原密码和新密码，因为确认新密码没有加name）
    var strData = $('#formChangePwd').serialize();
    //b.提交到 重置密码 接口
    $.ajax({
        url: '/my/updatepwd',
        method: 'POST',
        data: strData,
        success: function (res) {
            //如果修改不成功，提示消息
            if (res.status !== 0) {
                layui.layer.msg(res.message);
            } else {
                //如果修改成功，则要求重新登陆输入密码
                //a.提示消息
                layui.layer.msg(res.message, function () {
                    //b.删除本地token
                    localStorage.removeItem('token');
                    //c.浏览器跳转到登录页面
                    window.parent.location.href = "/login.html"
                });

            }



        }
    })
}