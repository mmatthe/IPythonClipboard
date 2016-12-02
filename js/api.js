// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

class IPythonAPI {
    constructor(host, port) {
	this.host = host;
	this.port = port;
    }

    listContents(directory) {
	var url = "http://{0}:{1}/api/contents{2}".format(this.host, this.port, directory);
	$.get(url, function() {
	});
    }
}
