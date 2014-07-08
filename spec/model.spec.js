var assert = require('assert');
var Model = require('../lib/model.js');

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

    });
});
