<template>
    <b-col cols="12">
        <b-row align-h="between">
            <b-col class="mb-20" cols="12">
                <search-input
                    placeholder="Digite o nome da linha..."
                    @submit="search_line"
                >
                    <template v-slot:append>
                        <dropdown-select-menu
                            title="Selecione o sentido da parada"
                            selected="0"
                            :options="[
                                { value: 0, text: 'Principal' },
                                { value: 1, text: 'Secundária' }
                            ]"
                            @change="way_option = $event + 1"
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
                    @change="line_index = $event"
                />
            </b-col>
            <b-col cols="auto">
                <b-button
                    :disabled="line_index === null"
                    @click="$emit('line-searched', lines[line_index])"
                >
                    Pesquisar
                </b-button>
            </b-col>
        </b-row>
    </b-col>
</template>

<script>
import DropdownSelectMenu from "@/components/DropdownSelectMenu";
import SearchInput from "@/components/SearchInput";
import API from "@/util/api";

export default {
    name: "LineSearch",

    components: {
        SearchInput,
        DropdownSelectMenu
    },

    data() {
        return {
            way_option: 1,
            line_index: null,
            lines: []
        };
    },

    methods: {
        get_lines_options() {
            const options = [];

            for (let i = 0; i < this.lines.length; i++) {
                let line = this.lines[i];

                options.push({
                    value: i,
                    text: `${line.number} » ${line.name}`
                });
            }

            return options;
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
