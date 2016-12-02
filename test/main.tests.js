"use strict";
var assert = chai.assert;
var should = chai.should();

describe('IPythonAPI', function() {
    var server;
    beforeEach(function() {
	// server = sinon.fakeServer.create();
    });

    describe('#get contents', function() {
	before(function() {
	    sinon.stub(jQuery, "ajax");
	});
	after(function() {
	    jQuery.ajax.restore();
	});

	it("should send the correct GET request to the Server", function(done) {
	    var api = new IPythonAPI("localhost", 8888);
	    var allFiles = api.listContents("/");

	    jQuery.ajax.callCount.should.equal(1);
	    jQuery.ajax.calledWithMatch({url: "http://localhost:8888/api/contents/", type: "get"}).should.equal(true);
	    done();
	});
    });
});
