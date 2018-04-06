import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp`;

class MapView extends React.Component {
  static defaultProps = {
    defaultZoom: 15,
  }

  render() {
    const { children, defaultZoom, defaultCenter } = this.props;
    return (
      <GoogleMap defaultZoom={defaultZoom} defaultCenter={defaultCenter}>
        {children}
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `200px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(MapView);
