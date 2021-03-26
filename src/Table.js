import React from "react";
import {
  Table as TableEl,
  TableBody,
  TableCell,
  TableRow,
  Card,
} from "@material-ui/core";
import { printPrettyStat } from "./util";
import "./Table.css";

const Table = ({ countries }) => {
  return (
    <div className="table__div">
      <TableEl className="table__element">
        <TableBody>
          {countries.map((country) => (
            <TableRow className="table__row">
              <TableCell>{country.country}</TableCell>
              <TableCell>{printPrettyStat(country.cases)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableEl>
    </div>
  );
};

export default Table;
