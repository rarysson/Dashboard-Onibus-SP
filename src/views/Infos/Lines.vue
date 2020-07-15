<template>
    <b-container fluid>
        <b-row align-h="between">
            <b-col cols="auto">
                <b-form @submit.prevent="search_term">
                    <b-input-group>
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

                        <b-form-input
                            placeholder="Digite o termo de busca..."
                            required
                            v-model="term"
                        />

                        <template v-slot:append>
                            <b-button type="submit">
                                <b-icon-search />
                            </b-button>
                        </template>
                    </b-input-group>
                </b-form>
            </b-col>

            <b-col cols="auto">
                <b-dropdown text="Filtrar linhas pelo sentido" offset="-75">
                    <b-dropdown-item-button>
                        <b-form-radio v-model="selected" value="0">
                            Mostrar em ambos sentidos
                        </b-form-radio>
                    </b-dropdown-item-button>
                    <b-dropdown-divider />

                    <b-dropdown-item-button>
                        <b-form-radio v-model="selected" value="1">
                            Mostrar no sentido principal
                        </b-form-radio>
                    </b-dropdown-item-button>
                    <b-dropdown-divider />

                    <b-dropdown-item-button>
                        <b-form-radio v-model="selected" value="2">
                            Mostrar no sentido secundário
                        </b-form-radio>
                    </b-dropdown-item-button>
                </b-dropdown>
            </b-col>
        </b-row>

        <b-row class="data-row">
            <b-col cols="12" style="overflow: hidden">
                <b-list-group v-if="filtred_lines.length === 0">
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
                                {{ line.first_label }}-{{ line.second_label }}
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
import API from "@/util/api";

export default {
    // Lines são as linhas que atendem diversas paradas de ônibus
    name: "LinesPage",

    data() {
        return {
            term: "",
            selected: 0, //0 = ambos sentidos; 1 = sentido principal; 2 = sentido secundário
            lines: [],
            filtred_lines: [],
            paginated_lines: [],
            current_page: 1,
            per_page: 5
        };
    },

    watch: {
        selected(val) {
            if (val == 0) {
                this.filtred_lines = this.lines;
            } else {
                this.filtred_lines = this.lines.filter(line => line.way == val);
            }

            this.current_page = 1;
            this.paginate(this.per_page, 0);
        }
    },

    computed: {
        total_rows() {
            return this.filtred_lines.length;
        }
    },

    methods: {
        async search_term() {
            try {
                const response = await API.get("Linha/Buscar", {
                    params: { termosBusca: this.term }
                });
                const lines = response.data;
                this.lines = [];

                lines.forEach(line => {
                    this.lines.push({
                        first_label: line.lt,
                        second_label: line.tl,
                        name_1: line.tp,
                        name_2: line.ts,
                        way: line.sl
                    });
                });

                this.filtred_lines = this.lines;
                this.paginate(this.per_page, 0);
            } catch (error) {
                console.log(error);
            }
        },

        paginate(page_size, page_number) {
            this.paginated_lines = this.filtred_lines.slice(
                page_number * page_size,
                (page_number + 1) * page_size
            );
        },

        page_changed(page) {
            this.paginate(this.per_page, page - 1);
        },

        get_line_way(way) {
            return way === 1 ? "Principal" : "Secundário";
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
