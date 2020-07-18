import { latLng } from "leaflet";

function contains_point_on_circle(circle, radius, point) {
    return Math.abs(circle.distanceTo(latLng(point.y, point.x))) <= radius;
}

export default contains_point_on_circle;
