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

    describe('#get contents', function() {
	beforeEach(function() {
	    sinon.stub(jQuery, "ajax");
	});
	afterEach(function() {
	    jQuery.ajax.restore();
	});

	it("should send the correct GET request to the Server", function(done) {
	    var allFiles = api.listContents("");

	    jQuery.ajax.callCount.should.equal(1);
	    jQuery.ajax.calledWithMatch({url: "http://localhost:8888/api/contents/", type: "get"}).should.equal(true);
	    done();
	});

	it("should send the correct GET request to get contents of one file", function(done) {
	    var content = api.getFile("Untitled.ipynb");
	    jQuery.ajax.callCount.should.equal(1);
	    jQuery.ajax.calledWithMatch({url: "http://localhost:888/api/contents/Untitled.ipynb"});
	    done();
	});
    });
});
