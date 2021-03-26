import React from "react";
import { Circle, Popup } from "react-leaflet";
import { Typography } from "@material-ui/core";
import numeral from "numeral";

const mapData = {
  cases: {
    hex: "#CC1034",
    selected: "#000000",
    multiplier: 150,
  },
  recovered: {
    hex: "#7dd71d",
    selected: "#000000",
    multiplier: 100,
  },
  deaths: {
    hex: "#fb4443",
    selected: "#000000",
    multiplier: 400,
  },
};

export const sortData = (dataToBeSorted) => {
  return dataToBeSorted.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
};

export const printPrettyStat = (number) => {
  return numeral(number).format("0,0");
};

export const buildMap = (
  countries,
  casesType = "cases",
  selectedCountry = "US"
) => {
  return countries.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      radius={Math.sqrt(country[casesType]) * mapData[casesType].multiplier}
      pathOptions={{
        color:
          country.countryInfo.iso2 === selectedCountry
            ? mapData[casesType].selected
            : mapData[casesType].hex,
        fillColor:
          country.countryInfo.iso2 === selectedCountry
            ? mapData[casesType].selected
            : mapData[casesType].hex,
        fillOpacity: "0.4",
      }}
    >
      <Popup className="map__popup">
        <img src={country.countryInfo.flag} className="map__marker-flag"></img>
        <Typography style={{ fontWeight: "bold" }}>
          {country.country}
        </Typography>
        <Typography>
          Cases: <span>{printPrettyStat(country.cases)}</span>
        </Typography>
        <Typography>
          Deaths: <span>{printPrettyStat(country.deaths)}</span>
        </Typography>
        <Typography>
          Recovered: <span>{printPrettyStat(country.recovered)}</span>
        </Typography>
      </Popup>
    </Circle>
  ));
};
