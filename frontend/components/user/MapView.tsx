import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export const Map = ({ 
  driverLocation, 
  customerLocation 
}: { 
  driverLocation: { lat: number; lng: number } | null;
  customerLocation: { lat: number; lng: number } | null;
}) => {
  const mapStyles = {
    height: "200px",
    width: "100%",
  };

  if (!customerLocation) {
    return <div>Loading map...</div>;
  }

  const defaultCenter = {
    lat: customerLocation.lat,
    lng: customerLocation.lng,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
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
    </LoadScript>
  );
}