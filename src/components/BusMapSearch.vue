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
            <b-button variant="primary" @click="search_all_buses">
                Pesquisar
            </b-button>
        </b-col>

        <line-search
            v-else-if="bus_option == 1"
            @line-searched="search_bus_on_line"
        />

        <template v-else-if="bus_option == 2">
            <b-col class="col-fill mb-20 company-menu">
                <dropdown-select-menu
                    title="Selecionar a empresa"
                    :options="get_companies_options()"
                    @change="company_option = $event"
                />
            </b-col>

            <b-col cols="auto" class="mb-20">
                <b-button
                    :variant="company_option === null ? 'secondary' : 'primary'"
                    :disabled="company_option === null"
                    @click="search_company_buses"
                >
                    Pesquisar
                </b-button>
            </b-col>
        </template>

        <alert-box ref="alert" />
    </b-row>
</template>

<script>
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import LineSearch from "@/components/LineSearch";
import AlertBox from "@/components/AlertBox";
import API from "@/util/api";

export default {
    name: "BusMapSearch",

    components: {
        DropdownSelectMenu,
        LineSearch,
        AlertBox
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
                    this.$refs.alert.fire_message(
                        `Falha ao procurar empresas
                        erro: ${error}`,
                        "danger"
                    );
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
                    this.$refs.alert.fire_message(
                        `Erro com o servidor
                        erro: ${error}`,
                        "danger"
                    );
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

                if (buses.length === 0) {
                    this.$refs.alert.fire_message(
                        "Não existe ônibus para sua busca",
                        "warning"
                    );
                }
            } catch (error) {
                this.$refs.alert.fire_message(
                    `Erro com o servidor
                        erro: ${error}`,
                    "danger"
                );
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
                this.$refs.alert.fire_message(
                    `Erro com o servidor
                        erro: ${error}`,
                    "danger"
                );
            }

            this.$emit("data-searched");
        }
    }
};
</script>

<style scoped>
@media (max-width: 700px) {
    .company-menu {
        min-width: 70%;
    }
}
</style>
