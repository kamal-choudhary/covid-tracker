import React from "react";
import { Card, CardContent } from "@material-ui/core";
import numeral from "numeral";
import "./InfoBox.css";

const InfoBox = ({
  title,
  todayCases,
  total,
  handleClick,
  casesType,
  boxType,
}) => {
  const classesInfoBox = ["infoBox__card"];

  if (casesType === boxType) {
    classesInfoBox.push("active");
    if (boxType === "recovered") {
      classesInfoBox.pop();
      classesInfoBox.push("active-green");
    }
  }

  return (
    <div onClick={handleClick}>
      <Card className={classesInfoBox.join(" ")}>
        <CardContent>
          <div className="infoBox__heading">{title}</div>
          <div
            className={
              boxType === "recovered"
                ? "infoBox__big__number green"
                : "infoBox__big__number"
            }
          >
            {numeral(todayCases).format("+0.0a")}
          </div>
          <div className="infoBox__total">
            {numeral(total).format("0.0a")} Total
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoBox;
