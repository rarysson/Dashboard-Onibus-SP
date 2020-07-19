<template>
    <div style="display: none;"></div>
</template>

<script>
import L from "leaflet";

export default {
    name: "LMarker",

    props: {
        markerIcon: {
            type: Object,
            required: true
        },

        markerData: Object,

        mapObject: Object
    },

    data() {
        return {
            marker: null
        };
    },

    mounted() {
        if (this.markerData) {
            this.set_marker_data(this.markerData, this.mapObject);
        }
    },

    methods: {
        set_marker_data(data, map_object) {
            this.marker = L.marker(L.latLng(data.py, data.px), {
                icon: this.markerIcon
            }).bindPopup(data.text);

            this.marker.addTo(map_object);
        }
    }
};
</script>
