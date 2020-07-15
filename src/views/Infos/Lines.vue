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
                                        A primeira parte do número da linha
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
                <b-dropdown text="Filtrar linhas pelo sentido">
                    <b-dropdown-form>
                        <b-form-group>
                            <b-form-radio v-model="selected" value="both">
                                Mostrar em ambos sentidos
                            </b-form-radio>
                            <b-form-radio v-model="selected" value="main">
                                Mostrar no sentido principal
                            </b-form-radio>
                            <b-form-radio v-model="selected" value="secondary">
                                Mostrar no sentido secundário
                            </b-form-radio>
                        </b-form-group>
                    </b-dropdown-form>
                </b-dropdown>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: "LinesPage",

    data() {
        return {
            term: "",
            selected: "both"
        };
    },

    methods: {
        search_term() {}
    }
};
</script>

<style scoped></style>
