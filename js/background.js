var currenturl;
var record = sessionStorage;
var status = false;

chrome.contextMenus.create({
    title: "Start Sensinfor",
    id: "Sensinfor",
    onclick: function(){
        if (status == 'true') {
            chrome.contextMenus.update('Sensinfor', {title: 'Start Sensinfor'} , function(){});
            status = false;
        }else{
            chrome.contextMenus.update('Sensinfor', {title: 'Stop Sensinfor'} , function(){});
            status = true;
        }
    }
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (status != 'true') {
        return;
    }
    if(changeInfo.status == "loading"){
    	updateIcon("icon16");
      if (tab.url.substr(0, 6) != 'chrome' && tab.url.substr(0, 11) != 'view-source' && tab.url.substr(0, 4) != 'file') {
          startScan(tab.url);
      }
    }
});


function parseURL(url) { 
	var a = document.createElement('a'); 
	a.href = url; 
	return { 
	    source: url, 
	    protocol: a.protocol.replace(':', ''), 
	    host: a.hostname, 
		  port: a.port, 
		  query: a.search, 
		  params: (function(){ 
			    var ret = {}, 
			    seg = a.search.replace(/^\?/, '').split('&'), 
			    len = seg.length, i = 0, s; 
			    for (; i < len; i++) { 
				      if (!seg[i]) { continue; } 
			    s = seg[i].split('='); 
		      ret[s[0]] = s[1]; 
	        }
		      return ret; 
	   })(),

	    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1], 
	    hash: a.hash.replace('#',''), 
	    path: a.pathname.replace(/^([^\/])/,'/$1'), 
	    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1], 
	    segments: a.pathname.replace(/^\//,'').split('/') 
	}; 
}


//update icon
function updateIcon(name) {
  chrome.browserAction.setIcon({path: "image/" + name + ".png"});
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea")

    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text

    document.body.appendChild(textArea)

    textArea.select()

    try {
      var msg = document.execCommand('copy') ? 'sucess' : 'failed'
      // console.log('复制内容 ' + msg)
    } catch (err) {
      console.log('不能使用这种方法复制内容')
    }

    document.body.removeChild(textArea)
}


function show(title, content, tagname) {
  localStorage.setItem(new Date().getTime(), content);
  var notice = new Notification(title, {
    body: content,
    icon: "image/icon48.png",
    tag: tagname, // 可以加一个tag
  });
  
  // notice['onclose'] = function(event){
  //     window.open(content, '_blank');
  // };
  notice['onclick'] = function(event){
      copyTextToClipboard(content);
  };
}


function gitfinder(protocol, host, port, path){
  var giturl = protocol + "://" + host + path + ".git/config";
    if(port){
      giturl = protocol + "://" + host + ":" + port + path + ".git/config";
    }
   $.ajax({
      type: "GET",
      url : giturl,
      complete: function(xmlhttp) { 
        if (xmlhttp.readyState == 4) { 
          if (xmlhttp.status == 200) {  
                var responseText = xmlhttp.responseText;
                if(responseText){
                  var match = responseText.match(/repository/i);
                  var match2 = responseText.match(/DOCTYPE/i);
                    if(match && !match2){
                      updateIcon("fire");
                      show("Git Leak", giturl, giturl);
                    }
                }
            }
        }
      },
  });
}


function svnfinder(protocol, host, port, path){
	var svnurl = protocol + "://" + host + path + ".svn/entries";
    if(port){
      svnurl = protocol + "://" + host + ":" + port + path + ".svn/entries";
    }
   $.ajax({
      type: "GET",
      url : svnurl,
      complete: function(xmlhttp) { 
				//完成交互
				if (xmlhttp.readyState == 4) { 
				 		//状态码
          if (xmlhttp.status == 200) {  
                // var ct=xmlhttp.getResponseHeader("Connection");
                // var cct= "close";
                var responseText = xmlhttp.responseText;
                if(responseText){
                	var match1 = responseText.match(/svn/i);
                  var match2 = responseText.match(/dir/i);
                  var match3 = responseText.match(/DOCTYPE/i);
        						if(match1 && match2 && !match3){
        							updateIcon("fire");
        							show("Svn Leak", svnurl, svnurl);
        						}
                }
            } 
			   }
			},
  });
}


