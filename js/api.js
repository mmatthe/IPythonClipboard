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

	this.STATUS_OK = 1;
	this.STATUS_MAYBE_ACAO = -1;
	this.STATUS_MAYBE_NOTUP = -2;
	this.STATUS_UNKNOWN = -10;
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
	var obj = this;
	$.get({url: this._contentURL("thisfiledoesnotexist.ipynb"),
	       timeout: 1000,
	       success: function(response) {
	       	   callback({status: true, message: "File found"});
	       },
	       error: function(response) {
		   if (response.status == 404)
		       callback({status: obj.STATUS_OK});
		   else if(response.statusText == 'error')
		       callback({status: obj.STATUS_MAYBE_ACAO});
		   else if(response.statusText == 'timeout')
		       callback({status: obj.STATUS_MAYBE_NOTUP});
		   else
		       callback({status: obj.STATUS_UNKNOWN});
	       }});
    }
}

var getLatestCell = function(contents) {
    var cells = contents.content.cells;
    cells.sort(function(a, b) {
	return a.execution_count < b.execution_count;
    });
    return cells[0];
}

var getCellContent = function(cell) {
    result = {};
    result['input'] = cell.source;
    return result;
}

var formatCell = function(cell) {
    var indentPart = function(part) {
	var result = part.trim().replace(/\n/g, "\n    ");
	result = "\n    " + result + "\n\n";
	return result;
    };
    return indentPart(cell.input);
}
