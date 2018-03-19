// TODO: remove this file

import React from "react";
import { geolocated, geoPropTypes } from "react-geolocated";

const getDirection = (degrees, isLongitude) =>
  degrees > 0 ? (isLongitude ? "E" : "N") : isLongitude ? "W" : "S";

// addapted from http://stackoverflow.com/a/5786281/2546338
const formatDegrees = (degrees, isLongitude) =>
  `${0 | degrees}° ${0 |
    (((degrees < 0 ? (degrees = -degrees) : degrees) % 1) * 60)}' ${0 |
    (((degrees * 60) % 1) * 60)}" ${getDirection(degrees, isLongitude)}`;

const config = {
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
};

class GeoLocation extends React.Component {
  render() {
    const { props } = this;
    return !props.isGeolocationAvailable ? (
      <div>{t("browserNotSupport")}</div>
    ) : !props.isGeolocationEnabled ? (
      <div>{t("geolocationIsNotEnabled")}</div>
    ) : props.coords ? (
      <div>
        You are at{" "}
        <span className="coordinate">
          {formatDegrees(props.coords.latitude, false)}
        </span>,{" "}
        <span className="coordinate">
          {formatDegrees(props.coords.longitude, true)}
        </span>
        {props.coords.altitude ? (
          <span>
            , approximately {props.coords.altitude} meters above sea level
          </span>
        ) : null}.
      </div>
    ) : (
      <div>Getting the location data&hellip;</div>
    );
  }
}

GeoLocation.propTypes = { ...geoPropTypes };

export default geolocated(config)(GeoLocation);