function svnfindernew(protocol, host, port, path){
    var svnurl_new = protocol + "://" + host + path + ".svn/wc.db";
    if(port){
      svnurl_new = protocol + "://" + host + ":" + port + path + ".svn/wc.db";
    }
     $.ajax({
        type: "GET",
        url : svnurl_new,
        complete: function(xmlhttp) { 
            //完成交互
           if (xmlhttp.readyState == 4) { 
              //状态码
            if (xmlhttp.status == 200) {  
                var responseText = xmlhttp.responseText;
                 if(responseText){
                  var match = responseText.match(/SQLite/i);
                  var match3 = responseText.match(/DOCTYPE/i);
                  if(match && !match3){
                    updateIcon("fire");
                    show("Svn Leak", svnurl_new, svnurl_new);
                  }
                 }
             } 
           }
        },
    });
}

//find bash history file
function bash(protocol, host, port, path){
	var bashurl =protocol + "://" + host + path + ".bash_history";
  if(port){
    bashurl =protocol + "://" + host + ":" + port + path + ".bash_history";
  }
  $.ajax({
        type: "GET",
        url: bashurl,
        complete: function(xmlhttp) { 
				//完成交互
				 if (xmlhttp.readyState == 4) { 
				 		if (xmlhttp.status == 200) {  
             	var responseText = xmlhttp.responseText;
            	var match = responseText.match(/((cd)\s\w*\/)|(vi\s\w*\.\w*)/i);
              var match3 = responseText.match(/DOCTYPE/i);
  						if(match && !match3){
  							updateIcon("fire");
  							show("Bash History Leak", bashurl, bashurl);
  						}
            } 
				 }
		  },
  });
}

//find zip backup file
function backupfinder_zip(protocol, host, port, path, filename){
  var backupURL_zip =protocol + "://" + host + path + filename + ".zip";
  if(port){
    backupURL_zip =protocol + "://" + host + ":" + port + path + filename + ".zip";
  }

  $.ajax({
      type: "HEAD",
      url : backupURL_zip,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) { 
            //状态码
          if (xmlhttp.status == 200) {  
                var ct = xmlhttp.getResponseHeader("Content-Type");
                var ctlength = xmlhttp.getResponseHeader("Content-Length");
                // console.log(ctlength>50);
                if( ctlength > 50 && (ct == "application/zip" || ct == "application/x-zip-compressed")){
                    updateIcon("fire");
                    show("Maybe a backup file find", backupURL_zip, backupURL_zip);
                }
            }
        }
      },
  });
}

//find tar.gz backup file
function backupfinder_tar_gz(protocol, host, port, path, filename){
  var backupURL_gz =protocol + "://" + host + path + filename + ".tar.gz";
  if(port){
    backupURL_gz =protocol + "://" + host + ":" + port + path + filename + ".tar.gz";
  }

  $.ajax({
      type: "HEAD",
      url : backupURL_gz,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) { 
            //状态码
          if (xmlhttp.status == 200) {  
                var ct=xmlhttp.getResponseHeader("Content-Type");
                var ctlength = xmlhttp.getResponseHeader("Content-Length");
                if(ctlength > 50 && ct == "application/octet-stream"){
                    updateIcon("fire");
                    show("Maybe a backup file find", backupURL_gz, backupURL_gz);
                }
            }
        }
      },
  });
}

//find sql backup file
function sqlfinder(protocol, host, port, path, filename){
  var sqlURL =protocol + "://" + host + path + filename + ".sql";
  if(port){
    sqlURL =protocol + "://" + host + ":" + port + path + filename + ".sql";
  }

  $.ajax({
      type: "HEAD",
      url : sqlURL,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) { 
            //状态码
          if (xmlhttp.status == 200) {  
                var ct=xmlhttp.getResponseHeader("Content-Type");
                var ctlength = xmlhttp.getResponseHeader("Content-Length");
                if(ctlength > 50 && ct == "application/octet-stream"){
                    updateIcon("fire");
                    show("Maybe a sql file find", sqlURL, sqlURL);
                }
            }
        }
      },
  });
}

