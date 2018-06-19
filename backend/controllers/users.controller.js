const path = require("path");

// Services
const usersService = require("../services/users.service");
const emailsService = require("../services/emails.service");

// Utilities
const responses = require("../models/responses");
const writeEmail = require("../helpers/email.parser");
const utilityFuncs = require("../helpers/utilities.js");

const forgotPassword = (req, res) => {
  usersService
    .forgotPassword(req.body.email, req.body.tenantId)
    .then(response => {
      // Send email
      const name = {
        fName: response.person.firstName,
        lName: response.person.lastName,
        mName: response.person.middleName,
        pName: response.person.prefixName,
        sName: response.person.suffixName
      };

      const emailMap = {
        fullName: utilityFuncs.printName(name),
        tenantName: utilityFuncs.trimTrailingPeriod(response.tenantName),
        tenantDomain: process.env.TENANT_DOMAIN,
        resetToken: response.resetPasswordId
      };

      writeEmail(
        // filepath
        path.join(__dirname, "../emails/forgot.password.html"),
        //map object
        emailMap,
        //callback
        (text, html) => {
          const reset = {
            to: response.loginEmail,
            from: process.env.SUPERADMIN_EMAIL,
            subject: `Reset your SeQQure password`,
            text: text,
            html: html
          };

          emailsService
            .sendEmail(reset)
            // EMAIL success
            .then(() => {
              res.status(201).json(new responses.ItemResponse());
            })
            // EMAIL error
            .catch(err => {
              // Per SendGrid API: Extract error msg
              const { message, code } = err;
              console.log(err.toString());
              res.status(code).send(new responses.ErrorResponse(message));
            });
        }
      );
    })
    // POST error
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const confirmUserBeforeResetPassword = (req, res) => {
  usersService
    .confirmUserBeforeResetPassword(req.params.token)
    .then(response => res.status(201).send(new responses.SuccessResponse()))
    .catch(err => {
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const resetPassword = (req, res) => {
  usersService
    .resetPassword(req.params.token, req.model)
    .then(response => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

module.exports = {
  forgotPassword,
  confirmUserBeforeResetPassword,
  resetPassword
};
