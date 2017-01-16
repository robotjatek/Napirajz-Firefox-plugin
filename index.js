var self = require("sdk/self");
var tabs = require("sdk/tabs");
var tabutils = require("sdk/tabs/utils");
const { viewFor } = require('sdk/view/core');
var req = require("sdk/request").Request;


const {Cc, Ci} = require('chrome');
const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1']
                            .getService(Ci.nsIAboutNewTabService);

							
exports.main = function (options, callbacks) {
  overrideNewTabPage();
};

// overrides the new tab
function overrideNewTabPage() {
  aboutNewTabService.newTabURL = self.data.url("page/newtab.html");
}

function getFormattedDate(){
  var today = new Date();
  return today.getFullYear() + '-' + today.getMonth()+1 + '-' + today.getDate();
}

var worker = undefined;

function getToday()
{
	var todayParam = getFormattedDate();

  req({
	  url: 'http://kereso.napirajz.hu/abort.php?n=1&tol=' + todayParam + '&ig=' + todayParam + '&json', 
		onComplete: function(response){
			worker.port.emit("alert", response.json);
  }}).get();
}

function getRandom()
{
	req({
			url: "http://kereso.napirajz.hu/abort.php?guppi&json",
			onComplete: function (response) {
				worker.port.emit("alert", response.json);
			}
		}).get();		
}

function initWorker(tab)
{
	worker = tab.attach({
				contentScriptFile: "./page/newtab.js"
	});
	worker.port.on("contentMessage", function(message){
		switch(message)
		{
			case "getRandom":
				getRandom();
			break;
			case "getToday":
				getToday();
			break;
			default:
			break;
		}
	});
	return worker;
}

tabs.on('open', function(tab)
{
	tab.on('ready', function(){
		let xultab = viewFor(tab);
		let window = tabutils.getOwnerWindow(xultab);
		if(tab.url.valueOf() == 'resource://napirajzplugin/data/page/newtab.html'.valueOf())
		{
			window.document.getElementById('urlbar').value = '';	
		}
				
		
		req({
			url: "http://kereso.napirajz.hu/abort.php?guppi&json",
			onComplete: function (response) {
				var worker = initWorker(tab);				
				worker.port.emit("alert", response.json);
			}
		}).get();		
		 
	});
});

tabs.on('activate', function(tab){
	let xultab = viewFor(tab);
	let window = tabutils.getOwnerWindow(xultab);
	if(tab.url.valueOf() == 'resource://napirajzplugin/data/page/newtab.html'.valueOf())
	{
		window.document.getElementById('urlbar').value = '';	
	}
	initWorker(tab);
});

exports.onUnload = function (reason) {
	 if (reason === 'uninstall' || reason === 'disable') {
    aboutNewTabService.resetNewTabURL();
  }
};





