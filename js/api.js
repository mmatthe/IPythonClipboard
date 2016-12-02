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

	this.__baseNBContent = {'nbformat': 4, 'metadata': {'language_info': {'nbconvert_exporter': 'python', 'version': '3.5.1', 'mimetype': 'text/x-python', 'file_extension': '.py', 'codemirror_mode': {'version': 3, 'name': 'ipython'}, 'name': 'python', 'pygments_lexer': 'ipython3'}, 'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'}}, 'cells': [], 'nbformat_minor': 0};
	this.__baseNBCell = {"source": "", "metadata": {"collapsed": true, "trusted": true}, "outputs": [], "execution_count": null, "cell_type": "code"};
    }

    _contentURL(path) {
	var url = "http://{0}:{1}/api/contents/{2}".format(this.host, this.port, path);
	return url;
    }

    listContents(directory, callback) {
	var url = this._contentURL(directory);
	$.get({url: url,
	       success: function(xhr) {
		   callback(xhr);
	       },
	       error: function(xhr) {
		   callback(xhr);
	       }
	      });
    }

    getFile(filename, callback) {
	var url = this._contentURL(filename);
	$.get({url: url,
	       success: function(xhr) {
		   callback(xhr);
	       },
	       error: function(xhr) {
		   callback(xhr);
	       }
	      });

    }

    createNotebook(filename, cellContents, callback) {
	var url = this._contentURL(filename);
	var baseContent = $.extend({}, this.__baseNBContent);
	var baseCell = $.extend({}, this.__baseNBCell);
	baseContent.cells = $.map(cellContents, function(cellSource) {
	    return $.extend({}, baseCell, {source: cellSource});
	});
	$.ajax({url: url,
		type: "PUT",
		data: JSON.stringify({type: "notebook", content: baseContent}),
		success: function(xhr) {
		    callback(xhr);
		},
		error: function(xhr) {
		    callback(xhr);
		}
	       });
    }

    checkConnectivity(callback) {
	$.get({url: this._contentURL("thisfiledoesnotexist.ipynb"),
	       timeout: 1000,
	       success: function(response) {
	       	   callback({status: true, message: "File found"});
	       },
	       error: function(response) {
		   var status = response.status != 0;
		   callback({status: status});
	       }});
    }
}
