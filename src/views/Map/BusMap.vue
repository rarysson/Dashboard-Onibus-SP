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

        <b-row>
            <b-col>
                <h1>Linha para filtros</h1>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import L from "leaflet";
import EyeIconMsg from "@/components/EyeIconMsg";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import BusMapSearch from "@/components/BusMapSearch";
// import API from "@/util/api";

export default {
    name: "BusMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster,
        BusMapSearch
    },

    data() {
        return {
            show_overlay: false,
            showing_buses: true,
            showing_user: true,
            filter_result: false,
            choosing_point: false,
            distance: 1,
            user_point: null,
            filter_circle: null,
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

        this.map.on("locationfound", this.set_user_marker);

        this.map.on("locationerror", e => {
            console.log(e);
        });
    },

    watch: {
        show_overlay() {
            this.$refs.map.$el.classList.toggle("hide-map");
        }
    },

    methods: {
        get_bus_options() {
            return [
                { value: 0, text: "Pesquisar por todos ônibus" },
                { value: 1, text: "Pesquisar por linha" },
                { value: 2, text: "Pesquisar por empresa" }
            ];
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

        set_user_marker(event) {
            if (this.user_point === null) {
                this.user_point = L.marker(event.latlng)
                    .addTo(this.map)
                    .bindPopup("Você está aqui!");
            } else {
                this.user_point.setLatLng(event.latlng);
            }

            if (this.filter_circle === null) {
                this.filter_circle = L.circle(
                    event.latlng,
                    this.distance * 1000
                ).addTo(this.map);
            } else {
                this.filter_circle.setLatLng(event.latlng);
                this.filter_circle.setRadius(this.distance * 1000);
            }
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
        }
    }
};
</script>

<style scoped>
.hide-map {
    z-index: -1;
}

.mb-20 {
    margin-bottom: 20px;
}
</style>
