<template>
    <b-container fluid>
        <b-row style="margin-bottom: 20px;">
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
            <b-col style="margin-bottom: 20px;" cols="12">
                <dropdown-select-menu
                    title="Selecionar o tipo de pesquisa de parada"
                    :options="[
                        'Pesquisar por nome de rua/parada',
                        'Pesquisar por linha',
                        'Pesquisar por corredor'
                    ]"
                    @change="update_bustop_option"
                    @shown="toggle_map"
                    @hidden="toggle_map"
                />
            </b-col>

            <b-col
                v-if="bustop_option !== null"
                style="margin-bottom: 20px;"
                cols="12"
            >
                <search-input
                    v-if="bustop_option == 0"
                    placeholder="Digite o nome da rua ou parada..."
                    @submit="
                        search_bus_stop('/Parada/Buscar', 'termosBusca', $event)
                    "
                />

                <template v-else-if="bustop_option == 1">
                    <search-input
                        style="margin-bottom: 20px;"
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

                    <b-row>
                        <b-col style="flex: 1;">
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
                </template>

                <template v-else-if="bustop_option == 2">
                    <b-row>
                        <b-col style="flex: 1;">
                            <dropdown-select-menu
                                block
                                title="Selecionar o corredor"
                                :options="get_bus_lanes_options()"
                                @change="update_bus_lanes_option"
                                @shown="toggle_map"
                                @hidden="toggle_map"
                            />
                        </b-col>

                        <b-col cols="auto">
                            <b-button
                                @click="
                                    search_bus_stop(
                                        '/Parada/BuscarParadasPorCorredor',
                                        'codigoCorredor',
                                        bus_lanes[bus_lane_option].id
                                    )
                                "
                            >
                                Pesquisar
                            </b-button>
                        </b-col>
                    </b-row>
                </template>
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
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import SearchInput from "@/components/SearchInput";
import API from "@/util/api";

export default {
    name: "BusStopMapPage",

    components: {
        EyeIconMsg,
        LMap,
        LMarkerCluster,
        SearchInput,
        DropdownSelectMenu
    },

    data() {
        return {
            show_overlay: false,
            show_bus_stop: false,
            bustop_option: null,
            line_option: null,
            bus_lane_option: null,
            way_option: 1,
            bus_stop: [],
            lines: [],
            bus_lanes: [],

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
            this.toggle_map();
        },

        async bustop_option(val) {
            if (val == 2) {
                try {
                    const response = await API.get("/Corredor");
                    const data = response.data;

                    data.forEach(bus_lane => {
                        this.bus_lanes.push({
                            name: bus_lane.nc,
                            id: bus_lane.cc
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
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

        update_bustop_option(val) {
            this.bustop_option = val;
        },

        update_way_option(val) {
            this.way_option = val;
        },

        update_line_option(val) {
            this.line_option = val;
        },

        update_bus_lanes_option(val) {
            this.bus_lane_option = val;
        },

        get_lines_options() {
            return this.lines.map(line => `${line.number} » ${line.name}`);
        },

        get_bus_lanes_options() {
            return this.bus_lanes.map(bus_lane => bus_lane.name);
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
                this.bus_stop = [];

                lines.forEach(line => {
                    this.bus_stop.push({
                        id: line.cp,
                        px: line.px,
                        py: line.py,
                        text: `<strong>Nome da parada:</strong> ${line.np} <br>
                        <strong>Nome da rua:</strong> ${line.ed}`
                    });
                });

                this.$refs.cluster.set_markers_data(this.bus_stop);
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
