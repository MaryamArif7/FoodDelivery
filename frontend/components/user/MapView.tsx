import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
 export default  Map=({ driverLocation, customerLocation })=>{
  const mapStyles = {
    height: "200px",
    width: "100%",
  };

  const defaultCenter = {
    lat: customerLocation.lat,
    lng: customerLocation.lng,
  };
  <LoadScript googleMapsApiKey="YOUR_API_KEY">
    <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
      <Marker
        position={customerLocation}
        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
        label="You"
      />

      {driverLocation && (
        <Marker
          position={driverLocation}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
          label="Driver"
        />
      )}
    </GoogleMap>
  </LoadScript>;
}
