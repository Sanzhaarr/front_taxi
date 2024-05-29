import { map } from "./init_map.js";
import { getAddressFromLatLng, updateInputValue } from "./get_address_from_latlng.js";
import { fetchRouteData } from "./get_path_route_final.js";
import { fetchGetFareCurrentUserOrder } from "./get-fare-current-user-order_final.js";
import { showPopup, hidePopup } from "../../static_functions/display_popup.js";
import { startInput, endInput } from "./autocomplete_input.js";


class MarkerFunction {
    constructor(map) {
        this.map = map;
        this.start_marker = null;
        this.end_marker = null;
        this.icon_options = {
            startMarker: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#a3c2c2',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 8
            },
            endMarker: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#0a4f6b',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 8
            }
        };
        this.route_path = null;
    }
    
    create_marker(position, type) {
        const marker = new google.maps.Marker({
            position: position,
            map: this.map,
            draggable: true,
            icon: this.icon_options[type]
        });

        google.maps.event.addListener(marker, 'dragend', () => {
            getAddressFromLatLng(marker.getPosition(), type, updateInputValue);
        });

        return marker;
    }

    delete_marker(type) {
        if (type === "startMarker") {
            this.start_marker.setMap(null);
            this.start_marker = null;
            startInput.value = "";
            if (this.end_marker) {
                this.map.panTo(this.end_marker.getPosition());
            }
        } else if (type === "endMarker") {
            this.end_marker.setMap(null);
            this.end_marker = null;
            endInput.value = "";
            if (this.start_marker) {
                this.map.panTo(this.start_marker.getPosition());
            }
        }
    }

    delete_marker_and_clear_route_path(type) {
        this.delete_marker(type);

        if (this.route_path) {
            this.clear_route_path();
            // this.route_path.setMap(null);
        }
    }

    // delete_marker_and_clear_route_path(type) {
    //     if (type === "startMarker") {
    //         this.start_marker.setMap(null);
    //         this.start_marker = null;
    //     } else if (type === "endMarker") {
    //         this.end_marker.setMap(null);
    //         this.end_marker = null;
    //     }

    //     if (this.route_path) {
    //         this.clear_route_path();
    //         // this.route_path.setMap(null);
    //     }
    // }

    clear_route_path() {
        if (this.route_path) {
            this.route_path.setMap(null);
            this.route_path = null;
        }
        // this.route_path.setMap(null);
    }

    display_route(route_coordinates) {
        if (this.route_path) {
            this.clear_route_path();
        }
    
        this.route_path = new google.maps.Polyline({
            path: route_coordinates,
            geodesic: true,
            strokeColor: '#3887be',
            strokeOpacity: 0.75,
            strokeWeight: 6
        });

        this.route_path.setMap(this.map);
        
        const bounds = new google.maps.LatLngBounds();
        route_coordinates.forEach(point => bounds.extend(point));
        this.map.fitBounds(bounds);
    
        const pickupLocation = {
            coordinates: [this.start_marker.getPosition().lat(), this.start_marker.getPosition().lng()]
        };
        const destination = {
            coordinates: [this.end_marker.getPosition().lat(), this.end_marker.getPosition().lng()]
        };
    
        fetchGetFareCurrentUserOrder(pickupLocation, destination);
    }

    get_start_marker() {
        return this.start_marker;
    }
    
    set_start_marker(position) {
        if (this.start_marker) {
            this.delete_marker("startMarker");
        }

        // if (this.start_marker) {
        //     this.start_marker.setMap(null);
        // }

        this.start_marker = this.create_marker(position, "startMarker");
        getAddressFromLatLng(this.start_marker.getPosition(), "startMarker", updateInputValue);
        this.map.panTo(this.start_marker.position);
        this.updateRoute();

        // start_marker = new google.maps.Marker({
        //     position: position,
        //     map: map,
        //     draggable: true,
        //     icon: {
        //         path: google.maps.SymbolPath.CIRCLE,
        //         fillColor: '#a3c2c2',
        //         fillOpacity: 1,
        //         strokeWeight: 0,
        //         scale: 8
        //     }
        // });
    }

    get_end_marker() {
        return this.end_marker;
    }

    set_end_marker(position) {
        if (this.end_marker) {
            this.delete_marker("endMarker");
        }
        
        // if (this.end_marker) {
        //     this.end_marker.setMap(null);
        // }

        this.end_marker = this.create_marker(position, "endMarker");
        getAddressFromLatLng(this.end_marker.getPosition(), "endMarker", updateInputValue);
        this.map.panTo(this.end_marker.position);
        this.updateRoute();

        // end_marker = new google.maps.Marker({
        //     position: position,
        //     map: map,
        //     draggable: true,
        //     icon: {
        //         path: google.maps.SymbolPath.CIRCLE,
        //         fillColor: '#0a4f6b',
        //         fillOpacity: 1,
        //         strokeWeight: 0,
        //         scale: 8
        //     }
        // });
    }

    updateRoute() {
        if (this.start_marker && this.end_marker) {
            const route = fetchRouteData(this.start_marker.position, this.end_marker.position)
            this.display_route(route);
            // fetchRouteData(this.start_marker.position, this.end_marker.position);
            showPopup();
        } else {
            hidePopup();
        }
    }

    set_start_marker_position(position) {
        this.start_marker.position = position;
    }

    set_end_marker_position(position) {
        this.end_marker.position = position;
    }

    // get start_marker() {
    //     return this._start_marker;
    // }

    // set start_marker(marker) {
    //     this._start_marker = marker;
    // }

    // get end_marker() {
    //     return this._end_marker;
    // }

    // set end_marker(marker) {
    //     this._end_marker = marker;
    // }
}

const Marker = new MarkerFunction(map);

export { Marker };