$(function () {
    //a.添加layui的自定义校验规则-----
    layui.form.verify({
        repwd: function (confirmpwd) {
            //a.获取新密码
            var newpwdStr = $('[name=newPwd]').val().trim();
            //b.比较两次新密码是否一致
            if (newpwdStr != confirmpwd) {
                return "两次密码输入不一致"
            }

        }
    });

    //表单提交事件
    //a.触发 layui的表单验证机制
    //  如果验证机制有返回错误消息，则阻断 b的执行
    //如果验证机制没有返回任何错误消息， 则继续执行b
    //b.执行 程序员注册的 事件方法代码 进行ajax提交
    $('#formChangePwd').on('submit', function (e) {
        e.preventDefault();
        changePwd();
    })


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