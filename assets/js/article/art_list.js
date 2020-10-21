//0.入口函数
$(function () {
  //1.1 请求文章列表
  getArtList();
  //1.2 请求文章分类
  getCateData();

  //1.3.为筛选按钮添加点击事件
  $('#btnSearch').on('click', searchList);

  //1.4为每一行的删除按钮 代理绑定 点击事件
  $('.layui-table tbody').on('click', '.btn-del', doDel)
})


//0.筛选按钮的点击事件 方法--------------------
function searchList(e) {
  e.preventDefault();
  //1.获取两个下拉框数据，设置给查询参数对象，queryData
  queryData.cate_id = $('[name=selCate]').val();
  queryData.state = $('[name=selStatus]').val();
  //2.调用已经写好的getArtList请求方法，重新获取文章列表数据
  getArtList();
}

//0. [全局变量] 查询的参数对象
var queryData = {
  pagenum: 1, // 页码值，默认请求第一页的数据
  pagesize: 2, // 每页显示几条数据，默认每页显示2条
  cate_id: '', // 文章分类的 Id
  state: '' // 文章的发布状态
}

// 1.获取文章列表数据的方法---------
function getArtList() {
  $.ajax({
    url: '/my/article/list',
    method: 'get',
    data: queryData,
    success(res) {
      //生成 文章列表
      var strHtml = template('tpl-row', res.data);
      $('.layui-table tbody').html(strHtml);
      // 生成 页码条
      renderPageBar(res.total);
    }
  })
}

//1.1 分页的方法---------
function renderPageBar(total) {
  //调用 laypage.render() 方法来渲染分页结构
  //渲染页码条
  layui.laypage.render({
    elem: 'pageBar', //页码条容器元素的 id
    count: total, //数据库中符合要求的数据总行数
    limit: queryData.pagesize, //每页显示的行数
    curr: queryData.pagenum, //当前页码
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //页码条样式
    limits: [2, 3, 5, 10], //条目选项下拉菜单里的数据

    //触发jump 回调方式:(第二个参数 first)
    //1.点击分页切换时  undefined -> false
    //2.调用layui.laypage.render时  true
    jump: function (obj, first) {

      //切换到最新页码 将当前页码设置给全局参数对象里的页码属性
      queryData.pagenum = obj.curr;

      //将当前选中的页容量设置给全局参数
      queryData.pagesize = obj.limit;

      if (!first) { //不是第一次触发
        //调用查询全局参数对象里的页码属性
        getArtList();
      }
    }

  })

}

//2.定义美化时间的过滤器 -----------------------
template.defaults.imports.dataFormat = function (date) {
  const dt = new Date(date)

  var y = dt.getFullYear()
  var m = padZero(dt.getMonth() + 1)
  var d = padZero(dt.getDate())

  var hh = padZero(dt.getHours())
  var mm = padZero(dt.getMinutes())
  var ss = padZero(dt.getSeconds())

  return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
// 2.1定义补零的函数
function padZero(n) {
  return n > 9 ? n : '0' + n
}

//3. 请求分类下拉框数据------------------------------
function getCateData() {
  $.ajax({
    url: '/my/article/cates',
    method: 'get',
    success(res) {
      if (res.status === 0) {
        //a.生成 下拉框 html 字符串
        var optStr = template('tpl-select-status', res.data)
        $('[name=selCate]').append(optStr);
        //b.重新渲染 layui 的当前页面
        layui.form.render();
      }
    }
  })
}

//4.删除按钮点击事件方法
function doDel(e) {
  //a.从被点击按钮上获取当前数据的id
  var dId = this.dataset.id;
  //删除行之前，获取当前页面删除按钮的个数
  var restRowNum = $('.layui-table tbody tr .btn-del').length;

  //请用户确认是否删除
  layui.layer.confirm('亲，你确认删除吗？嘤嘤嘤', {
    icon: 3,
    title: '提示'
  }, function (index) {

    //b.发送id到删除接口 执行删除操作
    $.ajax({
      method: 'GET',
      url: '/my/article/delete/' + dId,
      success(res) {
        layui.layer.msg(res.message) //b2.如果删除失败，则显示错误消息
        if (res.status == 0) {
          //应对--删除某页最后一行的情况，需要判断是否已经是最后一行了
          if (restRowNum == 1) {
            //将当前页码 -1
            queryData.pagenum = queryData.pagenum == 1 ? 1 : queryData.pagenum - 1;
          }
          //b1.如果删除成功，则重新调用加载列表方法（刷新表格数据）
          getArtList();
        }

      }
    })
    layer.close(index)
  })
}