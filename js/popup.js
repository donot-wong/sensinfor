var data = "";
for(var i = 0; i < localStorage.length; i++)
{
	var key = localStorage.key(i);
	data = data + localStorage.getItem(key) + '\n';
}
if (data) {
	document.getElementById("history").value = data;
}


var clear = document.getElementById('clear');
clear.onclick = function(){
	localStorage.clear();
	document.getElementById("history").value = '';
}