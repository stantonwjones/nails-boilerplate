var assert = require('assert');
var Model = require('../lib/model.js');
var default_connector = require('../lib/mongodb_connector.js');
Model.set_connector(default_connector, {});

var test_model = new Model();
var model_prot = Model.prototype;
describe('Model', function() {
    describe('#_merge_attributes', function() {
    });
    describe('#_extend_deeply', function() {
        var attr0;
        var attr1;
        beforeEach(function() {
            attr0 = {a:7, b:'test', c:null, o: {}};
            attr1 = {a:8, c:'test0', o: {a:0}};
        });
        it('should rewrite non object attributes', function(){
            model_prot._extend_deeply(attr0, attr1);
            // these should change
            assert(attr0.a == attr1.a);
            assert(attr0.c == attr1.c);
            // these should not
            assert(attr0.b == attr0.b);
            assert(attr0.o == attr0.o);
        });
        it('should merge two attributes if they are both non-array objects', function() {
            model_prot._extend_deeply(attr0, attr1);
            assert(attr0.o.a == attr1.o.a);
        });
        it('should delete attributes not present in obj1 if prune is true', function() {
            model_prot._extend_deeply(attr0, attr1, true);
            assert(!('b' in attr0));
        });
        it('should not delete attributes absent present in obj1 if prune is falsey', function() {
            model_prot._extend_deeply(attr0, attr1);
            assert(attr0.o.a == attr1.o.a);
        });
    });
    describe('#save', function() {
        it('should save a new model to the database and update attributes with the new id', function() {
            var model0 = new Model();
            var model_name = 'testname0';
            model0.attributes = {
                name: model_name
            }
            model0.save();
            assert.ok(model0.attributes._id);
            assert.ok(model_name == model0.attributes.name);
        });
        it('should save changes to an existing model to the database', function(done) {
            var model0 = new Model();
            model0.attributes = {
                name: 'testname1'
            }
            model0.save();
            model0.set('x', 5);
            model0.save();
            var model1 = new Model();
            model1.id = model0.id;
            model1.fetch();
            setTimeout(function() {
                assert.ok(model1.attributes.x == 5);
                done()
            }, 200);
        });
    });
    describe('#fetch', function() {
        it('should retrieve attributes for this model id from the database', function(done) {
            var model0 = new Model();
            model0.set('x', 7);
            model0.save();
            var model1 = new Model();
            model1.id = model0.id;
            model1.fetch();
            setTimeout(function() {
                assert.ok(model1.attributes.x == 7);
                done();
            }, 200);
        });
    });
    describe('#attributes', function() {
        it('should be a plain object');
        it('should not change by reference if set to a different attributes hash');
    });
});
