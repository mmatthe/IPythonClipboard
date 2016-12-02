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

	api.createNotebook("newNB.ipynb",
			   [selection.toString()],
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
});
