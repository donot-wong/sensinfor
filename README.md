# Sensinfor

## A chrome extension use to find leak file and backup file

### 2021.8.31
1. 新增druid检测

### 2021.4.20
1. 新增spring actuator检测
2. 新增spring swagger检测

### 2020.12.31
1. 新增备份文件检测字典
2. 新增sql文件检测

### 2020.09.03
1. 新增备份文件检测规则降低误报


### 2020.08.16
1. 新增spring boot接口泄漏规则

### 2019.05.21
1. 新增字典.idea泄露检测、部分php文件字典（tz.php l.php等）
2. 修复存储键值错误导致的显示缺失
3. 修复文件泄露检测错误导致的漏报
4. 新增phpmyadmin检测字典


### 2018.12.27 
1. 新增记录功能，记录历史发现的泄漏事件。点击浏览器右上角插件图标即可。
2. 历史记录采用localStorage进行记录，重启浏览器记录依然存在，而对于检测防重复采用的是sessinStorage，也就是重启浏览器后即会自动清空。
新增的清空功能只针对历史记录进行清空，由于localStorage空间有限，请及时清空。


### 2018.12.07 
浏览器启动后插件默认为关闭。

### 2018.10.24
最近遇到win10 defender拦截下载插件问题，插件核心代码位于js/backgroud.js中，主要行为为通过Ajax发包
根据返回内容判断是否存在泄漏敏感信息问题。建议通过git clone本仓库到本地，然后开启开发者模式，加载已解压扩展。
穷== 付不起5$开发者费用，所以插件不会出现在商店中，目前插件已经比较稳定，如果出现bug欢迎反馈会抽时间修复。

### 2018.10.18 
修复bug 调整目录结构


### 2018.8.1
1. 更新svn检测规则，减少误报


### 2018.5.30

1. 新增对phpmyadmin目录检测
2. 新增phpinfo文件检测，一二级目录下检测1.php / php.php / phpinfo.php /test.php /info.php
3. 点击提示框自动复制url地址到剪切板
4. 右键控制插件开关
5. 优化代码结构


### 2018.5.29

1. 优化.svn泄露检测误报
2. 解决多个站点同时提示误报问题
