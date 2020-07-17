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
                    <b-col cols="auto" style="margin-right: 25px;">
                        <dropdown-select-menu
                            title="Filtrar linhas pelo sentido"
                            offset="-75"
                            selected="0"
                            :options="[
                                'Mostrar em ambos sentidos',
                                'Mostrar no sentido principal',
                                'Mostrar no sentido secundário'
                            ]"
                            @change="update_selected_way_filter"
                        />
                    </b-col>

                    <b-col cols="auto">
                        <dropdown-select-menu
                            title="Filtrar linhas pelo modo de operação"
                            empty-option="Pesquise alguma linha na barra de pesquisa"
                            :offset="get_offset_operation_menu()"
                            selected="0"
                            :options="operation_options"
                            @change="update_selected_operation_filter"
                        />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <b-row class="data-row">
            <b-col cols="12" style="overflow: hidden">
                <b-list-group v-if="filtered_lines.length === 0">
                    <b-list-group-item>
                        <b style="font-size: 1.5rem">
                            Nenhuma linha a ser mostrada
                        </b>
                        <br />
                        <i style="font-size: 0.8rem">
                            Procure alguma linha na barra de pesquisa
                        </i>
                    </b-list-group-item>
                </b-list-group>

                <b-list-group v-else id="lines-list">
                    <b-list-group-item
                        v-for="(line, index) in paginated_lines"
                        :key="index"
                        class="line-list-item"
                    >
                        <span class="line-number">
                            <b>Número da linha</b>
                            <span class="line-info">
                                {{ line.number }}
                            </span>
                        </span>
                        <br />

                        <span class="way">
                            <b>Sentido principal</b>
                            <span class="line-info">
                                {{ line.name_1 }}
                            </span>
                        </span>
                        <br />

                        <span class="way">
                            <b>Sentido secundário</b>
                            <span class="line-info">
                                {{ line.name_2 }}
                            </span>
                        </span>
                        <br />

                        <span class="way">
                            <b>Atende sentido</b>
                            <span class="line-info">
                                {{ get_line_way(line.way) }}
                            </span>
                        </span>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <b-pagination
                    align="right"
                    v-model="current_page"
                    :total-rows="total_rows"
                    :per-page="per_page"
                    @change="page_changed"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import SearchInput from "@/components/SearchInput";
import API from "@/util/api";

export default {
    // Lines são as linhas que atendem diversas paradas de ônibus
    name: "LinesPage",

    components: {
        DropdownSelectMenu,
        SearchInput
    },

    data() {
        return {
            lines: [],
            filtered_lines: [],
            paginated_lines: [],
            operation_options: [],
            current_page: 1,
            per_page: 5,
            old_term: ""
        };
    },

    computed: {
        total_rows() {
            return this.filtered_lines.length;
        }
    },

    watch: {
        lines() {
            this.operation_options = [
                ...new Set(this.lines.map(line => line.number.split("-")[1]))
            ].sort();

            this.operation_options.unshift("Mostrar em todos modos");
        }
    },

    methods: {
        async search_term(term) {
            if (term != this.old_term) {
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
                            way: line.sl
                        });
                    });

                    this.filtered_lines = this.lines;
                    this.paginate(this.per_page, 0);
                } catch (error) {
                    console.log(error);
                }
            }

            this.old_term = term;
        },

        paginate(page_size, page_number) {
            this.paginated_lines = this.filtered_lines.slice(
                page_number * page_size,
                (page_number + 1) * page_size
            );
        },

        page_changed(page) {
            this.paginate(this.per_page, page - 1);
        },

        get_line_way(way) {
            return way === 1 ? "Principal" : "Secundário";
        },

        get_offset_operation_menu() {
            return this.lines.length === 0 ? -60 : undefined;
        },

        get_operation_options() {
            // Itera todas as linhas e pega somente o modo de operação da linha
            // Depois remove todos os modos que são iguais
            // this.operation_options = [
            //     ...new Set(this.lines.map(line => line.number.split("-")[1]))
            // ];
            // console.log(this.operation_options);

            return this.operation_options;
        },

        update_selected_way_filter(val) {
            if (val == 0) {
                this.filtered_lines = this.lines;
            } else {
                this.filtered_lines = this.lines.filter(
                    line => line.way == val
                );
            }

            this.current_page = 1;
            this.paginate(this.per_page, 0);
        },

        update_selected_operation_filter(val) {
            if (val == 0) {
                this.filtered_lines = this.lines;
            } else {
                console.log(
                    this.operation_options,
                    this.operation_options[val]
                );
                this.filtered_lines = this.lines.filter(line =>
                    line.number.includes(`-${this.operation_options[val + 1]}`)
                );
            }

            this.current_page = 1;
            this.paginate(this.per_page, 0);
        }
    }
};
</script>

<style scoped>
.data-row {
    height: 70vh;
    margin-top: 50px;
}

.line-list-item {
    display: flex;
    padding: 0;
    margin-bottom: 20px;
    border: 1px solid black;
    border-radius: 5px;
}

.line-list-item span {
    flex-basis: 25%;
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.line-list-item span:not(:last-child) {
    border-right: 1px solid black;
}

.line-list-item b {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid black;
}

.line-number,
.way {
    font-size: 1.1rem;
}

.line-info {
    font-size: 0.9rem;
}
</style>
