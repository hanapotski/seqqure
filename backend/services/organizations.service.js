const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
  readAll: readAll,
  readById: readById,
  create: create,
  update: update,
  delete: _delete
};

function readAll() {
  return conn
    .db()
    .collection("Organizations")
    .find()
    .toArray()
    .then(organizations => {
      if (organizations) {
        return organizations.map(item => {
          item._id = item._id.toString();
          return item;
        });
      }
      // If none found, return null
      return null;
    });
}

function readById(id) {
  return conn
    .db()
    .collection("Organizations")
    .findOne({ _id: ObjectId(id) })
    .then(organization => {
      if (organization) {
        organization._id = organization._id.toString(); // convert ObjectId back to string
      }
      return organization;
    });
}

function create(model) {
  return conn
    .db()
    .collection("Organizations")
    .insert(model)
    .then(result => result.insertedIds[0].toString()); // "return" generated Id as string
}

function update(id, doc) {
  // convert string id used outside of MongoDB into ObjectId needed by MongoDB
  doc._id = ObjectId(doc._id);

  return conn
    .db()
    .collection("Organizations")
    .updateOne({ _id: ObjectId(id) }, { $set: doc })
    .then(result => Promise.resolve()); // "return" nothing
}

function _delete(id) {
  return conn
    .db()
    .collection("Organizations")
    .deleteOne({ _id: ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
}
