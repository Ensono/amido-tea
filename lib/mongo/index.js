var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    Q = require('q');

module.exports = Mongo;

function Mongo() {
    if (!(this instanceof Mongo)) {
        return new Mongo(arguments);
    }

    this.server = new Server('localhost', 27017, { auto_reconnect: true });
    this.db = new Db('amidotea', this.server);

    console.log('opening...')
    this.db.open(function(err, db) {
        if (err) {
            console.log('something went wrong opening the db: ' + err.message)
        }
    });
}

Mongo.prototype.createCollection = function(collection) {
    var deferred = Q.defer();

    this.db.collection(collection, {strict:true}, function(err, collection) {
        if (err) {

        }
    });

    return deferred.promise;
}

Mongo.prototype.getBrews = function(limit) {
    var deferred = Q.defer();

    this.db.collection('brews', function(err, collection) {
        if (err) {
            deferred.reject(err);
        } else {
            collection.find({}, {}, {limit: limit || -1}, function(err, item) {
                if (err) {
                    deferred.reject(err);
                } else {
                    console.log('found item ' + typeof item)
                    deferred.resolve(item);
                }
            })
        }
    });

    return deferred.promise;
}

Mongo.prototype.findById = function(id) {
    var deferred = Q.defer();

    this.db.collection('brewers', function(err, collection) {
        if (err) {
            deferred.reject(err);
        } else {
            collection.findOne( { 'user_id': id }, function(err, item) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(item);
                }
            })
        }
    });

    return deferred.promise;
}