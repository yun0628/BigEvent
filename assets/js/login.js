//声明全局变量
var $Login_box, $btnReg_box //登录页面的 两个超链接

$(function () {
    $Login_box = $('.login-box');
    $btnReg_box = $('.reg-box');

    //1.dom树准备完毕后 为 取登录 和 去注册 超链接添加点击事件
    $('#link-reg').on('click', function () {
        //隐藏 登录框
        $Login_box.hide();
        //显示 注册框
        $btnReg_box.show();
    });
    $('#link-login').on('click', function () {
        //显示 登录框
        $Login_box.show();
        //隐藏 注册框
        $btnReg_box.hide();
    })

    //--------------------------------------------------

    //通过form.verify()函数自定义校验规则
    layui.form.verify({
        //自定义一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 拿到密码框中的内容
            var pwdStr = $('.reg-box [name=password]').val()
            // 然后进行一次等于的判断
            if (pwdStr !== value) {
                // 如果判断失败,则return一个提示消息即可
                return '两次密码不一致'
            }
        }
    })


    // ----------------------------------------------------
    //注册表单提交的事件
    $('#formReg').on('submit', function (e) {
        //a.取消表单的默认提交行为
        e.preventDefault();
        //b.获取注册信息
        let data = {
            username: $('.reg-box [name=username]').val().trim(),
            password: $('.reg-box [name=password]').val().trim()
        }
        //c.提交数据
        $.post('http://ajax.frontend.itheima.net' + '/api/reguser', data, function (res) {
            if (res.status !== 0) {
                layui.layer.msg(res.message)
            } else {
                layui.layer.msg(res.message, function () {
                    // 模拟 点击 去登录按钮 
                    //进而切换到去登录页面
                    $('#link-login').click();

                    //清空注册表单的内容
                    $('#formReg')[0].reset();
                });
                //将用户名和密码 设置给 登录窗体的输入框
                $('.login-box [name=username]').val(data.username);
                $('.login-box [name=password]').val(data.password);
            }
        });
    });

    // ----------------------------------------------------
    //登陆表单的提交事件
    $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        //a.获取用户名密码数据 urlencoded 格式 （键值对字符串--查询字符串）
        var strData = $(this).serialize();
        //b.提交到登录接口
        $.ajax({
            url: 'http://ajax.frontend.itheima.net' + '/api/login',
            method: 'POST',
            data: strData,
            success: function (res) {
                //c.直接显示 登录结果，并执行回调函数
                layui.layer.msg(res.message, function () {
                    //d.判断是否成功，就跳转
                    if (res.status === 0) {
                        location.href = 'index.html';
                    }
                })

            }
        })
    })
})