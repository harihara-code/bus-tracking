import axios from "axios";

const SEARCH_ROUTE_URL =
    "https://mobilegatewayapi.mtcbusits.in/passangermobileapi/WebAPI/SearchRoute_v2";

const GET_ROUTE_DETAILS_URL =
    "https://mobilegatewayapi.mtcbusits.in/passangermobileapi/WebAPI/SearchByRouteDetails_v4";

const VEHICLE_DETAILS_URL =
    "https://mobilegatewayapi.mtcbusits.in/passangermobileapi/WebAPI/VehicleTripDetails_v2";

var isRunning = false;

let busLiveLocations = [];

export function getBusLocations() {
    return busLiveLocations;
}

function fetchBusLiveLocations() {
    if (isRunning) {
        console.log("already running");
        return;
    } else {
        searchRoutes("51A")
        .then(processAvailableRoutes)
        .catch(error => {
            isRunning = false;
            console.error("ERROR:", error);
        });
    }
}

function searchRoutes(searchText) {
    return axios.post(
        SEARCH_ROUTE_URL,
        {
            routetext: searchText
        }
    );
}

function processAvailableRoutes(response) {
    const routesData = response.data.data;

    const routeIds = [];

    routesData.forEach(routeData => {
        const routeId = routeData.routeid;

        if (!routeIds.includes(routeId)) {
            routeIds.push(routeId);
        }
    });

    fetchRoutesDetailsAndProcess(routeIds);
}

function fetchRoutesDetailsAndProcess(routeIds) {
    Promise.all(
        routeIds.map(routeId => {
            return axios.post(
                GET_ROUTE_DETAILS_URL,
                {
                    routeid: routeId,
                    servicetypeid: 0
                }
            );
        })
    )
    .then(processRoutesDetails)
    .catch(error => {
        isRunning = false;
        console.error("Route details ERROR:", error);
    });
}

function processRoutesDetails(responses) {
    const vehicleIds = [];

    responses.forEach(response => {

        response.data.up.data.forEach(routeDetails => {
            routeDetails.vehicleDetails.forEach(vehicleData => {

                const vehicleId = vehicleData.vehicleid;

                if (!vehicleIds.includes(vehicleId)) {
                    vehicleIds.push(vehicleId);
                }
            });
        });

        response.data.down.data.forEach(routeDetails => {
            routeDetails.vehicleDetails.forEach(vehicleData => {

                const vehicleId = vehicleData.vehicleid;

                if (!vehicleIds.includes(vehicleId)) {
                    vehicleIds.push(vehicleId);
                }
            });
        });
    });

    fetchVehicleDetails(vehicleIds);
}

function fetchVehicleDetails(vehicleIds) {
    // console.log("vehicleIds: ", vehicleIds);
    Promise.all(
        vehicleIds.map(vehicleId => {
            return axios.post(
                VEHICLE_DETAILS_URL,
                {
                    vehicleId,
                    servicetypeid: 0
                }
            );
        })
    )
    .then(responses => {
        var latestBusLiveLocations = [];

        responses.forEach(response => {
            latestBusLiveLocations.push(response.data.LiveLocation[0]);
        });

        busLiveLocations = latestBusLiveLocations;
    })
    .catch(error => {
        isRunning = false;
        console.error("Vehicle details ERROR:", error);
    });
}

export function startBusLocationService() {
    setInterval(fetchBusLiveLocations, 2000);
}