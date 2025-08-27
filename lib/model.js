// This is the base definition for a model / collection
// ideally used as a wrapper for database integration
// should use promise objects to allow for method chaining
// eventful.  emits ready event passing itself
// start with mongodb
import util from 'util';
import controller_base from './controller.js';
// var controller_base = require('./controller.js');
// var util = require('util');

/** TODO: what persistence methods does a model need?
 *  save/post => saves record to db
 *  fetch/get => updates model from database
 *  patch/put(?) => only changes specific methods and saves to database...
 *  destroy/delete => remove model from db
 *
 ** On Constructor:
 *
 *  get => get a single model by id
 *  find => get a collection of models by parameters
 */
/** TODO: define a collection
 *
 *  will likely want to put collection constructor as attribute on Model
 *  f/e Model.Collection
 *
 ** Persistence methods:
 *
 *  save/post => save collection in database by batch command
 *      will want to minimize number of db requests, but can probably
 *      start with saving each individually for now
 *  fetch/get => updates collection from database
 *      a collection should have a saved query attribute which
 *      was used to get the collection.  Will make updating easy.
 */

// init references to model base objects for use by controllers
// and models
controller_base.prototype.models = {};
Model.prototype.models = {};

var model_prot = Model.prototype;
var db;

var NAME_REQUIRED_ERROR = function() {
    return new Error(
        'FATAL ERROR::: Named function required for Model constructor method'
    );
}

export default function Model(){
};

Model.extend = function(constructor) {
    //console.log('extending', constructor.name);
    if ( !constructor.name ) throw NAME_REQUIRED_ERROR();
    //model_proto = model_proto || new Model();
    constructor.prototype.__proto__ = model_prot;

    // TODO: bind collection-specific methods to the constructor
    //Model.set_db_access_methods(contructor);

    // make models available to controller and other models
    Model.prototype.models[constructor.name] = constructor;
    controller_base.prototype.models[constructor.name] = constructor;

};
Model.set_connector = function(DBConnector, config) {
  if (!config) {
    this.prototype.connector = DBConnector;
  } else {
    this.prototype.connector = new DBConnector(config);
  }
};
Model.set_db_access_methods = function(constructor) {
    constructor.find = Model.find;
};
Model.find = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return this.connector.find.apply(connector, args);
};

Object.defineProperty(Model.prototype, 'id', {
    get: function() {
        return this.attributes[this.id_attribute];
    },
    set: function(new_val) {
        this.set(this.id_attribute, new_val);
        return new_val;
    }
});
Object.defineProperty(Model.prototype, 'attributes', {
    get: function() {
        if (!this._attributes) this._attributes = {};
        return this._attributes;
    },
    set: function(new_val) {
        if (typeof new_val != 'object' && util.isArray(new_val))
            throw 'Model#attributes cannot be set to non-object or array value';
        this._extend_deeply(this.attributes, new_val, true);
        return this.attributes;
    }
});
Model.prototype.id_attribute = '_id';
Model.prototype.is_model = true;
/**
 * returns the name of the collection or table in the db.
 * override this by setting collection attribute on the model.
 */
Model.prototype._collection_name = function() {
    return this.collection || this.constructor.name;
};
/**
 * pointer to the database connector
 */
Model.prototype.connector = {};

Model.prototype.save = function() {
    // this should create the model if it does not exist
    // (uses an id to check existence)
    // or it should update the model
    if (this.id) return this.connector.put(this);
    return this.connector.post(this);
};
Model.prototype.fetch = function() {
    if (!this.id) throw 'cannot fetch model with id: ' + this.id.toString();
    return this.connector.get(this);
    // TODO: give model backbone-like sync event
};
/*
Model.prototype.patch = function() {
    // should try to update the model's changed attributes if no
    // arguments given. Otherwise should attempt to set attributes
    // on model and then update
    Model.connector.update(this);
};
*/
Model.prototype.destroy = function() {
    // should delete the model from the database if it has been
    // persisted
    if (this.id) return false;
    this.connector.delete(this);
};
Model.prototype.set = function(attr, val) {
    this.attributes[attr] = val;
};
/**
 * merge a hash of attributes into the current set
 */
Model.prototype._merge_attributes = function(attr) {
    this._extend_deeply(this.attributes, attr);
};
Model.prototype._extend_deeply = function(obj0, obj1, should_prune) {
    if (typeof obj0 != 'object' || typeof obj1 != 'object' ||
            util.isArray(obj0) || util.isArray(obj1))
        throw 'Attempting to extend a non-object entity';
    for(var key in obj1) {
        if (typeof obj0[key] == 'object' && typeof obj1[key] == 'object' && !util.isArray(obj0[key]))
            this._extend_deeply(obj0[key], obj1[key], should_prune);
        else obj0[key] = obj1[key];
    }
    if (!should_prune) return;
    for (key in obj0) {
        if (key in obj1) continue;
        delete obj0[key];
    }
};
