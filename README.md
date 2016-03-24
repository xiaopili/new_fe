# 小红唇前端规范
## 目录
* Git仓库
* 目录结构
* 环境说明
* App的发布
* 活动页的自动生成
* 前端框架
* Sass公共库
* 自动化
* 自建接口
* 知识库

---

## Git仓库
    Git仓库地址：
        SSH root@192.168.1.16:kevintang/newfe.git
        HTTP http://192.168.1.16:3000/kevintang/newfe.git
        控制台 http://192.168.1.16:3000/KevinTang/newFE
注意：以上的192.168.1.16服务器需要连接VPN后才可以访问，需要使用openVPN

---

## 目录结构
前端环境中，以APP为一个最小的管理单元，每一个APP独占一个文件夹，文件夹名即为APP名。例如商城需求，则应将商城的所有文件（包括html,js,css,image,font等文件放）置在一个文件夹中，命名为store，但公共库不放在其中，公共库放置在与APP统计的lib目录中，所以整体的目录结构如下：

    ├─lib                       公共库文件夹
    │  ├─css                    公共css文件
    │  ├─assets                 公共拦截文件
    │  ├─fonts                  公共字体文件
    │  └─*.js                   公共js库文件
    ├─{App}                     App文件夹，例如商城，文件夹名为store
    │  ├─scss => *.scss         App内scss文件夹，将被已相同文件名编译至css目录下
    │  ├─css  => *.css          App内css文件夹
    │  ├─js   => *.js           App内js文件夹，要求每个页面只有一个脚本文件
    │  └─images                 图片文件夹
    ├─package.json              npm依赖包列表
    └─gulpfile.js               gulp自动化脚本

