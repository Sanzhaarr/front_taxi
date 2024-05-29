import { map } from "./init_map.js";
import { Marker } from "./get_marker_class.js";
import { getCurrentPosition } from "./validate_user_current_location_final.js";
// import { startMarker, endMarker, limitMarkers } from "./create_marker.js";
// import { deleteMarker } from "./delete_marker.js";
// import { getCurrentPosition } from "./get_current_position.js";
// import { startTrackingLocation } from "./get_position.js";

const startDeleteButton = document.getElementById("start-delete");
const endDeleteButton = document.getElementById("end-delete");
// const get_current_position = document.getElementById('get_current_position');
// const get_start_tracking_location = document.getElementById('get_start_tracking_location');

function limitMarkers(newLatLng) {
    if (!Marker.get_start_marker()) {
        Marker.set_start_marker(newLatLng);
    } else if (!Marker.get_end_marker()){
        Marker.set_end_marker(newLatLng);
    } else {
        console.warn('Максимальное количество маркеров: 2');
    }

    if (Marker.get_start_marker() && Marker.get_end_marker()) {
        Marker.updateRoute();
    }
}

map.addListener('click', function(e) {
    limitMarkers(e.latLng);
    // getAddressFromLatLng(e.latLng);
});

startDeleteButton.addEventListener("click", function() {
    if (Marker.get_start_marker()) {
        Marker.delete_marker_and_clear_route_path("startMarker");
        // deleteMarker("startMarker");
    }
});

endDeleteButton.addEventListener("click", function() {
    if (Marker.get_end_marker()) {
        Marker.delete_marker_and_clear_route_path("endMarker");
        // deleteMarker("endMarker");
    }
});

const getLocationButtons = document.querySelectorAll('.get_location');

getLocationButtons.forEach(button => {
    button.addEventListener('click', function() {
        const check = button.id.includes('start') ? 'startMarker' : 'endMarker';
        getCurrentPosition(check);
    });
});

export function check_button(userPos, check) {
    if (check === "startMarker") {
        if (Marker.start_marker) {
            // Marker.delete_marker(check);
            Marker.set_start_marker_position(userPos);
        }
        Marker.set_start_marker(userPos);
    } else if (check === "endMarker") {
        if (Marker.end_marker) {
            // Marker.delete_marker(check);
            Marker.set_end_marker_position(userPos);
        }
        Marker.set_end_marker(userPos);
    }
}