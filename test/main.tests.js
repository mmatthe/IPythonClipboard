"use strict";
var assert = chai.assert;
var should = chai.should();

describe('IPythonAPI', function() {
    var server;
    var api;
    beforeEach(function() {
	server = sinon.fakeServer.create();
	api = new IPythonAPI("localhost", 8888);
    });

    describe('#URL and content tests', function() {
	beforeEach(function() {
	    sinon.stub(jQuery, "ajax");
	});
	afterEach(function() {
	    jQuery.ajax.restore();
	});

	it("should send the correct GET request for listing all files", function(done) {
	    var allFiles = api.listContents("");

	    jQuery.ajax.callCount.should.equal(1);
	    jQuery.ajax.calledWithMatch({url: "http://localhost:8888/api/contents/", type: "get"}).should.equal(true);
	    done();
	});

	it("should send the correct GET request for getting contents of one file", function(done) {
	    var content = api.getFile("Untitled.ipynb");
	    jQuery.ajax.callCount.should.equal(1);
	    jQuery.ajax.calledWithMatch({url: "http://localhost:888/api/contents/Untitled.ipynb"});
	    done();
	});

	it("should send a correct PUT request to create a new file with given conent", function(done) {
	    var cellContents = ["# Contents of Cell1", "# Contents of Cell2"];
	    api.createNotebook("newNB.ipynb", cellContents);
	    jQuery.ajax.callCount.should.equal(1);
	    var args = jQuery.ajax.getCall(0).args[0];
	    args.type.toLowerCase().should.equal('put');
	    args.url.should.equal("http://localhost:8888/api/contents/newNB.ipynb");
	    var contents = JSON.parse(args.data);
	    contents.type.should.equal("notebook");
	    contents.content.cells[0].source.should.equal("# Contents of Cell1");
	    done();
	});
    });
});