### 具体说明
**lib/** 所有前端页面的公共类库，复用最为广泛的文件应当放至在该文件夹内，且该文件夹内原则上只允许放至压缩过的文件，对于js要求是uglify过的混淆文件，对于css文件原则上要求是经过cssmin的压缩，但有可能产生问题的css文件可以不压缩。公共库的所有js文件直接放在lib目录下

**lib/assets/** 所有需要被客户端拦截的文件放至在这里，例如jquert.2.1.4.min.js，用于判断页面是否在APP内运行

**lib/fonts/** 公共字体文件，原则上用到的特殊字体或者Icon字体全部放至在该文件夹内，APP内的文件夹中不放置字体文件

**{App}/** APP中所有的页面文件，原则上只存储html文件

**{App}/scss/** APP内的scss文件夹，所有的scss文件将会以同名被编译至css文件夹中，例如scss/list.scss文件将被编译到css/list.css

**{App}/css/** APP内的css文件夹，原则上这个文件夹不手工创建任何文件，而是全部来自scss文件夹编译而来的文件

**{App}/js/** APP内的js文件夹，每个页面原则上只拥有一个js文件，且与页面html文件同名，每个APP拥有一个公共的库文件，也存于本文件夹下，与APP名相同，例如：商城功能中又有一个商品列表页面，页面名为list.html，则页面中除去公共库lib目录中的引用外，至多再可引用两个文件：js/list.js和js/store.js

**{App}/images/** APP中所有的图片资源文件

---

## 环境说明
前端所有页面要求在本地编码完成后，提交到本地测试环境进行测试，然后提交到七牛预演环境进行测试，最终提交到生产环境。

### 本地编码环境
本地编码环境是指开发者在本地自行搭建的临时测试环境，用于在编码过程中进行各种测试。但由于域名限制的问题，一些功能（例如微信登陆、微信JSSDK、微信支付、支付宝支付）等功能需要提交到预演环境进行测试。

在开始编码前，请确认计算机上的node版本大于4.0，因为gulp脚本中使用了大量ES6特性

开发者需要首先克隆Git仓库，然后安装node包依赖，可以使用以下命令进行安装：

    npm install
    
注意：gulp-sass插件安装较慢，请耐心等待
    
之后，需要全局安装gulp：

    npm install gulp -g

安装成功后，可以使用以下命令检查

    gulp check
    
当在console中显示出Install OK表示安装正常，否则请检查依赖包是否安装完整


#### 本地环境的搭建

首选需要明确要调试的APP，然后执行以下命令：

    gulp --app :appname [--port :port]
    
其中appname为要调试的App名，port为指定本地服务器的端口，默认80端口
默认绑定的IP地址为0.0.0.0，即全部IP

---
### 本地测试环境

本地测试环境使用一台基于ARM架构的嵌入式系统构建，使用Nginx作为Web服务器，每次从Git仓库拉取最新代码以进行调试。

服务器具体参数：

    地址：          192.168.2.200:81    (需要连接到内网主路由器，包括：XHC, xhc-5G-1, xhc-5G-2)
    服务器配置文件: /etc/nginx/sites-enabled/testenv
    测试文件位置：  /home/git/FETest/
    

要把代码部署到本地测试环境，需要先将代码提交到Git仓库，并推送到远程仓库，然后执行以下命令：

    gulp --app :appname test
    
上述代码是触发服务器的git pull命令以拉取远端Git库中的最新代码，如未检测到任何变动，将会产生一下错误：

    Warning: Nothing update!
    
此时请确认代码已经正确提交到远程Git仓库，或本地服务器已经是代码的最新版本。
当本地测试服务器无响应时，将产生以下错误：

    Can not connect to Local Test Server ...
    
**注意** 部署到本地测试环境时，不需要指定App，Git仓库中的所有更新都将被部署到服务器上，不需要单独部署公共库Lib文件夹。部署到本地测试环境的所有代码都是原始的，未经任何压缩的。

---

### 预演环境

预演环境是架设在七牛云存储上的一个独立空间，由于很多功能模块对域名有限制，所以预演环境能更好的测试一些在本地测试环境中无法测试的功能。

服务器具体参数：

    域名：          http://fetest.xiaohongchun.com
    空间(bucket)：  fetest
    
要把代码部署到预演环境上，可以执行以下命令：

    gulp --app :appname [--cssmin] preview
    
上述代码会首先将指定App中的代码进行发布，有关发布的内容请见 **App的发布** 一节
发布后的代码将会上传至七牛的对应空间中，使用对应域名可以进行访问，在上传过程中，将会跳过那些没有改动的文件

**注意** 只执行preview指令只会部署app文件夹中的所有文件，而不会部署lib文件夹中的公共库
要部署lib文件夹中的文件，可以执行如下命令：

    gulp preview-lib

---

### 生产环境

生产环境是线上版本，最终展示给用户的，上线前请再三确认

服务器具体参数：

    域名：          http://static.xiaohongchun.com
    空间(bucket)：  xhc-static
    
要把代码部署到预演环境上，可以执行以下命令：

    gulp --app :appname [--cssmin] product
    
上述代码会首先将指定App中的代码进行发布，有关发布的内容请见 **App的发布** 一节
发布后的代码将会上传至七牛的对应空间中，使用对应域名可以进行访问，在上传过程中，将会跳过那些没有改动的文件

**注意** 只执行preview指令只会部署app文件夹中的所有文件，而不会部署lib文件夹中的公共库
要部署lib文件夹中的文件，可以执行如下命令：

    gulp product-lib
    
---

## App的发布

App的发布是至将某个App文件夹中的代码文件进行一些处理之后，放在./../publish/目录下的过程，是发布到预演环境和生产环境的先导步骤。

这些处理包括：

* js文件压缩混淆
* css文件压缩（默认不开启，如需要使用，需要在gulp命令中加入--cssmin指令）
* html中引用的js和css文件加入版本控制，具体做法是在文件名后加入 **?v={时间戳}** ，但用于供APP截获的文件(lib\assets\文件夹中的文件)不会被加入版本控制

要使用App发布，可以使用以下命令：

    gulp --app :appname [--cssmin] publish

**注意** 只运行publish任务，不会发布公共库lib目录，要发布lib目录，可以使用以下命令：

    gulp publish-lib

上述命令会将lib目录下的js文件进行压缩混淆，而其他文件原样复制到./../publish/lib/
    
---

## 活动页的自动生成

为了应对频繁且相似度高的运营活动页面的制作问题，可以使用gulp自动化工具进行制作，步骤如下：

#### 切图

请使用相关切图工具对设计长图进行切分，原则上一个区块切分为一个切片，且单个切片高度不大于500px

切好的图片，按照以下命名格式存储在 **active/images/** 目录中

    {ActiveName}_{ID}.png
    
{ActiveName}为活动名称，纯英文，多单词时使用驼峰命名法，例如空瓶活动：emptyBottle
{ID}切片编号，当切片数量小于10时，直接采用一位数字，其他情况在数字前补0保持位数相同

#### 微信分享文案准备

请准备好以下三个内容：

* 微信分享标题
* 微信分享文案
* 微信分享小图

微信分享小图请按照以下文件名存储在 **active/images/** 目录中

    weChatIcon_{ActiveName}.png

#### gulp生成页面
    
执行以下命令，可以根据 active/template.html 文件为模板生成一个新的活动页面

    gulp active

执行上述命令后，将出现以下提示：

    **Active Name (FileName)** 活动名，将作为文件名
    **Page Image Num** 活动页面中的图片的切片数量
    **Share Title** 微信分享标题
    **Share Content** 微信分享文案

所有参数输入之后，将生成**active/{ActiveName}.html文件

随后可以执行以下命令，将刚刚生成好的活动页面部署到生产环境

    gulp --app active product

---

## 前端框架

目前使用的公共前端框架有：

 * [Vue](http://cn.vuejs.org/api/)
 * [jQuery](http://www.css88.com/jqapi-1.9/)


自用的公共库(lib\mobile.js)：

    在页面中使用mobile库，可以使用mobile.方法名的形式进行调用
    mobile.js 中已经集成了jQuery1.9.1、MediaElement.js、MediaElementPlayer、bShare组件
    
mobile.js方法列表：

* **binddownload** (jquery_selector)
    **方法**    在指定的DOM上绑定下载APP的事件，微信中跳转应用宝，安卓直接下载APK文件，苹果跳转iTunes
    **参数**    jquery_selector 数组 jQuery选择器字符串
    **示例**    mobile.binddownload(['.download', '.footerdownload','.comment'])

* **template** (template, option)   废弃
    **方法**    一个简单的模版解释器

* **limitless** (height, callback)
    **方法**    用于进行无尽加载，当页面滚动至距离页面底端小于height像素时，出发callback，对于callback进行了200ms的函数节流
    **参数**    height 数字 触发阈值    callback 函数 回调函数

* **query** (item)
    **函数**    解析QueryString
    **参数**    item 字符串 要获取的字段
    **示例**    例如url为http://xhc.com/eg.html?a=1，调用mobile.query('a')返回'1'

* **renderdom** (dom, data, template, type)   废弃
    **方法**    template的二次封装，加入了更多的模版功能

* **adddownloader** (option)
    **方法**    在页面的上下加入小红唇APP下载条
    **参数**    option.position 可选值 both,top,bottom  option.height 可选值 上方占位Div的高度

* **share.bind** (item) 废弃
    **方法**    给指定DOM加入点击分享事件，调用bShare
    **参数**    item 数组 要绑定的jQuery选择器字符串

* **videoplugin** (size, selector, callback)
    **方法**    给指定的<video>标签加入视频播放空间
    **参数**    size 数字 正方形视频的宽高  selector 字符串 jQuery选择器字符串  callback 函数 成功加入播放控件后的回调函数

* **notification** (option)
    **方法**    显示一个半透明的提示框
    **参数**    {icon:图标URL，text:要显示的文本，position:出现位置(top-left,top-right,bottom-left,bottom-right)，duration:显示的时间，超时后消失，callback:消失后的回调函数}

* **throttle** (method, interval, context)
    **方法**    返回一个函数的节流版本
    **参数**    method 要被限制的函数   interval 节流的间隔时间 context 执行上下文

* **scrolldown** (callback(height))
    **方法**    当页面被下拉的时候触发回调，对回调函数做了200ms的函数节流
    **参数**    callback 回调函数   height 被下拉的距离

* **avoidEmptyRequest** ()
    **方法**    为了解决vue中image标签的src属性被预先置入占位符而导致的404问题
    **用法**    在所有的img标签中，用data-src属性替代原生的src属性，并在vue渲染完毕后，调用本方法

* **weChat.initWeChat** ()
    **方法**    向页面中注入微信JSSDK权限，需要保证已经引入了微信js库，并且调用域名为微信公众账号中的安全域名

* **weChat.bindWeChatShare** (option)
    **方法**    向微信浏览器中注入分享参数，用来控制微信分享消息中的内容
    **注意**    调用本方法前不需要调用initWeChat方法来注入权限，因为本方法会自行调用。本方法中的所有参数需要涉及URL时，可直接使用相对地址
    **参数**    [点击查看](http://mp.weixin.qq.com/wiki/7/1c97470084b73f8e224fe6d9bab1625b.html#.E8.8E.B7.E5.8F.96.E2.80.9C.E5.88.86.E4.BA.AB.E5.88.B0.E6.9C.8B.E5.8F.8B.E5.9C.88.E2.80.9D.E6.8C.89.E9.92.AE.E7.82.B9.E5.87.BB.E7.8A.B6.E6.80.81.E5.8F.8A.E8.87.AA.E5.AE.9A.E4.B9.89.E5.88.86.E4.BA.AB.E5.86.85.E5.AE.B9.E6.8E.A5.E5.8F.A3)

* **weChat.getCode** (scope, state)
    **函数**    获取微信登录的临时凭票，如果当前页面没有临时凭票则会跳转到微信登陆界面
    **参数**    scope 可选 微信登陆作用域，有两个可选值snsapi_base（不可获取用户资料），snsapi_userinfo（可以获取用户资料）
state 可以被微信登录服务器传递的参数

* **weChat.setToken** (callback)
    **方法**  调用该方法后，将会使用ajaxSetup的形式向之后发生的所有AJAX请求中注入用户授权
    **参数**  callback 获取Token成功后回调，Token作为回调函数的参数返回

* **appendBaiduAnalysis** ()
    **方法**    加入百度统计代码，在活动页等需要统计访问的页面中需要调用本方法

* **convertURL** (url)
    **函数**    将相对地址转换为绝对地址，而绝对地址原样返回
    **参数**    要转换的URL

* **appendAppShare** (smallimage, content)
    **方法**    向APP内注入分享参数
    **注意**    在非小红唇APP中使用本方法无效，分享消息的标题为页面标题(document.title)
    **原理**    通过发起一个image类型的Http请求，APP进行截获获取参数
    **参数**    smallimage 分享小图 content 分享文字 

* **domClick** ()
    **方法**    给页面上带data-location属性的DOM加入当click时的location.href行为

* **inApp** ()
    **函数**    返回一个布尔值，指示当前页面是否是在小红唇APP的浏览器中打开的
* **loadingComplete** ()
    **方法**    加载完成后调用

---

## Sass公共库

### 使用方法

要使用Sass公共库中的函数，需要在对应的Sass定义中按照如下格式进行调用

    @include 函数名(参数列表)

### 函数列表

#### divcenter(height)
    height 盒高
    给单行盒中的文字垂直居中
#### fixed(position)
    position [top, bottom] 位置
    在页面中的左上角或左下角fix的显示一个元素
#### gap(width)
    width 边框宽度
    为一个盒加入下边框，需要提前设置 $bgcolor 变量
#### bb(width, border_color)
    width 边框宽度
    border_color 边框颜色
    与上一个方法相同，颜色值以参数形式传入
#### circle(size)
    size 圆环直径
    设置一个元素为圆形，用在例如头像的显示，且设置为左浮动
#### sprite(image_url, pos_x, pos_y, width, height)
    image_url 图片位置
    pos_x 雪碧图X坐标偏移
    pos_y 雪碧图Y坐标偏移
    width 雪碧图宽度
    height 雪碧图高度
    用来显示一个雪碧图
#### contentCenter(outer_height, inner_height)
    outer_height 外包盒高度
    inner_height 内容盒高度
    实现一个盒在另一个盒中的垂直居中，使用Padding实现
#### contentCenterM(outer_height, inner_height)
    outer_height 外包盒高度
    inner_height 内容盒高度
    同上，使用Margin实现
#### circleBorder(border_style)
    border_style 外边框样式 例如 1px solid red
    为一个元素进行圆形描边
#### rmb2()
    给一个元素前方加入人民币¥符号，间隔5px
#### multiline-overflow(line_number)
    line_number 允许显示的行数
    多行溢出加省略号，仅适用Webkit内核浏览器
#### triangle(heading, width, height, color)
    heading 朝向，可选[up, down, left, right]
    width 三角底边宽度
    height 三角高
    color 颜色
    用CSS画一个三角
#### loading(zoom, margin)

    zoom 缩放系数 典型值0.4
    margin  上边距 典型值1000px
    页面Loading样式

    .loading {
        @include loading(0.4,1000px auto);
    }

需要加入以下HTML代码

    <div class="loading">
      <div class="title">小红唇</div>
      <div class="subtitle">你的变美频道</div>
      <div class="sharp1"></div>
      <div class="sharp2"></div>
      <div class="sharp3"></div>
      <div class="sharp4"></div>
    </div>


---

## 自动化

gulp自动化工具的task列表：

*   **default**         wactch + connect
*   **sass**            编译app目录中的sass文件
*   **watch**           监视scss目录中的所有scss文件并监视app文件夹中文件以进行LiveReload
*   **connect**         启动本地服务器
*   **test**            将代码部署到本地测试环境
*   **preview**         将代码部署到预演环境
*   **preview-lib**     将公共库部署到预演环境
*   **product**         将代码部署到生产环境
*   **product-lib**     将公共库部署到生产环境
*   **publish**         发布App
*   **publish-lib**     发布公共库

---

## 自建接口

### 收获地址中的城市列表

#### 获取省份列表（不包括港澳台）

  http://static.xiaohongchun.com/store/city/province.json

```javascript
  结果:{
    code: 0,
    data: ['北京市', '天津市', ...]  // 省份名
  }
```

#### 获取城市和区域列表

  http://static.xiaohongchun.com/store/city/{省份名}.json

  省份名直接穿中文，例如 北京市.json

```javascript
  结果:{
    code: 0,
    data: [
      {
        name: '青岛市' //城市名
        district :[
          {
            name: '市南区' //区域名
            zipcode: '266001' //邮编
          }
        ]
      },
      ...
    ]
  }
```



---

## 知识库

#### iOS Safari浏览器不响应click事件

  Safari浏览器中不管是在DOM中或是在js中进行click事件的绑定，默认都不会被响应

**解决方案** 给对应的DOM元素添加如下css属性

  cursor: pointer;

# new_fe
