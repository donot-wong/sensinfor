function dedupe(array){
	return Array.from(new Set(array));
}

var data = new Array();
for(var i = 0; i < localStorage.length; i++)
{
	var key = localStorage.key(i);
	data.push(localStorage.getItem(key));
}

data = dedupe(data);

if (data) {
	chrome.browserAction.setIcon({path: "image/icon16.png"});
	document.getElementById("history").value = data.join('\n');
}


var clear = document.getElementById('clear');
clear.onclick = function(){
	localStorage.clear();
	document.getElementById("history").value = '';
}