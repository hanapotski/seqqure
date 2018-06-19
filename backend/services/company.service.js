const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;
const bucket = process.env.S3_PUBLIC;

const readAll = tenantId => {
  const id = ObjectId(tenantId);
  return conn
    .db()
    .collection("tenants")
    .find({ _id: id })
    .toArray()
    .then(tenant => {
      tenant[0]._id = tenant[0]._id.toString();
      return conn
        .db()
        .collection("people")
        .aggregate()
        .match({
          tenantId: id,
          $or: [
            { roles: ObjectId("5ae0d3a4473c5a271075dab2") },
            { roles: ObjectId("5ae0d3e4473c5a271075dab3") },
            { roles: ObjectId("5af77a322b3f750498fe6d0c") }
          ]
        })
        .map(item => {
          if (item.fileKey) {
            item.fileKey = `https://${bucket}.s3.amazonaws.com/${item.fileKey}`;
          }

          return item;
        })
        .toArray()
        .then(people => {
          tenant[0].employees = people;
          return tenant;
        });
    });
};

const update = (tenantId, doc) => {
  const id = ObjectId(tenantId);

  return conn
    .db()
    .collection("tenants")
    .updateOne({ _id: id }, { $set: doc })
    .then(result => Promise.resolve());
};

module.exports = {
  readAll,
  update
};
