<template>
    <b-row align-h="between">
        <b-col cols="auto">
            <dropdown-select-menu
                title="Selecionar o tipo de pesquisa de parada"
                class="mb-20"
                :options="[
                    'Pesquisar por todas paradas',
                    'Pesquisar por nome de rua/parada',
                    'Pesquisar por linha',
                    'Pesquisar por corredor'
                ]"
                @change="busstop_option = $event"
                @shown="show"
                @hidden="hide"
            />
        </b-col>

        <b-col v-if="busstop_option == 0" cols="auto">
            <b-button @click="search_all_bus_stop">Pesquisar</b-button>
        </b-col>

        <b-col v-else-if="busstop_option == 1" class="mb-20" cols="12">
            <search-input
                placeholder="Digite o nome da rua ou parada..."
                @submit="
                    search_bus_stop('Parada/Buscar', 'termosBusca', $event)
                "
            />
        </b-col>

        <template v-else-if="busstop_option == 2">
            <b-col class="mb-20" cols="12">
                <search-input
                    placeholder="Digite o nome da linha..."
                    @submit="search_line"
                >
                    <template v-slot:append v-if="busstop_option == 2">
                        <dropdown-select-menu
                            title="Selecionar o sentido da linha"
                            selected="0"
                            :options="['Principal', 'Secundária']"
                            @change="way_option = $event + 1"
                            @shown="show"
                            @hidden="hide"
                        />
                    </template>
                </search-input>
            </b-col>

            <b-col class="mb-20 col-fill">
                <dropdown-select-menu
                    block
                    title="Selecionar a linha"
                    :options="get_lines_options()"
                    empty-option="Pesquise a linha na barra de busca"
                    @change="line_option = $event"
                    @shown="show"
                    @hidden="hide"
                />
            </b-col>
            <b-col cols="auto">
                <b-button
                    @click="
                        search_bus_stop(
                            'Parada/BuscarParadasPorLinha',
                            'codigoLinha',
                            lines[line_option].id
                        )
                    "
                >
                    Pesquisar
                </b-button>
            </b-col>
        </template>

        <template v-else-if="busstop_option == 3">
            <b-col class="col-fill mb-20">
                <dropdown-select-menu
                    block
                    title="Selecionar o corredor"
                    :options="get_bus_lanes_options()"
                    @change="bus_lane_option = $event"
                    @shown="show"
                    @hidden="hide"
                />
            </b-col>

            <b-col cols="auto" class="mb-20">
                <b-button
                    @click="
                        search_bus_stop(
                            'Parada/BuscarParadasPorCorredor',
                            'codigoCorredor',
                            bus_lanes[bus_lane_option].id
                        )
                    "
                >
                    Pesquisar
                </b-button>
            </b-col>
        </template>
    </b-row>
</template>

<script>
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import SearchInput from "@/components/SearchInput";
import API from "@/util/api";

export default {
    name: "BusStopMapSearch",

    components: {
        DropdownSelectMenu,
        SearchInput
    },

    data() {
        return {
            busstop_option: null,
            bus_lane_option: null,
            line_option: null,
            way_option: 1,
            lines: [],
            bus_lanes: [],
            all_bus_stop: []
        };
    },

    watch: {
        async busstop_option(val) {
            if (val == 3 && this.bus_lanes.length === 0) {
                try {
                    const response = await API.get("Corredor");
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
        get_lines_options() {
            return this.lines.map(line => `${line.number} » ${line.name}`);
        },

        get_bus_lanes_options() {
            return this.bus_lanes.map(bus_lane => bus_lane.name);
        },

        show() {
            this.$emit("shown");
        },

        hide() {
            this.$emit("hidden");
        },

        async search_all_bus_stop() {
            this.$emit("searching-data");

            if (this.all_bus_stop.length === 0) {
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
                } catch (error) {
                    console.log(error);
                }
            }

            this.$emit("bus-stop-searched", this.all_bus_stop);
            this.$emit("data-searched");
        },

        async search_bus_stop(route, param, term) {
            this.$emit("searching-data");

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

                this.$emit("bus-stop-searched", bus_stop);
                this.$emit("data-searched");
            } catch (error) {
                console.log(error);
            }
        },

        async search_line(term) {
            try {
                const response = await API.get("Linha/BuscarLinhaSentido", {
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
.mb-20 {
    margin-bottom: 20px;
}

.col-fill {
    flex: 1;
}
</style>
