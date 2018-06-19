import React from "react";
import { Modal } from "react-bootstrap";

function PersonCard({ personObj, showPersonCard, handleHidePersonCard }) {
  return (
    <React.Fragment>
      <div>
        <Modal
          show={showPersonCard}
          onHide={handleHidePersonCard}
          aria-labelledby="contained-modal-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-sm" />
          </Modal.Header>
          <Modal.Body>
            <div className="containter-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="carousel fade profile-carousel">
                    <div className="carousel-inner">
                      <div className="item active">
                        <img
                          src="../../../assets/img/s1.jpg"
                          alt="person cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 profile-pic">
                    <img
                      src={
                        personObj.person && personObj.person.fileKey
                          ? `https://${
                              process.env.REACT_APP_S3_PUBLIC
                            }.s3.amazonaws.com/${personObj.person.fileKey} `
                          : "http://www.udayanschoolgor.edu.bd/uploads/avatar_icon.jpg"
                      }
                      alt={
                        personObj.person &&
                        `${personObj.person.firstName} ${
                          personObj.person.lastName
                        }`
                      }
                    />
                  </div>
                  <div className="col-sm-6">
                    <h1>
                      {personObj.person && personObj.person.firstName}{" "}
                      <span className="semi-bold">
                        {personObj.person && personObj.person.lastName}
                      </span>
                      <br />
                      <small>
                        {" "}
                        {personObj.securityRole && personObj.securityRole.name}
                      </small>
                    </h1>

                    <ul className="list-unstyled">
                      {personObj.person && personObj.person.phoneNumber ? (
                        <li>
                          <p className="text-muted">
                            <i className="fa fa-phone" />&nbsp;&nbsp;<span className="txt-color-darken">
                              {personObj.person.phoneNumber}
                            </span>
                          </p>
                        </li>
                      ) : null}
                      <li>
                        <p className="text-muted">
                          <i className="fa fa-envelope" />&nbsp;&nbsp;<a href="mailto:simmons@smartadmin">
                            {personObj.person && personObj.person.publicEmail}
                          </a>
                        </p>
                      </li>
                    </ul>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
}

export default PersonCard;
