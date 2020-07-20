<template>
    <b-container fluid>
        <bus-stop-map-search
            @searching-data="toggle_overlay"
            @data-searched="toggle_overlay"
            @bus-stop-searched="set_bus_stop_data"
        />

        <b-row>
            <b-col cols="auto">
                <b-button
                    size="sm"
                    :variant="bus_stop.length === 0 ? 'secondary' : 'info'"
                    :disabled="bus_stop.length === 0"
                    @click="toggle_markers"
                >
                    <eye-icon-msg
                        :condition-var="showing_bus_stop"
                        visible-message="Mostrar todas paradas"
                        hidden-message="Ocultar todas paradas"
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
            :raw-data="bus_stop"
            @get-map-object="set_child_map($refs.distance_filter)"
            @data-filtered="filter_data"
        />

        <alert-box ref="alert" />
    </b-container>
</template>

<script>
import L from "leaflet";
import EyeIconMsg from "@/components/EyeIconMsg";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import BusStopMapSearch from "@/components/BusStopMapSearch";
import DistanceFilter from "@/components/DistanceFilter";
import AlertBox from "@/components/AlertBox";

export default {
    name: "BusStopMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster,
        BusStopMapSearch,
        DistanceFilter,
        AlertBox
    },

    data() {
        return {
            show_overlay: false,
            showing_bus_stop: true,
            map: null,
            bus_stop: [],

            icon: L.icon({
                iconUrl: require("@/assets/icons_map/bus_stop.png"),
                iconSize: [30, 30]
            }),

            cluster_options: {
                disableClusteringAtZoom: 16
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

        set_bus_stop_data(data) {
            const old_data = this.bus_stop;

            if (this.bus_stop.length !== 0) {
                this.hide_markers_on_map();
            }

            this.bus_stop = data;

            if (old_data.length === 0) {
                this.$refs.cluster.set_markers_data(this.bus_stop);
            } else {
                this.$refs.cluster.reset_markers_data(this.bus_stop);
            }
        },

        show_markers_on_map() {
            this.map.addLayer(this.$refs.cluster.marker_cluster);
        },

        hide_markers_on_map() {
            this.map.removeLayer(this.$refs.cluster.marker_cluster);
        },

        toggle_overlay() {
            this.show_overlay = !this.show_overlay;
        },

        toggle_markers() {
            if (this.showing_bus_stop) {
                this.hide_markers_on_map();
            } else {
                this.show_markers_on_map();
            }

            this.showing_bus_stop = !this.showing_bus_stop;
        },

        filter_data(data) {
            this.hide_markers_on_map();
            this.$refs.cluster.reset_markers_data(data);
            this.$refs.alert.fire_message(
                "Paradas filtradas com sucesso",
                "success"
            );
        }
    }
};
</script>

<style scoped>
.hide-map {
    z-index: -1;
}
</style>
