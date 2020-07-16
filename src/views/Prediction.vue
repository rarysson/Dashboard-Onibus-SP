<template>
    <b-container fluid>
        <b-row>
            <b-col cols="auto">
                <dropdown-select-menu
                    title="Selecionar o tipo de pesquisa de previsão"
                    :options="[
                        'Pesquisar por uma parada',
                        'Pesquisar por uma linha',
                        'Pesquisar por uma parada numa linha'
                    ]"
                    @change="update_prediction_option"
                    @shown="hide_map"
                    @hidden="show_map"
                />
            </b-col>
            <b-col v-if="prediction_option == 0" cols="auto">
                <dropdown-select-menu
                    title="Selecionar o tipo de pesquisa de parada"
                    :options="[
                        'Selecionar no mapa',
                        'Pesquisar por nome de rua/parada',
                        'Pesquisar por linha'
                    ]"
                    @change="update_bustop_selected"
                />
            </b-col>
            <b-col v-if="prediction_option !== null" style="text-align: right;">
                <b-button
                    :disabled="selected_busstop === null"
                    @click="get_prediction"
                >
                    Pesquisar
                </b-button>
            </b-col>
        </b-row>

        <b-row v-if="busstop_option == 0">
            <b-col cols="12">
                <l-map ref="map" :options="map_options" class="map">
                    <l-marker-cluster
                        ref="cluster"
                        :markers-icon="icon"
                        :options="cluster_options"
                        @cluster-created="show_markers_on_map"
                        @click="select_busstop"
                    />
                    <div v-if="selected_busstop">
                        <l-marker
                            :marker-icon="icon"
                            :marker-data="selected_busstop"
                            :map-object="$refs.map.map_object"
                        />

                        <l-marker
                            v-for="(marker, index) in predictions"
                            :key="index"
                            :marker-icon="icon_bus"
                            :marker-data="marker"
                            :map-object="$refs.map.map_object"
                        />
                    </div>
                </l-map>
            </b-col>
        </b-row>

        <!-- <b-row v-if="prediction_option == 1 || prediction_option == 2">
            Pesquisa por linha Em obra
            <b-col>
                <dropdown-select-menu
                    title="Selecionar o tipo de pesquisa de linha"
                    :options="[
                        'Selecionar no mapa',
                        'Pesquisar por nome de rua/parada',
                        'Pesquisar por linha'
                    ]"
                    @change="update_bustop_selected"
                />
            </b-col>
        </b-row> -->
    </b-container>
</template>

<script>
import L from "leaflet";
import { latLng } from "leaflet";
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import LMarker from "@/components/LMarker";
import API from "@/util/api";

export default {
    name: "PredictionPage",

    components: {
        DropdownSelectMenu,
        LMap,
        LMarkerCluster,
        LMarker
    },

    data() {
        return {
            prediction_option: null,
            busstop_option: null,
            line_option: null,
            bus_stop: [],
            predictions: [],
            selected_busstop: null,

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

            icon_bus: L.icon({
                iconUrl: require("@/assets/icons_map/bus.png"),
                iconSize: [30, 30]
            }),

            cluster_options: {
                disableClusteringAtZoom: 16
            }
        };
    },

    watch: {
        async busstop_option(val) {
            if (val == 0) {
                try {
                    const response = await API.get("Parada/Buscar", {
                        params: { termosBusca: "" }
                    });
                    const data = response.data;

                    data.forEach(stop => {
                        this.bus_stop.push({
                            px: stop.px,
                            py: stop.py,
                            id: stop.cp,
                            text: `<strong>Nome da parada:</strong> ${stop.np} <br>
                            <strong>Nome da rua:</strong> ${stop.ed}`
                        });
                    });

                    this.$refs.cluster.set_markers_data(this.bus_stop);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },

    methods: {
        update_prediction_option(val) {
            this.prediction_option = val;
        },

        update_bustop_selected(val) {
            this.busstop_option = val;
        },

        update_line_option(val) {
            this.line_option = val;
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
        },

        get_line_way(way) {
            return way === 1 ? "Principal" : "Secundário";
        },

        select_busstop(busstop) {
            this.selected_busstop = busstop;
        },

        async get_prediction() {
            try {
                this.hide_markers_on_map();
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
            } catch (error) {
                console.log(error);
            }
        },

        hide_map() {
            if (this.$refs.map) {
                this.$refs.map.$el.classList.toggle("hide-map");
            }
        },

        show_map() {
            if (this.$refs.map) {
                this.$refs.map.$el.classList.toggle("hide-map");
            }
        }
    }
};
</script>

<style scoped>
.hide-map {
    z-index: -1;
}
</style>
