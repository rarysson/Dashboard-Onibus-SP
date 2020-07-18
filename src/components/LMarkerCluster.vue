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
            markers_data.forEach(data => {
                let marker = L.marker(L.latLng(data.py, data.px), {
                    icon: this.markersIcon
                });

                if (bind_text) {
                    marker.bindPopup(data.text);
                }

                marker.on("click", () => {
                    this.$emit("click", data);
                });

                this.markers.push(marker);
            });

            this.marker_cluster.addLayers(this.markers);

            this.$emit("cluster-created");
        },

        reset_markers_data(markers_data, bind_text = true) {
            this.marker_cluster.removeLayers(this.markers);
            this.marker_cluster.refreshClusters();
            this.markers = [];

            this.set_markers_data(markers_data, bind_text);
        }
    }
};
</script>
