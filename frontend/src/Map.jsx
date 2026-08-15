
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function Map({busesData}) {
  const position = [13.0827, 80.2707]; // Chennai

 const createBusIcon = (busNumber) => {
   return L.divIcon({
  className: "",
  html: `
    <div style="
      background: white;
      border: 1px solid black;
      width: 50px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: black;
    ">
      ${busNumber}
    </div>
  `,
  iconSize: [50, 30],
  iconAnchor: [25, 15],
});
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {busesData.map((busData, index) => {
        var busPosition = [];
        busPosition.push(Number(busData.latitude));
        busPosition.push(Number(busData.longitude)); 
        
        console.log(busPosition);
        return (<Marker position={busPosition} icon={createBusIcon(busData.routeno)}>
          <Popup>
               <strong>Route:</strong> {busData.routeno}
                <br />
                <strong>Vehicle Number:</strong> {busData.vehiclenumber}
                <br />
                <strong>Current Location:</strong> {busData.location}
          </Popup>
        </Marker>);
      })}
{/* <Marker
  position={[13.0827, 80.2707]}
  icon={createBusIcon("TEST")}
>
  <Popup>Test marker</Popup>
</Marker> */}
    </MapContainer>
  );
}

export default Map;