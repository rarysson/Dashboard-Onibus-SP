<template>
    <div style="display: none;"></div>
</template>

<script>
import L from "leaflet";
import LM from "leaflet.markercluster";

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
        this.marker_cluster = new LM.MarkerClusterGroup(this.options);
    },

    methods: {
        set_markers_data(markersData) {
            markersData.forEach(data => {
                const marker = L.marker(data.position, {
                    icon: this.markersIcon
                }).bindPopup(data.text);

                this.marker_cluster.addLayer(marker);
                this.markers.push(marker);
            });

            this.$emit("cluster-created");
        }
    }
};
</script>
