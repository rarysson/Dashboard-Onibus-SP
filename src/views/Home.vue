<template>
    <div>
        <h1>Dashboard SP Trans</h1>
        <b-button variant="success">Bootstrap instalado</b-button>

        <ul v-if="corredores && corredores.length">
            <li v-for="(corredor, i) of corredores" :key="i">
                <p>
                    <strong>ID: {{ corredor.cc }}</strong>
                </p>
                <p>Nome: {{ corredor.nc }}</p>
            </li>

            <strong>Axios instalado</strong>
        </ul>

        <ul v-if="errors && errors.length">
            <li v-for="(error, i) of errors" :key="i">
                {{ error.message }}
            </li>
        </ul>
    </div>
</template>

<script>
import API from "../util/api";

export default {
    name: "Home",
    data() {
        return {
            corredores: [],
            errors: []
        };
    },

    async created() {
        try {
            const response = await API.get("Corredor");
            this.corredores = response.data;
        } catch (e) {
            this.errors.push(e);
        }
    }
};
</script>
