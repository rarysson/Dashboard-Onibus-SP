<template>
    <b-container fluid>
        <bus-stop-map-search
            @shown="toggle_map"
            @hidden="toggle_map"
            @searching-data="toggle_overlay"
            @data-searched="toggle_overlay"
            @bus-stop-searched="set_bus_stop_data"
        />

        <b-row>
            <b-col cols="auto">
                <b-button
                    variant="primary"
                    size="sm"
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

        <b-row>
            <b-col cols="12" class="d-flex justify-content-between">
                <b-form-checkbox
                    v-model="filter_result"
                    size="lg"
                    class="mb-20"
                >
                    Filtrar o resultado por distância
                </b-form-checkbox>

                <div v-if="filter_result">
                    <b-button
                        variant="primary"
                        size="sm"
                        class="mr-20"
                        :disabled="user_point === null"
                        @click="toggle_user_marker"
                    >
                        <eye-icon-msg
                            :condition-var="showing_user"
                            visible-message="Mostrar ponto"
                            hidden-message="Ocultar ponto"
                        />
                    </b-button>

                    <b-button size="sm" class="mr-20" @click="find_me">
                        <b-icon-geo-alt />
                        Me encontrar
                    </b-button>

                    <b-button size="sm" :pressed.sync="choosing_point">
                        <b-icon-hand-index-thumb />
                        <span v-if="!choosing_point">
                            Selecionar ponto no mapa
                        </span>
                        <span v-else> Parar de selecionar</span>
                    </b-button>
                </div>
            </b-col>

            <b-col v-if="filter_result">
                <b-row align-v="end">
                    <b-col cols="auto" class="mr-20">
                        <label for="distance">
                            Selecione a distância (kms)
                        </label>
                        <b-form-spinbutton
                            id="distance"
                            v-model="distance"
                            min="1"
                            max="35"
                        />
                    </b-col>

                    <b-col>
                        <b-button @click="filter">
                            Filtrar
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import L from "leaflet";
import EyeIconMsg from "@/components/EyeIconMsg";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import BusStopMapSearch from "@/components/BusStopMapSearch";
import contains from "@/util/contains";

export default {
    name: "BusStopMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster,
        BusStopMapSearch
    },

    data() {
        return {
            show_overlay: false,
            showing_bus_stop: true,
            showing_user: true,
            filter_result: false,
            choosing_point: false,
            distance: 1,
            user_point: null,
            filter_circle: null,
            bus_stop: [],
            map: null,

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

        this.map.on("locationfound", this.set_user_marker);

        this.map.on("locationerror", e => {
            console.log(e);
        });
    },

    watch: {
        show_overlay() {
            this.toggle_map();
        },

        filter_result() {
            if (this.user_point !== null) {
                if (this.filter_result) {
                    this.show_user_mark_on_map();
                } else {
                    this.hide_user_mark_on_map();
                }
            }
        },

        distance() {
            if (this.user_point !== null) {
                this.filter_circle.setRadius(this.distance * 1000);
            }
        },

        choosing_point() {
            if (this.choosing_point) {
                this.map.on("click", this.set_user_marker);
            } else {
                this.map.off("click", this.set_user_marker);
            }
        }
    },

    methods: {
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

        show_user_mark_on_map() {
            this.map.addLayer(this.filter_circle);
            this.map.addLayer(this.user_point);
        },

        hide_user_mark_on_map() {
            this.map.removeLayer(this.filter_circle);
            this.map.removeLayer(this.user_point);
        },

        toggle_map() {
            if (this.map) {
                this.$refs.map.$el.classList.toggle("hide-map");
            }
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

        toggle_user_marker() {
            if (this.showing_user) {
                this.hide_user_mark_on_map();
            } else {
                this.show_user_mark_on_map();
            }

            this.showing_user = !this.showing_user;
        },

        find_me() {
            this.map.locate({ setView: true });
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

        filter() {
            const circle = { x: null, y: null };
            ({ lat: circle.x, lng: circle.y } = this.filter_circle.getLatLng());

            const radius = this.filter_circle.getRadius();

            const point = { x: null, y: null };
            ({ lat: point.x, lng: point.y } = this.user_point.getLatLng());

            console.log(contains(circle, radius, point));
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

.mr-20 {
    margin-right: 20px;
}
</style>
