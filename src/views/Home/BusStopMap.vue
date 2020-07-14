<template>
    <b-container fluid>
        <b-button
            variant="info"
            size="sm"
            style="margin-bottom: 30px;"
            @click="go_back"
        >
            <b-icon-arrow-left />
            Voltar
        </b-button>

        <b-row>
            <b-col cols="auto">
                <b-button
                    variant="primary"
                    size="sm"
                    @click="get_bus_stop_position"
                >
                    <eye-icon-msg
                        :condition-var="show_bus_stop"
                        visible-message="Mostrar todas paradas"
                        hidden-message="Ocultar todas paradas"
                    />
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <b-overlay :show="show_overlay">
                    <l-map ref="map" :options="map_options">
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
import { latLng } from "leaflet";
import EyeIconMsg from "@/components/EyeIconMsg";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import API from "@/util/api";

export default {
    name: "BusStopMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster
    },

    data() {
        return {
            show_overlay: false,
            show_bus_stop: false,
            bus_stop: [],

            map_options: {
                zoom: 12,
                maxZoom: 18,
                center: latLng(-23.5489, -46.6388), //Centro de São Paulo
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            },

            icon: L.icon({
                iconUrl: require("@/assets/icons_map/bus_stop.png"),
                iconSize: [30, 30]
            }),

            cluster_options: {
                disableClusteringAtZoom: 16
            }
        };
    },

    watch: {
        show_overlay() {
            this.$refs.map.$el.classList.toggle("hide-map");
        }
    },

    methods: {
        async get_bus_stop_position() {
            if (this.bus_stop.length === 0 && !this.show_bus_stop) {
                this.show_overlay = true;

                try {
                    const response = await API.get("Parada/Buscar", {
                        params: { termosBusca: "" }
                    });
                    const data = response.data;

                    data.forEach(stop => {
                        this.bus_stop.push({
                            px: stop.px,
                            py: stop.py,
                            text: `<strong>Nome da parada:</strong> ${stop.np} <br>
                            <strong>Nome da rua:</strong> ${stop.ed}`
                        });
                    });

                    this.$refs.cluster.set_markers_data(this.bus_stop);
                    this.show_overlay = false;
                } catch (error) {
                    console.log(error);
                }
            }

            if (!this.show_bus_stop) {
                this.show_markers_on_map();
            } else {
                this.hide_markers_on_map();
            }

            this.show_bus_stop = !this.show_bus_stop;
        },

        go_back() {
            this.$router.back();
        },

        show_markers_on_map() {
            this.$refs.map.map_object.addLayer(
                this.$refs.cluster.marker_cluster
            );
        },

        hide_markers_on_map() {
            this.$refs.map.map_object.removeLayer(
                this.$refs.cluster.marker_cluster
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
