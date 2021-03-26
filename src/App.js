import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Card,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";
import Map from "./Map";

import "./App.css";

function App() {
  const [country, setCountry] = useState("worldwide");
  const [countries, setCountries] = useState([]);
  const [tableCountries, setTableCountries] = useState([]);

  const [countryInfo, setCountryInfo] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((d) => d.countryInfo.iso2 !== null);
        setTableCountries(filteredData);
        setCountries(filteredData);
      });
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(e.target.value);

    const url =
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        } else {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);
        }
      });
  };

  const infoBoxClickHandler = (name) => {
    setCasesType(name);
  };

  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          <FormControl>
            <Select
              className="app__dropdown"
              variant="outlined"
              value={country}
              onChange={(e) => onCountryChange(e)}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.countryInfo.iso2}>
                  {country.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="CoronaVirus Cases"
            todayCases={countryInfo.todayCases}
            total={countryInfo.cases}
            handleClick={() => infoBoxClickHandler("cases")}
            boxType="cases"
            casesType={casesType}
          />
          <InfoBox
            title="Recovered"
            todayCases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
            handleClick={() => infoBoxClickHandler("recovered")}
            boxType="recovered"
            casesType={casesType}
          />
          <InfoBox
            title="Deaths"
            todayCases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
            handleClick={() => infoBoxClickHandler("deaths")}
            boxType="deaths"
            casesType={casesType}
          />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={countries}
          casesType={casesType}
          selectedCountry={country}
        />
      </div>

      <Card className="app__right">
        <Typography>Live Cases by Country</Typography>
        <Table countries={tableCountries} />
        <Typography style={{ marginTop: "20px", marginBottom: "20px" }}>
          Worldwide New Cases
        </Typography>
        <LineGraph casesType={casesType} />
      </Card>
    </div>
  );
}

export default App;
