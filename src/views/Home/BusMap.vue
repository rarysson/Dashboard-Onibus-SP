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
                    @click="get_buses_position"
                >
                    <eye-icon-msg
                        :condition-var="show_buses"
                        visible-message="Mostrar todos ônibus"
                        hidden-message="Ocultar todos ônibus"
                    />
                </b-button>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <l-map ref="map" :options="map_options">
                    <l-marker-cluster
                        ref="cluster"
                        :markers-icon="icon"
                        :options="cluster_options"
                        @cluster-created="show_markers_on_map"
                    />
                </l-map>
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
    name: "BusMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster
    },

    data() {
        return {
            show_buses: false,
            buses: [],
            map_options: {
                zoom: 12,
                maxZoom: 18,
                center: latLng(-23.5489, -46.6388), //Centro de São Paulo
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            },

            icon: L.icon({
                iconUrl: require("@/assets/icons_map/bus.png"),
                iconSize: [30, 30]
            }),

            cluster_options: {
                chunkedLoading: true,
                chunkInterval: 50,
                disableClusteringAtZoom: 18
            }
        };
    },

    methods: {
        async get_buses_position() {
            if (this.buses.length === 0 && !this.show_buses) {
                try {
                    const response = await API.get("Posicao");
                    const data = response.data.l;

                    data.forEach(line => {
                        line.vs.forEach(bus => {
                            this.buses.push({
                                accessible: bus.a,
                                px: bus.px,
                                py: bus.py
                            });
                        });
                    });

                    this.$refs.cluster.set_markers_data(this.buses, false);
                } catch (error) {
                    console.log(error);
                }
            }

            if (!this.show_buses) {
                this.show_markers_on_map();
            } else {
                this.hide_markers_on_map();
            }

            this.show_buses = !this.show_buses;
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
