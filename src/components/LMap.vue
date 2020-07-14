<template>
    <div id="map-container">
        <slot />
    </div>
</template>

<script>
import L from "leaflet";

export default {
    name: "LMap",

    props: ["options"],

    data() {
        return {
            map_object: null
        };
    },

    mounted() {
        const map = L.map("map-container", {
            center: this.options.center,
            zoom: this.options.zoom
        });

        L.tileLayer(this.options.url, {
            maxZoom: this.options.maxZoom,
            attribution: this.options.attribution
        }).addTo(map);

        this.map_object = map;
    }
};
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#map-container {
    height: 75vh;
    margin: 10px 0;
    border: 2px solid rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    overflow: hidden;
}
</style>
