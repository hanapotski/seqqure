const mongodb = require("../mongodb.connection");
const conn = mongodb.connection;
const ObjectId = mongodb.ObjectId;

const forgotPassword = (email, tenantId) => {
  const token = new ObjectId();
  return conn
    .db()
    .collection("users")
    .updateOne(
      { loginEmail: email, tenantId: ObjectId(tenantId) },
      { $set: { resetPasswordId: token } }
    )
    .then(() => {
      return conn
        .db()
        .collection("users")
        .aggregate()
        .match({ loginEmail: email, tenantId: ObjectId(tenantId) })
        .lookup({
          from: "people",
          localField: "personId",
          foreignField: "_id",
          as: "person"
        })
        .lookup({
          from: "tenants",
          localField: "tenantId",
          foreignField: "_id",
          as: "tenant"
        })
        .unwind("$person")
        .unwind("$tenant")
        .project({
          loginEmail: 1,
          tenantName: "$tenant.tenantName",
          resetPasswordId: 1,
          person: 1
        })
        .toArray()
        .then(response => {
          return response[0];
        })
        .catch(err => Promise.reject(err));
    });
};

const confirmUserBeforeResetPassword = token => {
  return conn
    .db()
    .collection("users")
    .findOne({ resetPasswordId: ObjectId(token) })
    .then(result => {
      return result;
    });
};

const resetPassword = (token, data) => {
  return conn
    .db()
    .collection("users")
    .updateOne(
      { resetPasswordId: ObjectId(token) },
      { $set: data, $unset: { resetPasswordId: 1 } }
    )
    .then(result => Promise.resolve());
};

module.exports = {
  forgotPassword,
  confirmUserBeforeResetPassword,
  resetPassword
};
