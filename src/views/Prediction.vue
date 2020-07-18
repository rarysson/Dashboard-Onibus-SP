<template>
    <b-container fluid>
        <b-row class="mb-20">
            <b-col cols="12" class="mb-20">
                <b-row>
                    <b-col cols="auto">
                        <dropdown-select-menu
                            title="Selecionar o tipo de pesquisa de previsão"
                            :options="[
                                'Pesquisar por uma parada',
                                'Pesquisar por uma linha',
                                'Pesquisar por uma parada numa linha'
                            ]"
                            @change="prediction_option = $event"
                            @shown="toggle_map"
                            @hidden="toggle_map"
                        />
                    </b-col>

                    <b-col
                        v-if="prediction_option !== null"
                        style="text-align: right;"
                    >
                        <b-button
                            :disabled="selected_busstop === null"
                            @click="search_prediction"
                        >
                            Pesquisar Previsão
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>

            <b-col>
                <bus-stop-map-search
                    v-if="prediction_option == 0"
                    @shown="toggle_map"
                    @hidden="toggle_map"
                    @searching-data="toggle_overlay"
                    @data-searched="toggle_overlay"
                    @bus-stop-searched="set_bus_stop_data"
                />
            </b-col>

            <b-col cols="12" v-if="prediction_option == 0">
                <b-overlay :show="show_overlay">
                    <l-map ref="map">
                        <l-marker-cluster
                            ref="cluster"
                            :markers-icon="icon"
                            :options="cluster_options"
                            @cluster-created="show_markers_on_map('cluster')"
                            @click="select_busstop"
                        />

                        <l-marker ref="user_marker" :marker-icon="icon" />

                        <l-marker-cluster
                            ref="cluster_bus"
                            :markers-icon="icon_bus"
                            :options="cluster_options"
                            @cluster-created="
                                show_markers_on_map('cluster_bus')
                            "
                        />
                    </l-map>
                </b-overlay>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import L from "leaflet";
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import LMarker from "@/components/LMarker";
import BusStopMapSearch from "@/components/BusStopMapSearch";
import API from "@/util/api";

export default {
    name: "PredictionPage",

    components: {
        DropdownSelectMenu,
        LMap,
        LMarkerCluster,
        LMarker,
        BusStopMapSearch
    },

    data() {
        return {
            show_overlay: false,
            prediction_option: null,
            predictions: [],
            bus_stop: [],
            selected_busstop: null,

            icon: L.icon({
                iconUrl: require("@/assets/icons_map/bus_stop.png"),
                iconSize: [30, 30]
            }),

            icon_bus: L.icon({
                iconUrl: require("@/assets/icons_map/bus.png"),
                iconSize: [30, 30]
            }),

            cluster_options: {
                disableClusteringAtZoom: 12
            }
        };
    },

    watch: {
        show_overlay() {
            this.toggle_map();
        }
    },

    methods: {
        get_line_way(way) {
            return way === 1 ? "Principal" : "Secundário";
        },

        show_markers_on_map(cluster_name) {
            this.$refs.map.map_object.addLayer(
                this.$refs[cluster_name].marker_cluster
            );
        },

        hide_markers_on_map(cluster_name) {
            this.$refs.map.map_object.removeLayer(
                this.$refs[cluster_name].marker_cluster
            );
        },

        select_busstop(busstop) {
            this.selected_busstop = busstop;
        },

        toggle_map() {
            if (this.$refs.map) {
                this.$refs.map.$el.classList.toggle("hide-map");
            }
        },

        toggle_overlay() {
            this.show_overlay = !this.show_overlay;
        },

        set_bus_stop_data(data) {
            const old_data = this.bus_stop;

            if (this.bus_stop.length !== 0) {
                this.hide_markers_on_map("cluster");
                this.hide_markers_on_map("cluster_bus");
                this.$refs.map.map_object.removeLayer(
                    this.$refs.user_marker.marker
                );
            }

            this.bus_stop = data;

            if (old_data.length === 0) {
                this.$refs.cluster.set_markers_data(this.bus_stop);
            } else {
                this.$refs.cluster.reset_markers_data(this.bus_stop);
            }
        },

        async search_prediction() {
            try {
                this.hide_markers_on_map("cluster");
                this.$refs.map.map_object.setZoom(12);

                const response = await API.get("/Previsao/Parada", {
                    params: { codigoParada: this.selected_busstop.id }
                });
                const lines = response.data.p.l;

                lines.forEach(line => {
                    line.vs.forEach(bus => {
                        this.predictions.push({
                            px: bus.px,
                            py: bus.py,
                            text: `<b>Horário de previsão:</b> ${bus.t} <br>
                            <b>Origem:</b> ${line.lt1} <br>
                            <b>Destino:</b> ${line.lt0} <br>
                            <b>Sentido:</b> ${this.get_line_way(line.sl)}`
                        });
                    });
                });

                this.$refs.user_marker.set_marker_data(
                    this.selected_busstop,
                    this.$refs.map.map_object
                );
                this.$refs.cluster_bus.set_markers_data(this.predictions);
                this.selected_busstop = null;
            } catch (error) {
                console.log(error);
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

.col-fill {
    flex: 1;
}
</style>
