<template>
    <b-container fluid>
        <b-row style="margin-bottom: 20px;">
            <b-col cols="auto">
                <dropdown-select-menu
                    title="Selecionar o tipo de pesquisa de previsão"
                    :options="[
                        'Pesquisar por uma parada',
                        'Pesquisar por uma linha',
                        'Pesquisar por uma parada numa linha'
                    ]"
                    @change="update_prediction_option"
                    @shown="toggle_map"
                    @hidden="toggle_map"
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
                    @change="update_bustop_option"
                />
            </b-col>

            <b-col v-if="prediction_option !== null" style="text-align: right;">
                <b-button
                    :disabled="selected_busstop === null"
                    @click="get_prediction"
                >
                    Pesquisar Previsão
                </b-button>
            </b-col>
        </b-row>

        <b-row v-if="busstop_option == 1">
            <b-col style="margin-bottom: 20px;">
                <search-input
                    placeholder="Digite o nome da rua ou parada..."
                    @submit="
                        search_bus_stop('/Parada/Buscar', 'termosBusca', $event)
                    "
                />
            </b-col>
        </b-row>

        <b-row v-if="busstop_option == 2">
            <b-col style="margin-bottom: 20px;" cols="12">
                <search-input
                    placeholder="Digite o nome da linha..."
                    @submit="search_line"
                >
                    <template v-slot:append>
                        <dropdown-select-menu
                            title="Selecionar o sentido da linha"
                            selected="0"
                            :options="['Principal', 'Secundária']"
                            @change="update_way_option"
                        />
                    </template>
                </search-input>
            </b-col>

            <b-col style="margin-bottom: 20px; flex: 1;">
                <dropdown-select-menu
                    block
                    title="Selecionar a linha"
                    :options="get_lines_options()"
                    empty-option="Pesquise a linha na barra de busca"
                    @change="update_line_option"
                    @shown="toggle_map"
                    @hidden="toggle_map"
                />
            </b-col>
            <b-col cols="auto">
                <b-button
                    @click="
                        search_bus_stop(
                            '/Parada/BuscarParadasPorLinha',
                            'codigoLinha',
                            lines[line_option].id
                        )
                    "
                >
                    Pesquisar linha
                </b-button>
            </b-col>
        </b-row>

        <b-row v-if="busstop_option !== null">
            <b-col cols="12">
                <l-map ref="map" :options="map_options" class="map">
                    <l-marker-cluster
                        v-if="busstop_option == 0"
                        ref="cluster"
                        :markers-icon="icon"
                        :options="cluster_options"
                        @cluster-created="show_markers_on_map"
                        @click="select_busstop"
                    />

                    <l-marker-cluster
                        v-else-if="busstop_option == 1 || busstop_option == 2"
                        ref="cluster"
                        :markers-icon="icon"
                        :options="cluster_search_options"
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
            Pesquisa por linha
            <b-col>
                <dropdown-select-menu
                    title="Selecionar o tipo de pesquisa de linha"
                    :options="[
                        'Selecionar no mapa',
                        'Pesquisar por nome de rua/parada',
                        'Pesquisar por linha'
                    ]"
                    @change="update_bustop_option"
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
import SearchInput from "@/components/SearchInput";
import API from "@/util/api";

export default {
    name: "PredictionPage",

    components: {
        DropdownSelectMenu,
        SearchInput,
        LMap,
        LMarkerCluster,
        LMarker
    },

    data() {
        return {
            prediction_option: null,
            busstop_option: null,
            line_option: null,
            all_bus_stop: [],
            predictions: [],
            selected_busstop: null,
            way_option: 1,
            lines: [],

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
            },
            cluster_search_options: {
                disableClusteringAtZoom: 7
            }
        };
    },

    watch: {
        async busstop_option(val) {
            this.selected_busstop = null;

            if (val == 0) {
                try {
                    const response = await API.get("Parada/Buscar", {
                        params: { termosBusca: "" }
                    });
                    const data = response.data;

                    data.forEach(stop => {
                        this.all_bus_stop.push({
                            px: stop.px,
                            py: stop.py,
                            id: stop.cp,
                            text: `<strong>Nome da parada:</strong> ${stop.np} <br>
                            <strong>Nome da rua:</strong> ${stop.ed}`
                        });
                    });

                    this.$refs.cluster.set_markers_data(this.all_bus_stop);
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

        update_bustop_option(val) {
            this.busstop_option = val;
        },

        update_line_option(val) {
            this.line_option = val;
        },

        update_way_option(val) {
            this.way_option = val + 1;
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

        get_lines_options() {
            return this.lines.map(line => `${line.number} » ${line.name}`);
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

        toggle_map() {
            if (this.$refs.map) {
                this.$refs.map.$el.classList.toggle("hide-map");
            }
        },

        async search_bus_stop(route, param, term) {
            try {
                const response = await API.get(route, {
                    params: { [param]: term }
                });
                const lines = response.data;
                const bus_stop = [];

                lines.forEach(line => {
                    bus_stop.push({
                        id: line.cp,
                        px: line.px,
                        py: line.py,
                        text: `<strong>Nome da parada:</strong> ${line.np} <br>
                        <strong>Nome da rua:</strong> ${line.ed}`
                    });
                });

                this.$refs.cluster.set_markers_data(bus_stop);
            } catch (error) {
                console.log(error);
            }
        },

        async search_line(term) {
            try {
                const response = await API.get("/Linha/BuscarLinhaSentido", {
                    params: { termosBusca: term, sentido: this.way_option }
                });
                const data = response.data;
                const lines = [];

                data.forEach(line => {
                    lines.push({
                        id: line.cl,
                        number: `${line.lt}-${line.tl}`,
                        name: `${line.tp} - ${line.ts}`
                    });
                });

                this.lines = lines;
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
</style>
