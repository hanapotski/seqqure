import React from "react";

// Constants
import { ROLE_EA } from "../constants";

const EscrowPeopleList = ({ people, confirmDelete, handleShowSearch }) => {
  return people
    ? people.map((personObj, index) => {
        return (
          <React.Fragment key={index}>
            <div className="row grid-item">
              <div className="col-xs-4 ">
                <img
                  src={
                    personObj.person && personObj.person.fileKey
                      ? `https://${
                          process.env.REACT_APP_S3_PUBLIC
                        }.s3.amazonaws.com/${personObj.person.fileKey} `
                      : "http://www.udayanschoolgor.edu.bd/uploads/avatar_icon.jpg"
                  }
                  alt={
                    personObj.person
                      ? `${personObj.person.firstName} ${
                          personObj.person.lastName
                        }`
                      : null
                  }
                  className="img-responsive"
                />
              </div>
              <div className="col-xs-8">
                {personObj.securityRole._id === ROLE_EA ? null : (
                  <div className="row">
                    <span
                      className="epDelete"
                      onClick={e => confirmDelete(index)}
                    >
                      x
                    </span>
                  </div>
                )}
                <div className="person">
                  <h4
                    onClick={
                      personObj.securityRole._id === ROLE_EA
                        ? null
                        : () => handleShowSearch(index, personObj.securityRole)
                    }
                  >
                    {personObj.person && personObj.person.firstName ? (
                      <strong className="name">{`${
                        personObj.person.firstName
                      } ${personObj.person.lastName}`}</strong>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleShowSearch(index, personObj.securityRole)
                        }
                      >
                        Assign a person
                      </button>
                    )}{" "}
                  </h4>

                  <span className="role">{personObj.securityRole.name}</span>
                </div>

                <div className="phone">
                  {personObj.person && personObj.person.phoneNumber ? (
                    <span>
                      <i className="fa fa-phone" />&nbsp;&nbsp;<span className="txt-color-darken">
                        {personObj.person.phoneNumber}
                      </span>
                    </span>
                  ) : null}
                </div>

                {personObj.person && personObj.person.publicEmail ? (
                  <React.Fragment>
                    <p href={`mailto:${personObj.person.publicEmail}`}>
                      <i className="fa fa-envelope email" />{" "}
                      {personObj.person && personObj.person.publicEmail}
                    </p>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </React.Fragment>
        );
      })
    : null;
};

export default EscrowPeopleList;
