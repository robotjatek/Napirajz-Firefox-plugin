function createImageElement(imageUrl){
  var imgTag=document.createElement("img");
      imgTag.setAttribute('src', imageUrl);
      imgTag.setAttribute('alt', 'na');
  return imgTag;
}

function getFirst(responseJson){
  for(pic in responseJson){
    return responseJson[pic].URL;
  }
}

self.port.on("alert",function(message){
	 document.getElementById('kepdiv').innerHTML = '';
	 if(message.length !== 0)
	 {
		document.getElementById('kepdiv').appendChild(createImageElement(getFirst(message)));
	 }
	 else
	 {
		  document.getElementById('kepdiv').innerHTML = 'Nem volt még ma rajz :('
	 }
		 
	
	
	var todayButton = document.getElementById('maiDiv');
	todayButton.onclick = function(){
	self.port.emit("contentMessage", "getToday");	
	}
	
	var randomButton = document.getElementById('randomDiv');
	randomButton.onclick = function(){
	self.port.emit("contentMessage", "getRandom");
	}
	
	document.getElementById('b1').disabled = false;
	document.getElementById('b2').disabled = false;
	
});