//check phpinfo
function phpinfoFinder(protocol, host, port, path, filename){
  var phpinfourl =protocol + "://" + host + path + filename + ".php";
  if(port){
    phpinfourl =protocol + "://" + host + ":" + port + path + filename + ".php";
  }

  $.ajax({
      type: "GET",
      url : phpinfourl,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) {
            //状态码
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/PHP Version/);
              var match2 = responseText.match(/Zend/);
              if(match1 && match2){
                updateIcon("fire");
                //alert(phpinfourl);
                show("A phpinfo file find", phpinfourl, phpinfourl);
              }
            }
        }
      },
  });
}


//check .idea
function ideaFinder(protocol, host, port, path){
  var ideaurl =protocol + "://" + host + path  + ".idea/workspace.xml";
  if(port){
    ideaurl =protocol + "://" + host + ":" + port + path + ".idea/workspace.xml";
  }

  $.ajax({
      type: "GET",
      url : ideaurl,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) {
            //状态码
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/project /);
              var match2 = responseText.match(/component /);
              if(match1 && match2){
                updateIcon("fire");
                //alert(ideaurl);
                show("A .idea file find", ideaurl, ideaurl);
              }
            }
        }
      },
  });
}


//check spring boot v1
function springboot(protocol, host, port, path){
  var springbooturl =protocol + "://" + host + path  + "env";
  if(port){
    springbooturl =protocol + "://" + host + ":" + port + path + "env";
  }

  $.ajax({
      type: "GET",
      url : springbooturl,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) {
            //状态码
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/systemProperties/);
              var match2 = responseText.match(/JAVA_HOME/);
              if(match1 && match2){
                updateIcon("fire");
                //alert(springbooturl);
                show("Springboot leak find", springbooturl, springbooturl);
              }
            }
        }
      },
  });
}

//check spring boot v2
function springboot2(protocol, host, port, path){
  var springboot2url =protocol + "://" + host + path  + "actuator/env";
  if(port){
    springboot2url =protocol + "://" + host + ":" + port + path + "actuator/env";
  }

  $.ajax({
      type: "GET",
      url : springboot2url,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) {
            //状态码
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/systemProperties/);
              var match2 = responseText.match(/JAVA_HOME/);
              if(match1 && match2){
                updateIcon("fire");
                //alert(springbooturl);
                show("Springboot leak find", springboot2url, springboot2url);
              }
            }
        }
      },
  });
}


//check spring boot swagger
function springbootswagger(protocol, host, port, path){
  var springbootswaggerurl =protocol + "://" + host + path  + "swagger-ui.html";
  if(port){
    springbootswaggerurl =protocol + "://" + host + ":" + port + path + "swagger-ui.html";
  }

  $.ajax({
      type: "GET",
      url : springbootswaggerurl,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) {
            //状态码
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/spring/);
              var match2 = responseText.match(/swagger-ui/);
              if(match1 && match2){
                updateIcon("fire");
                //alert(springbootswaggerurl);
                show("Springboot swagger leak find", springbootswaggerurl, springbootswaggerurl);
              }
            }
        }
      },
  });
}


//check druid
function druid(protocol, host, port, path){
  var druidurl =protocol + "://" + host + path  + "druid/index.html";
  if(port){
    druidurl =protocol + "://" + host + ":" + port + path + "druid/index.html";
  }

  $.ajax({
      type: "GET",
      url : druidurl,
      complete: function(xmlhttp) { 
        //完成交互
        if (xmlhttp.readyState == 4) {
            //状态码
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/Druid/);
              var match2 = responseText.match(/Monitor/);
              if(match1 && match2){
                updateIcon("fire");
                //alert(springbootswaggerurl);
                show("druid swagger leak find", druidurl, druidurl);
              }
            }
        }
      },
  });
}


//check phpmyadmin
function phpmyadmin(protocol, host, port, path){
  var phpmyadminurl = protocol + "://" + host + path + "index.php";
  if(port){
    phpmyadminurl = protocol + "://" + host + ":" + port + path + "index.php";
  }

  $.ajax({
      type: "GET",
      url : phpmyadminurl,
      complete: function(xmlhttp) { 
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {  
              var responseText = xmlhttp.responseText;
              var match1 = responseText.match(/phpMyAdmin/);
              var match2 = responseText.match(/English/);
              if(match1 && match2){
                updateIcon("fire");
                show("phpMyAdmin find", phpmyadminurl, phpmyadminurl);
              }
            }
        }
      },
  });
}


