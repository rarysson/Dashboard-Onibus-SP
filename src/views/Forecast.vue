<template>
    <b-container fluid>
        <b-row class="mb-20">
            <b-col cols="12" class="mb-20">
                <b-row>
                    <b-col cols="auto">
                        <dropdown-select-menu
                            title="Selecionar o tipo de pesquisa de previsão"
                            :options="[
                                { value: 0, text: 'Pesquisar por uma parada' },
                                { value: 1, text: 'Pesquisar por uma linha' }
                            ]"
                            @change="forecast_option = $event"
                        />
                    </b-col>

                    <b-col
                        v-if="forecast_option == 0"
                        style="text-align: right;"
                        class="col-search-forecast"
                    >
                        <b-button
                            :variant="
                                selected_busstop === null
                                    ? 'secondary'
                                    : 'primary'
                            "
                            :disabled="selected_busstop === null"
                            @click="search_forecast"
                        >
                            Pesquisar Previsão
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>

            <b-col v-if="forecast_option == 0">
                <bus-stop-map-search
                    class="mb-20"
                    @searching-data="toggle_overlay"
                    @data-searched="toggle_overlay"
                    @bus-stop-searched="set_bus_stop_data"
                />

                <b-row>
                    <b-col class="col-search-forecast-mobile">
                        <b-button
                            block
                            :variant="
                                selected_busstop === null
                                    ? 'secondary'
                                    : 'primary'
                            "
                            :disabled="selected_busstop === null"
                            @click="search_forecast"
                        >
                            Pesquisar Previsão
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>

            <line-search
                v-else-if="forecast_option == 1"
                @line-searched="set_lines_data"
            />

            <b-col cols="12">
                <b-overlay :show="show_overlay">
                    <l-map ref="map">
                        <template v-if="forecast_option !== null">
                            <l-marker-cluster
                                ref="cluster"
                                :markers-icon="icon"
                                :options="cluster_options"
                                @cluster-created="
                                    show_markers_on_map('cluster')
                                "
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
                        </template>
                    </l-map>
                </b-overlay>
            </b-col>
        </b-row>

        <alert-box ref="alert" />
    </b-container>
</template>

<script>
import L from "leaflet";
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import LMap from "@/components/LMap";
import LMarkerCluster from "@/components/LMarkerCluster";
import LMarker from "@/components/LMarker";
import BusStopMapSearch from "@/components/BusStopMapSearch";
import LineSearch from "@/components/LineSearch";
import AlertBox from "@/components/AlertBox";
import API from "@/util/api";

export default {
    name: "ForecastPage",

    components: {
        DropdownSelectMenu,
        LMap,
        LMarkerCluster,
        LMarker,
        BusStopMapSearch,
        LineSearch,
        AlertBox
    },

    data() {
        return {
            show_overlay: false,
            already_set_map: false,
            map: null,
            forecast_option: null,
            selected_busstop: null,
            selected_line: null,
            forecasts: [],
            bus_stop: [],
            lines: [],

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
        },

        forecast_option() {
            if (!this.already_set_map) {
                this.map = this.$refs.map.map_object;
                this.already_set_map = true;
            }
        }
    },

    methods: {
        get_line_way(way) {
            return way === 1 ? "Principal" : "Secundário";
        },

        show_markers_on_map(cluster_name) {
            this.map.addLayer(this.$refs[cluster_name].marker_cluster);
        },

        hide_markers_on_map(cluster_name) {
            this.map.removeLayer(this.$refs[cluster_name].marker_cluster);
        },

        select_busstop(busstop) {
            this.selected_busstop = busstop;
        },

        toggle_map() {
            this.$refs.map.$el.classList.toggle("hide-map");
        },

        toggle_overlay() {
            this.show_overlay = !this.show_overlay;
        },

        set_bus_stop_data(data) {
            const old_data = this.bus_stop;

            if (this.forecasts.length !== 0) {
                this.hide_markers_on_map("cluster");
                this.hide_markers_on_map("cluster_bus");

                if (this.bus_stop.length !== 0) {
                    this.map.removeLayer(this.$refs.user_marker.marker);
                }
            }

            this.bus_stop = data;

            if (old_data.length === 0) {
                this.$refs.cluster.set_markers_data(this.bus_stop);
            } else {
                this.$refs.cluster.reset_markers_data(this.bus_stop);
            }
        },

        async set_lines_data(data) {
            if (this.forecasts.length !== 0) {
                this.hide_markers_on_map("cluster");
                this.hide_markers_on_map("cluster_bus");
                this.map.removeLayer(this.$refs.user_marker.marker);
            }

            this.selected_line = data;

            try {
                this.search_forecast();
            } catch (error) {
                this.$refs.alert.fire_message(
                    `Erro com o servidor
                    erro: ${error}`,
                    "danger"
                );
            }
        },

        async search_busstop_forecast() {
            // eslint-disable-next-line no-useless-catch
            try {
                const response = await API.get("Previsao/Parada", {
                    params: { codigoParada: this.selected_busstop.id }
                });
                const lines = response.data.p === null ? [] : response.data.p.l;
                const data = [];

                lines.forEach(line => {
                    line.vs.forEach(bus => {
                        data.push({
                            px: bus.px,
                            py: bus.py,
                            text: `<b>Horário de previsão:</b> ${bus.t} <br>
                            <b>Origem:</b> ${line.lt1} <br>
                            <b>Destino:</b> ${line.lt0} <br>
                            <b>Sentido:</b> ${this.get_line_way(line.sl)}`
                        });
                    });
                });

                return data;
            } catch (error) {
                throw error;
            }
        },

        async search_line_forecast() {
            // eslint-disable-next-line no-useless-catch
            try {
                const response = await API.get("Previsao/Linha", {
                    params: { codigoLinha: this.selected_line.id }
                });
                const lines = response.data.ps;
                const data = [];

                lines.forEach(line => {
                    line.vs.forEach(bus => {
                        data.push({
                            px: bus.px,
                            py: bus.py,
                            text: `<b>Horário de previsão:</b> ${bus.t}`
                        });
                    });
                });

                return data;
            } catch (error) {
                throw error;
            }
        },

        async search_forecast() {
            // eslint-disable-next-line no-useless-catch
            try {
                this.hide_markers_on_map("cluster");
                const old_forecast = this.forecasts;

                if (this.selected_busstop !== null) {
                    this.bus_stop = await this.search_busstop_forecast();
                    this.forecasts = this.bus_stop;

                    this.$refs.user_marker.set_marker_data(
                        this.selected_busstop,
                        this.map
                    );

                    this.selected_busstop = null;
                } else if (this.selected_line !== null) {
                    this.lines = await this.search_line_forecast();
                    this.forecasts = this.lines;
                    this.selected_line = null;
                }

                if (old_forecast.length === 0) {
                    this.$refs.cluster_bus.set_markers_data(this.forecasts);
                } else {
                    this.$refs.cluster_bus.reset_markers_data(this.forecasts);
                }

                if (this.forecasts.length === 0) {
                    this.$refs.alert.fire_message(
                        "Não existe previsões para sua busca",
                        "warning"
                    );
                } else {
                    this.$refs.alert.fire_message(
                        "Previsão realizada com sucesso",
                        "success"
                    );
                }
            } catch (error) {
                throw error;
            }
        }
    }
};
</script>

<style scoped>
.hide-map {
    z-index: -1;
}

.col-search-forecast-mobile {
    display: none;
}

@media (max-width: 550px) {
    .col-search-forecast-mobile {
        display: unset;
    }

    .col-search-forecast {
        display: none;
    }
}
</style>
