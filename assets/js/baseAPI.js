//1.为 jq 的异步请求 新增一个回调函数，每次jq异步请求之前，都会执行以下这个
$.ajaxPrefilter(function (opt) {
    //1.原本 opt.url = 请求方式里的ur，现需拼接url地址 基地址+接口---------------------
    opt.url = 'http://ajax.frontend.itheima.net' + opt.url

    //2.自动追加 token 到请求报文-------------------------
    //统一为有权限的接口，设置 headers 请求头
    if (opt.url.indexOf('/my/') !== -1) {
        opt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }


    //3.统一处理 服务端返回的未登录错误 ------------------
    opt.complete = function (res) {
        if (res.responseJSON.status === 1) {
            //a.提示用户没有权限
            alert('对不起，您的登录已经失效，请重新登录');
            //b.删除 localStorage中 可能存在的伪造的token
            localStorage.removeItem('token');
            //c.页面跳转到 login.html
            location.href = '/login.html'
        }
    }
})