function setStorage(protocol, host, port, path){
    if (port) {
        var idx = protocol + "://" + host + ':' + port + path;
    } else {
        var idx = protocol + "://" + host + path;
    }
    record.setItem(idx, true);
}


function getStorage(protocol, host, port, path){
    if (port) {
        var idx =protocol + "://" + host + ':' + port + path;
    } else {
        var idx = protocol + "://" +  host + path;
    }
    
    if (record.getItem(idx)) {
      return true;
    }else{
      return false;
    }
}


function getPathName(path, file){
    tmp_path = path.replace(file,"").split('/');
    tmp_path.splice(0,1);
    return tmp_path;
}


function leakFileFind(protocol,host, port, path){
    //文件泄露
    //phpinfo文件
    var phpinfoFilenameArr = new Array('1', 'php', 'phpinfo', 'test', 'info', 'l', 'u', 'tz', 'p', 'iProber2', 'upload', 'download');
    if (!getStorage(protocol,host, port, path)) {
          bash(protocol,host,port,path);
          gitfinder(protocol,host, port, path);
          svnfinder(protocol,host,port,path);
          svnfindernew(protocol,host, port, path);
          for (var j = phpinfoFilenameArr.length - 1; j >= 0; j--) {
              phpinfoFinder(protocol, host, port, path, phpinfoFilenameArr[j]);
      
          }
          phpmyadmin(protocol, host, port, path + 'phpMyAdmin/');
          phpmyadmin(protocol, host, port, path + 'phpmyadmin/');
          phpmyadmin(protocol, host, port, path + 'pmd/');
          phpmyadmin(protocol, host, port, path + 'phpMyadmin/');
          ideaFinder(protocol, host, port, path);
          setStorage(protocol, host, port, path);
          springboot(protocol, host, port, path);
          springboot2(protocol, host, port, path);
          springbootswagger(protocol, host, port, path);
          druid(protocol, host, port, path);
     }
}


function backupfileFind(protocol, host, port, path, OnlyPathName) {
    //备份文件
    var backFilenameArr = new Array('backup', 'www', '2018', '2019', 'back', 'upload', '1', 'wwwroot', 'db', 'sql', '2020', '2021');
    var sqlFilenameArr = new Array('back', 'backup', '2020', '2021', 'database', 'backups', 'db', 'setup', 'sqldump', 'mysql', 'user', 'dump','sql', 'db_backup', '1', '2');
    if (!getStorage(protocol, host, port, path + 'backupFind')) {
      for (var i = backFilenameArr.length - 1; i >= 0; i--) {
        backupfinder_zip(protocol, host, port, path, backFilenameArr[i]);
        backupfinder_tar_gz(protocol, host, port, path, backFilenameArr[i]);
      }
      for (var i = sqlFilenameArr.length - 1; i >= 0; i--) {
        sqlfinder(protocol, host, port, path, sqlFilenameArr[i]);
      }
      backupfinder_zip(protocol, host, port, path, '../' + OnlyPathName);
      backupfinder_tar_gz(protocol, host, port, path, '../' + OnlyPathName);
      setStorage(protocol, host, port, path + 'backupFind');
    }
}

function startScan(url) {
    var parsedURL = parseURL(url);
    var protocol = parsedURL.protocol;
    var host = parsedURL.host;
    var port = parsedURL.port;
    var path = parsedURL.path;
    var file = parsedURL.file;

    pathAry = getPathName(path, file);
    //
    if (pathAry.length == 1) {
        //没有子目录
        leakFileFind(protocol, host, port, '/');
        backupfileFind(protocol, host, port, '/', host);
    } else if(pathAry.length > 1 && pathAry[0] != '.git' && pathAry[0] != '.svn'){
        //探测一级目录
        leakFileFind(protocol, host, port, '/');
        leakFileFind(protocol, host, port, '/' + pathAry[0] + '/');
        backupfileFind(protocol, host, port, '/', host);
        backupfileFind(protocol, host, port, '/' + pathAry[0] + '/', pathAry[0]);
        //探测二级目录
        if (pathAry[1]) {
            leakFileFind(protocol, host, port, '/' + pathAry[0] + '/' + pathAry[1] + '/');
            backupfileFind(protocol, host, port, '/' + pathAry[0] + '/' + pathAry[1] + '/', pathAry[1]);
        }
    }
}