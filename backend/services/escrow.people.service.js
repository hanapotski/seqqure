const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

module.exports = {
  readAll,
  search,
  create,
  update,
  _delete
};

function readAll(escrowId) {
  const id = ObjectId(escrowId);
  return conn
    .db()
    .collection("escrowPeople")
    .aggregate([
      {
        $match: {
          escrowId: id
        }
      },
      {
        $lookup: {
          from: "people",
          localField: "personId",
          foreignField: "_id",
          as: "person"
        }
      }
    ])
    .toArray()
    .then(people => {
      if (people) {
        return people.map(item => {
          item.createdDate = item._id.getTimestamp();
          item._id = item._id.toString();

          return item;
        });
      }
      // If none found, return null
      return null;
    });
}

function search(name, id) {
  return conn
    .db()
    .collection("people")
    .aggregate()
    .match({
      tenantId: ObjectId(id),
      $or: [
        { firstName: new RegExp(name, "i") },
        { lastName: new RegExp(name, "i") }
      ]
    })
    .toArray();
}

function create(model) {
  model.personId = ObjectId(model.personId);
  model.escrowId = ObjectId(model.escrowId);

  return conn
    .db()
    .collection("escrowPeople")
    .insert(model)
    .then(result => result.insertedIds[0].toString()); // "return" generated Id as string
}

function update(id, doc) {
  // convert string id used outside of MongoDB into ObjectId needed by MongoDB
  doc._id = ObjectId(doc._id);
  doc.escrowId = ObjectId(doc.escrowId);
  doc.personId = ObjectId(doc.personId);
  doc.securityRoleId = ObjectId(doc.securityRoleId);

  return conn
    .db()
    .collection("escrowPeople")
    .updateOne({ _id: ObjectId(id) }, { $set: doc })
    .then(result => Promise.resolve()); // "return" nothing
}

function _delete(id) {
  return conn
    .db()
    .collection("escrowPeople")
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => Promise.resolve()); // "return" nothing
}
