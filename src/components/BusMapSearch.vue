<template>
    <b-row align-h="between">
        <b-col cols="auto">
            <dropdown-select-menu
                title="Selecionar o tipo de pesquisa de ônibus"
                class="mb-20"
                :options="get_bus_options()"
                @change="bus_option = $event"
            />
        </b-col>

        <b-col v-if="bus_option == 0" cols="auto">
            <b-button @click="search_all_buses">Pesquisar</b-button>
        </b-col>

        <line-search
            v-else-if="bus_option == 1"
            @line-searched="search_bus_on_line"
        />

        <template v-else-if="bus_option == 2">
            <b-col class="col-fill mb-20">
                <dropdown-select-menu
                    title="Selecionar a empresa"
                    :options="get_companies_options()"
                    @change="company_option = $event"
                />
            </b-col>

            <b-col cols="auto" class="mb-20">
                <b-button
                    :disabled="company_option === null"
                    @click="search_company_buses"
                >
                    Pesquisar
                </b-button>
            </b-col>
        </template>
    </b-row>
</template>

<script>
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import LineSearch from "@/components/LineSearch";
import API from "@/util/api";

export default {
    name: "BusMapSearch",

    components: {
        DropdownSelectMenu,
        LineSearch
    },

    data() {
        return {
            bus_option: null,
            selected_line: null,
            company_option: null,
            way_option: 1,
            companies: [],
            buses: [],
            all_buses: []
        };
    },

    watch: {
        async bus_option(val) {
            if (val == 2 && this.companies.length === 0) {
                try {
                    const response = await API.get("Empresa");
                    const data = response.data.e;

                    data.forEach(area => {
                        area.e.forEach(company => {
                            this.companies.push({
                                name: company.n,
                                id: company.c
                            });
                        });
                    });

                    // Método para tornar um array de objetos com dados únicos
                    this.companies = this.companies.filter(
                        (elem, index, self) =>
                            self.findIndex(t => {
                                return t.id === elem.id && t.name === elem.name;
                            }) === index
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },

    methods: {
        get_bus_options() {
            return [
                { value: 0, text: "Pesquisar por todos ônibus" },
                { value: 1, text: "Pesquisar por linha" },
                { value: 2, text: "Pesquisar os ônibus na garagem" }
            ];
        },

        get_companies_options() {
            const options = [];

            for (let i = 0; i < this.companies.length; i++) {
                options.push({
                    value: i,
                    text: this.companies[i].name
                });
            }

            return options;
        },

        get_time(time) {
            const date = new Date(time);

            return `${date.getHours()}:${date.getMinutes()}`;
        },

        async search_all_buses() {
            this.$emit("searching-data");

            if (this.all_buses.length === 0) {
                try {
                    const response = await API.get("Posicao");
                    const data = response.data.l;

                    data.forEach(line => {
                        line.vs.forEach(bus => {
                            this.all_buses.push({
                                id: bus.p,
                                px: bus.px,
                                py: bus.py,
                                accessible: bus.a
                            });
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }

            this.$emit("bus-searched", this.all_buses);
            this.$emit("data-searched");
        },

        async search_bus_on_line(line) {
            this.$emit("searching-data");

            try {
                const response = await API.get("Posicao/Linha", {
                    params: { codigoLinha: line.id }
                });
                const result = response.data.vs;
                const buses = [];

                result.forEach(bus => {
                    buses.push({
                        id: bus.p,
                        px: bus.px,
                        py: bus.py,
                        accessible: bus.a
                    });
                });

                this.$emit("bus-searched", buses);
            } catch (error) {
                console.log(error);
            }

            this.$emit("data-searched");
        },

        async search_company_buses() {
            this.$emit("searching-data");

            try {
                const response = await API.get("Posicao/Garagem", {
                    params: {
                        codigoEmpresa: this.companies[this.company_option].id
                    }
                });
                const data = response.data.l;
                const buses = [];

                data.forEach(line => {
                    line.vs.forEach(bus => {
                        buses.push({
                            id: bus.p,
                            px: bus.px,
                            py: bus.py,
                            accessible: bus.a
                        });
                    });
                });

                this.$emit("bus-searched", buses);
            } catch (error) {
                console.log(error);
            }

            this.$emit("data-searched");
        }
    }
};
</script>
