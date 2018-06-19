const mongodb = require("../mongodb.connection");
const ObjectId = mongodb.ObjectId;

const applyAuditPost = (req, res, next) => {
  const user = req.session.passport.user;

  req.body.createdById = ObjectId(user._id);
  req.body.modifiedById = ObjectId(user._id);
  req.body.modifiedDate = new Date();

  next();
};

const applyAuditPut = (req, res, next) => {
  const user = req.session.passport.user;

  if (req.body.escrowInfo) {
    delete req.body.escrowInfo.createdById;
    delete req.body.escrowInfo.createdDate;
    req.body.escrowInfo.modifiedById = ObjectId(user._id);
    req.body.escrowInfo.modifiedDate = new Date();
  } else {
    delete req.body.createdById;
    delete req.body.createdDate;
    req.body.modifiedById = ObjectId(user._id);
    req.body.modifiedDate = new Date();
  }

  next();
};

module.exports = { applyAuditPost, applyAuditPut };
