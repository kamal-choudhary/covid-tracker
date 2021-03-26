import React, { useEffect, useRef } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  useMap,
  Circle,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { Typography } from "@material-ui/core";
import { printPrettyStat } from "./util";

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

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const Map = ({
  center,
  zoom,
  countries,
  selectedCountry,
  casesType = "cases",
}) => {
  const markerRef = useRef([]);
  markerRef.current = [];

  const addToRefs = (el, iso2) => {
    if (el && !markerRef.current.includes(el)) {
      markerRef.current.push({
        refIso2: iso2,
        element: el,
      });
    }
  };

  useEffect(() => {
    if (markerRef.current.length > 0 && selectedCountry !== "worldwide") {
      markerRef.current.forEach((markRef) => {
        if (markRef.refIso2 === selectedCountry) {
          markRef.element.openPopup();
        }
      });
    }
    return function cleanup() {
      markerRef.current.forEach((markRef) => {
        markRef.element.closePopup();
      });
    };
  }, [markerRef, selectedCountry]);

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom} scrollWheelZoom={true}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {countries.map((country) => (
          <Circle
            ref={(el) => addToRefs(el, country.countryInfo.iso2)}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            radius={
              Math.sqrt(country[casesType]) * mapData[casesType].multiplier
            }
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
              <img
                src={country.countryInfo.flag}
                className="map__marker-flag"
              ></img>
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
        ))}
      </LeafletMap>
    </div>
  );
};

export default Map;
