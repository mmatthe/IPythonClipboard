"use strict";

var callWithSelection = function(callback) {
    if (chrome.tabs !== undefined)
	chrome.tabs.executeScript( {
	    code: "window.getSelection().toString();"
	}, function(result) {
	    callback(result[0]);
	});
    else
	callback(window.getSelection().toString());
};

var createNotebook = function() {
    callWithSelection(function(selection) {
	if (selection.length == 0) {
	    showStatus("No selection given");
	    return;
	}

	var firstCell = "%matplotlib inline\nimport numpy as np\nimport matplotlib.pyplot as plt\n";
	api.createNotebook("newNB.ipynb",
			   [firstCell, selection.toString()],
			   function(response) {
			       showStatus("Notebook {0} saved at {1}".format(response.name, response.last_modified));
	});
    });
}


var readNotebook = function() {
    showStatus("Not yet Implemented");
}

var showStatus = function(msg) {
    $("#status").text(msg);
}

var checkConnectivity = function() {
    var msg = {};
    msg[api.STATUS_OK] = "Connection to server is available!";
    msg[api.STATUS_MAYBE_ACAO] = "You have Access-Control problems!";
    msg[api.STATUS_MAYBE_NOTUP] = "Your Notebook does not respond!";
    msg[api.STATUS_UNKNOWN] = "Unknown server status";

    api.checkConnectivity(function(status) {
	showStatus(msg[status.status]);
    });
}

var api = new IPythonAPI("localhost", 8888);
$(function() {
    $("#createfile").click(function() {
	createNotebook();
    });

    $("#readfile").click(function() {
	readNotebook();
    });

    if(chrome.tabs !== undefined)
	$("#code").remove();

    checkConnectivity();
});
