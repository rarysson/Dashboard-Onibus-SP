<template>
    <div id="map-container" class="map-container">
        <slot />
    </div>
</template>

<script>
import L from "leaflet";
import { latLng } from "leaflet";

export default {
    name: "LMap",

    data() {
        return {
            map_object: null,
            map_options: {
                zoom: 12,
                maxZoom: 18,
                center: latLng(-23.5489, -46.6388), // Centro de São Paulo
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        };
    },

    mounted() {
        const map = L.map("map-container", {
            center: this.map_options.center,
            zoom: this.map_options.zoom
        });

        L.tileLayer(this.map_options.url, {
            maxZoom: this.map_options.maxZoom,
            attribution: this.map_options.attribution
        }).addTo(map);

        this.map_object = map;
    }
};
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.map-container {
    height: 65vh;
    margin: 10px 0;
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    overflow: hidden;
}
</style>
