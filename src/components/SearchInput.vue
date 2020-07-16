<template>
    <b-form @submit.prevent="submit">
        <b-input-group>
            <template v-slot:prepend>
                <slot name="prepend" />
            </template>

            <b-form-input :placeholder="placeholder" required v-model="term" />

            <template v-slot:append>
                <b-button type="submit">
                    <b-icon-search />
                </b-button>
            </template>
        </b-input-group>
    </b-form>
</template>

<script>
export default {
    name: "SearchInput",

    props: ["placeholder"],

    data() {
        return {
            term: null
        };
    },

    methods: {
        submit() {
            this.$emit("submit", this.term);
        }
    }
};
</script>
