import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";

export default function Table() {
  const [pointSummaries, setPointSummaries] = React.useState([]);

  useEffect(() => {
    getPointSummaries();
  }, []);

  const getPointSummaries = () => {
    const url = `${process.env.REACT_APP_API_URL}/reward/api/v1/pointSummary/getAll`;

    axios({
      url: url,
      method: "GET",
    })
      .then((res) => res.data)
      .then((data) => {
        setPointSummaries(data.data.ent.pointSummaries);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const refresh = () => {
    getPointSummaries();
  }

  return (
    <div>
      <table style={{border: '1px solid', borderCollapse: "collapse"}}>
        <thead>
          <tr>
            <th style={{border: '1px solid'}}>First Name</th>
            <th style={{border: '1px solid'}}>Last Name</th>
            <th style={{border: '1px solid'}}>Total Points</th>
            <th style={{border: '1px solid'}}>Monthly detail</th>
          </tr>
        </thead>
        <tbody>
          {pointSummaries.map((pointSummary) => (
            <tr key={pointSummary.customerId}>
              <td style={{border: '1px solid'}}>{pointSummary.customerFirstName}</td>
              <td style={{border: '1px solid'}}>{pointSummary.customerLastName}</td>
              <td style={{border: '1px solid'}}>{pointSummary.totalPoints}</td>
              <td style={{border: '1px solid'}}>
              {Object.entries(pointSummary.pointsPerMonth).map(([month, points]) => (
                <div key={month}>{`[${month}] ${points} points`}</div>
              ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{marginTop: 12}}>
        <Button onClick={refresh} variant="contained" disableElevation>Refresh</Button>
      </div>
    </div>
  );
}
