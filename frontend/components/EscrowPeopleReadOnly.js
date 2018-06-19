import React from "react";

const EscrowPeopleList = ({ people, handleShowPersonCard }) => {
  return people
    ? people.map((personObj, index) => {
        return (
          <tr key={index}>
            <td>{personObj.securityRole && personObj.securityRole.name}</td>
            {personObj.person && personObj.person.firstName ? (
              <td
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={e => handleShowPersonCard(e, personObj)}
              >
                {`${personObj.person.firstName} ${personObj.person.lastName}`}
              </td>
            ) : (
              <td />
            )}
          </tr>
        );
      })
    : null;
};

export default EscrowPeopleList;
