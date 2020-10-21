var $image = null;
var options;
//保存 当前文章的发布状态的变量
var pubState = '草稿';

$(function () {
  //0.初始化富文本编辑器---------------------------
  initRichText();

  //1.调用获取分类下拉框方法-----------------------
  makeSelect();

  //2.为选择封面按钮绑定事件------------------------
  $('#btnChoose').on('click', function (e) {
    //模拟文件选择框被点击
    $('#fileCover').click();
  });

  //3.为文件选择框 添加 change 事件-------------------
  $('#fileCover').on('change', changeFile);

  //4.为表单添加 onsubmit 事件----------------------
  $('#formAdd').on('submit', submitData);

  //5.为 两个提交按钮添加点击事件，用来修改发布状态
  //5.1发布按钮
  $('#btnFB').on('click', function (e) {
    pubState = '已发布';
  })
  //5.2存草稿按钮
  $('#btnFCG').on('click', function (e) {
    pubState = '草稿';
  })
})

//0.初始化富文本编辑器------------------------
function initRichText() {
  // 1. 初始化图片裁剪器
  $image = $('#image');

  // 2. 裁剪选项
  options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //0.初始化 富文本编辑器
  initEditor();
}

//1.获取文章分类下拉框的方法 ----------------
function makeSelect() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success(res) {
      console.log(res);
      //a.判断是否成功
      if (res.status === 0) {
        //b.通过模板引擎 生成下拉框选项的html代码字符串
        var optStr = template('tpl-cate', res.data);
        $('[name=cate_id]').html(optStr);
        //c.重新渲染表单元素
        layui.form.render();
      }
    }
  })
}

//2.文件选择框的 change事件 处理函数 --------
function changeFile(e) { //获取用户选择的文件列表
  // a.判断用户是否选择了文件
  if (e.target.files.length === 0) {
    return layui.layer.msg('请选择文件哦~~~')
  }
  // b.根据选中文件，创建对应的 虚拟地址
  var selFile = e.target.files[0];
  var virPath = URL.createObjectURL(selFile);
  // 为裁剪区域重新设置图片
  $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', virPath) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
}

//3.表单 onsubmit 事件处理函数----------------
function submitData(e) {
  //a.阻断表单 默认的 提交行为
  e.preventDefault();
  //b.通过 formData 获取表单元素数据
  var fd = new FormData(this); //this ->表单对象
  //c.为 fd 添加 文章的发布 状态
  fd.append('state', pubState);

  //d.将图片数据添加到formData中
  $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function (blob) {
      // 将文件对象，存储到 fd 中
      fd.append('cover_img', blob);
      //e.发起 ajax 数据请求
      publishArticle(fd);
    })
}

//4.发布文章的方法--------------------------
function publishArticle(fd) {
  $.ajax({
    method: 'POST',
    url: '/my/article/add',
    data: fd,
    // 注意：如果向服务器提交的是 FormData 格式的数据，
    // 必须添加以下两个配置项
    contentType: false,
    processData: false,
    success(res) {
      layui.layer.msg(res.message);
      if (res.status == 0) {
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    }
  })
}