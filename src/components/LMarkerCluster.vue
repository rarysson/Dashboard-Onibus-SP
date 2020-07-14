<template>
    <div style="display: none;"></div>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster";

export default {
    name: "LMarkerCluster",

    props: ["markersIcon", "options"],

    data() {
        return {
            markers: [],
            marker_cluster: null
        };
    },

    mounted() {
        this.marker_cluster = L.markerClusterGroup(this.options);
    },

    methods: {
        set_markers_data(markers_data, bind_text = true) {
            console.time("marker data for");
            markers_data.forEach(data => {
                let marker = L.marker(L.latLng(data.py, data.px), {
                    icon: this.markersIcon
                });

                if (bind_text) {
                    marker.bindPopup(data.text);
                }

                this.markers.push(marker);
            });
            console.timeEnd("marker data for");

            console.time("adding layers");
            this.marker_cluster.addLayers(this.markers);
            console.timeEnd("adding layers");

            this.$emit("cluster-created");
        }
    }
};
</script>
