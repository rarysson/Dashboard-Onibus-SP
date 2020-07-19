<template>
    <b-row align-h="between">
        <b-col cols="auto">
            <dropdown-select-menu
                title="Selecionar o tipo de pesquisa de parada"
                class="mb-20"
                :options="get_bus_stop_options()"
                @change="busstop_option = $event"
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

        <line-search
            v-else-if="busstop_option == 2"
            @line-searched="
                search_bus_stop(
                    'Parada/BuscarParadasPorLinha',
                    'codigoLinha',
                    $event.id
                )
            "
        />

        <template v-else-if="busstop_option == 3">
            <b-col class="col-fill mb-20">
                <dropdown-select-menu
                    title="Selecionar o corredor"
                    :options="get_bus_lanes_options()"
                    @change="bus_lane_option = $event"
                />
            </b-col>

            <b-col cols="auto" class="mb-20">
                <b-button
                    :disabled="bus_lane_option === null"
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
import LineSearch from "@/components/LineSearch";
import API from "@/util/api";

export default {
    name: "BusStopMapSearch",

    components: {
        DropdownSelectMenu,
        SearchInput,
        LineSearch
    },

    data() {
        return {
            busstop_option: null,
            bus_lane_option: null,
            line_option: null,
            selected_line: null,
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
        get_bus_stop_options() {
            return [
                { value: 0, text: "Pesquisar por todas paradas" },
                { value: 1, text: "Pesquisar por nome de rua/parada" },
                { value: 2, text: "Pesquisar por linha" },
                { value: 3, text: "Pesquisar por corredor" }
            ];
        },

        get_bus_lanes_options() {
            const options = [];

            for (let i = 0; i < this.bus_lanes.length; i++) {
                let bus_lane = this.bus_lanes[i];

                options.push({
                    value: i,
                    text: bus_lane.name
                });
            }

            return options;
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
            } catch (error) {
                console.log(error);
            }

            this.$emit("data-searched");
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
