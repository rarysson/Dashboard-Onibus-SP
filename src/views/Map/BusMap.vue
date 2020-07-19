<template>
    <b-container fluid>
        <bus-map-search
            @searching-data="toggle_overlay"
            @data-searched="toggle_overlay"
            @bus-searched="set_bus_data"
        />

        <b-row>
            <b-col cols="auto">
                <b-button
                    variant="primary"
                    size="sm"
                    :disabled="buses.length === 0"
                    @click="toggle_markers"
                >
                    <eye-icon-msg
                        :condition-var="showing_buses"
                        visible-message="Mostrar todos ônibus"
                        hidden-message="Ocultar todos ônibus"
                    />
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <b-overlay :show="show_overlay">
                    <l-map ref="map">
                        <l-marker-cluster
                            ref="cluster"
                            :markers-icon="icon"
                            :options="cluster_options"
                            @cluster-created="show_markers_on_map"
                        />
                    </l-map>
                </b-overlay>
            </b-col>
        </b-row>

        <distance-filter
            ref="distance_filter"
            :raw-data="buses"
            @get-map-object="set_child_map($refs.distance_filter)"
            @data-filtered="filter_data"
        />
    </b-container>
</template>

<script>
import L from "leaflet";
import EyeIconMsg from "@/components/EyeIconMsg";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import BusMapSearch from "@/components/BusMapSearch";
import DistanceFilter from "@/components/DistanceFilter";

export default {
    name: "BusMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster,
        BusMapSearch,
        DistanceFilter
    },

    data() {
        return {
            show_overlay: false,
            showing_buses: true,
            map: null,
            buses: [],

            icon: L.icon({
                iconUrl: require("@/assets/icons_map/bus.png"),
                iconSize: [30, 30]
            }),

            cluster_options: {
                chunkedLoading: true,
                chunkInterval: 100,
                disableClusteringAtZoom: 18
            }
        };
    },

    mounted() {
        this.map = this.$refs.map.map_object;
    },

    watch: {
        show_overlay() {
            this.$refs.map.$el.classList.toggle("hide-map");
        }
    },

    methods: {
        set_child_map(child) {
            child.set_map_object(this.map);
        },

        toggle_markers() {
            if (this.showing_buses) {
                this.hide_markers_on_map();
            } else {
                this.show_markers_on_map();
            }

            this.showing_buses = !this.showing_buses;
        },

        toggle_overlay() {
            this.show_overlay = !this.show_overlay;
        },

        show_markers_on_map() {
            this.map.addLayer(this.$refs.cluster.marker_cluster);
        },

        hide_markers_on_map() {
            this.map.removeLayer(this.$refs.cluster.marker_cluster);
        },

        set_bus_data(data) {
            const old_data = this.buses;

            if (this.buses.length !== 0) {
                this.hide_markers_on_map();
            }

            this.buses = data;

            if (old_data.length === 0) {
                this.$refs.cluster.set_markers_data(this.buses, false);
            } else {
                this.$refs.cluster.reset_markers_data(this.buses, false);
            }
        },

        filter_data(data) {
            this.hide_markers_on_map();
            this.$refs.cluster.reset_markers_data(data);
        }
    }
};
</script>

<style scoped>
.hide-map {
    z-index: -1;
}
</style>
