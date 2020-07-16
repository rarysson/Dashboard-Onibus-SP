<template>
    <div style="display: none;"></div>
</template>

<script>
import L from "leaflet";

export default {
    name: "LMarker",

    props: ["markerIcon", "markerData", "mapObject"],

    data() {
        return {
            marker: null
        };
    },

    mounted() {
        this.marker = L.marker(
            L.latLng(this.markerData.py, this.markerData.px),
            {
                icon: this.markerIcon
            }
        ).bindPopup(this.markerData.text);

        this.marker.addTo(this.mapObject);
    }
};
</script>
