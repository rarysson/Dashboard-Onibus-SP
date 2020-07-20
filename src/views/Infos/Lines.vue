<template>
    <b-container fluid>
        <b-row align-h="between">
            <b-col cols="auto">
                <search-input
                    placeholder="Digite o termo de busca..."
                    @submit="search_term"
                >
                    <template v-slot:prepend>
                        <b-button id="info">
                            <b-icon-info-circle-fill />
                        </b-button>

                        <b-popover
                            target="info"
                            triggers="hover"
                            placement="bottom"
                        >
                            <template v-slot:title>
                                <b>Termo de busca?</b>
                            </template>
                            O termo de busta pode ser:
                            <ul>
                                <li>
                                    O número da linha
                                </li>
                                <li>
                                    O nome da linha no sentido principal
                                </li>
                                <li>
                                    O nome da linha no sentido secundário
                                </li>
                            </ul>
                        </b-popover>
                    </template>
                </search-input>
            </b-col>

            <b-col cols="auto">
                <b-row no-gutters>
                    <b-col cols="auto" class="mr-20">
                        <dropdown-select-menu
                            title="Filtrar linhas pelo sentido"
                            :options="[
                                { value: 0, text: 'Mostrar em ambos sentidos' },
                                {
                                    value: 1,
                                    text: 'Mostrar no sentido principal'
                                },
                                {
                                    value: 2,
                                    text: 'Mostrar no sentido secundário'
                                }
                            ]"
                            @change="update_selected_way_filter"
                        />
                    </b-col>

                    <b-col cols="auto">
                        <dropdown-select-menu
                            title="Filtrar linhas pelo modo de operação"
                            empty-option="Pesquise alguma linha na barra de pesquisa"
                            :options="get_operation_options()"
                            @change="update_selected_operation_filter"
                        />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <paginated-list
            ref="list"
            :raw-data="filtered_lines"
            :empty-option="empty_option"
            :properties="properties"
        />

        <alert-box ref="alert" />
    </b-container>
</template>

<script>
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import SearchInput from "@/components/SearchInput";
import PaginatedList from "@/components/PaginatedList";
import AlertBox from "@/components/AlertBox";
import API from "@/util/api";

export default {
    // Lines são as linhas que atendem diversas paradas de ônibus
    name: "LinesPage",

    components: {
        DropdownSelectMenu,
        SearchInput,
        PaginatedList,
        AlertBox
    },

    data() {
        return {
            lines: [],
            filtered_lines: [],
            operation_options: [],
            way_option: 0,
            operation_option: 0,
            empty_option: {
                title: "Nenhuma linha a ser mostrada",
                subtitle: "Procure alguma linha na barrade pesquisa"
            },
            properties: [
                { title: "Número da linha", key: "number" },
                { title: "Sentido principal", key: "name_1" },
                { title: "Sentido secundário", key: "name_2" },
                { title: "Atende sentido", key: "way" }
            ]
        };
    },

    watch: {
        lines() {
            if (this.lines.length !== 0) {
                this.operation_options = [
                    ...new Set(
                        this.lines.map(line => line.number.split("-")[1])
                    )
                ].sort();

                this.operation_options.unshift("Mostrar em todos modos");
            }
        }
    },

    methods: {
        get_operation_options() {
            const options = [];

            for (let i = 0; i < this.operation_options.length; i++) {
                options.push({
                    value: i,
                    text: this.operation_options[i]
                });
            }

            return options;
        },

        get_line_way_text(way) {
            return way === 1 ? "Principal" : "Secundário";
        },

        get_line_way_number(way) {
            return way === "Principal" ? 1 : 2;
        },

        filter_result(val, filter_func) {
            if (val == 0) {
                this.filtered_lines = this.lines;
                this.way_option = this.operation_option = 0;
            } else {
                this.filtered_lines = this.filtered_lines.filter(filter_func);
            }

            this.$refs.list.reset_data(this.filtered_lines);
            this.$refs.alert.fire_message(
                "Linhas filtradas com sucesso",
                "success"
            );
        },

        update_selected_way_filter(val) {
            this.way_option = val;
            this.filter_result(
                val,
                line => this.get_line_way_number(line.way) == val
            );
        },

        update_selected_operation_filter(val) {
            this.operation_option = val;
            this.filter_result(val, line =>
                line.number.endsWith(`-${this.operation_options[val]}`)
            );
        },

        async search_term(term) {
            try {
                const response = await API.get("Linha/Buscar", {
                    params: { termosBusca: term }
                });
                const lines = response.data;
                this.lines = [];

                lines.forEach(line => {
                    this.lines.push({
                        number: `${line.lt}-${line.tl}`,
                        name_1: line.tp,
                        name_2: line.ts,
                        way: this.get_line_way_text(line.sl)
                    });
                });

                this.filtered_lines = this.lines;
                this.$refs.list.reset_data(this.filtered_lines);

                if (this.lines.length === 0) {
                    this.$refs.alert.fire_message(
                        "Não existe linhas para sua busca",
                        "warning"
                    );
                }
            } catch (error) {
                this.$refs.alert.fire_message(
                    `Erro com o servidor
                        erro: ${error}
                        Tente pesquisar novamente ou recarregue a página`,
                    "danger"
                );
            }
        }
    }
};
</script>
