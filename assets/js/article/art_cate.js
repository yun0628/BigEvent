//打开新增窗口的ID
var addWindowId = null;
$(function () {
  //a.获取 文章分类的列表数据
  getArtCateList();

  //b.为添加类别按钮绑定点击事件
  $('#btnShowCate').on('click', function () {
    addWindowId = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#addPanel').html()
    })
  })

  // c.为新增表单添加提交事件   通过代理的形式，为 formAddPanel 表单绑定 submit 事件
  $('body').on('submit', '#formAddPanel', function (e) {
    e.preventDefault();
    addArtCate();
  })


  //d.为动态生成的数据行里的 修改按钮 代理点击事件
  $('.layui-table tbody').on('click', '.btn-edit', function (e) {
    //1.获取当前行中 数据：  id，分类名，分类别名
    var cateId = this.dataset.id //id
    var cateName = $(this).parent().prev('td').prev('td').text().trim(); //分类名
    var cateAlias = $(this).parent().prev('td').text().trim(); //别名
    var oldData = {
      Id: cateId,
      name: cateName,
      alias: cateAlias
    }
    //2.显示 编辑面板，同时显示数据
    showEditPanel(oldData);

    //3.为编辑面板的表单 绑定提交事件
    $('body').on('submit', '#formEditPanel', function (e) {
      e.preventDefault(); //阻断表单提交 防止页面刷新
      //调用修改表单方法
      editArtCate();
    })
  })


  //e.为动态生成的数据行里的 删除按钮 代理点击事件
  $('.layui-table tbody').on('click', '.btn-del', function (e) {
    delArtCate(this.dataset.did);
  })



})

// 1.获取 文章分类的列表数据  方法------
function getArtCateList() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success(res) {
      //判断是否获取成功
      if (res.status === 0) {
        var strHtml = template('tpl-row', res.data);
        $('.layui-table tbody').html(strHtml)
      }
    }
  })
}

//2.新增分类 方法------------
function addArtCate() {
  $.ajax({
    method: 'POST',
    url: '/my/article/addcates',
    data: $('#formAddPanel').serialize(),
    success(res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      }
      //如果新增成功，则刷新列表，并关闭窗口
      //重新请求并渲染列表数据
      getArtCateList();
      //关闭当前窗口
      layui.layer.close(addWindowId);
    }
  })
}

//3.显示编辑窗口 方法---------------
function showEditPanel(oldData) {
  //打开面板，并保存面板id
  addWindowId = layui.layer.open({
    type: 1,
    area: ['500px', '250px'],
    title: '修改文章分类',
    content: $('#editPanel').html()
  });
  //调用layui的方法 来填充表单
  layui.form.val('formEdit', oldData);
}

//4.修改分类 方法----------------
function editArtCate() {
  //a.获取表单---Id=123&name=1&alias=1
  var dataStr = $('#formEditPanel').serialize();
  //b.异步提交
  $.ajax({
    url: '/my/article/updatecate',
    method: 'POST',
    data: dataStr,
    success(res) {
      layui.layer.msg(res.message);
      if (res.status === 0) {
        //a.刷新分类列表
        getArtCateList();
        //b.关闭当前编辑窗口
        layui.layer.close(addWindowId);
      }
    }
  })
}

//5.删除分类 方法------------------
function delArtCate(cateId) {
  layui.layer.confirm('亲，你真的要删了我吗？', {
    icon: 3,
    title: '提示'
  }, function (index) {
    //a.异步请求 分类删除 接口
    $.ajax({
      url: '/my/article/deletecate/' + cateId, // http..../deletecate/1
      method: 'GET',
      success(res) {
        layui.layer.msg(res.message);
        if (res.status === 0) {
          //重新加载列表数据
          getArtCateList();
        }
      }
    });
    //关闭 消息窗
    layer.close(index);
  });
}