const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

const readAll = () => {
  return conn
    .db()
    .collection("tenants")
    .find()
    .sort({ tenantName: 1 })
    .toArray()
    .then(tenants => {
      if (tenants) {
        return tenants.map(item => {
          item._id = item._id.toString();
          return item;
        });
      }
      // If none found, return null
      return null;
    });
};

const readById = id => {
  return conn
    .db()
    .collection("tenants")
    .findOne({ _id: ObjectId(id) })
    .then(tenant => {
      if (tenant) {
        tenant._id = tenant._id.toString(); // convert ObjectId back to string
      }
      return tenant;
    });
};

const create = model => {
  return conn
    .db()
    .collection("tenants")
    .insert(model)
    .then(result => result.insertedIds[0].toString()); // "return" generated Id as string
};

const update = (id, doc) => {
  // convert string id used outside of MongoDB into ObjectId needed by MongoDB
  doc._id = ObjectId(doc._id);

  return conn
    .db()
    .collection("tenants")
    .updateOne({ _id: ObjectId(id) }, { $set: doc })
    .then(result => Promise.resolve()); // "return" nothing
};

const _delete = id => {
  return conn
    .db()
    .collection("tenants")
    .deleteOne({ _id: ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
};

module.exports = {
  readAll,
  readById,
  create,
  update,
  delete: _delete
};
