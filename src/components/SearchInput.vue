<template>
    <b-form @submit.prevent="submit">
        <b-input-group class="group">
            <template v-slot:prepend>
                <slot name="prepend" />
            </template>

            <b-form-input
                :placeholder="placeholder"
                class="input"
                required
                v-model="term"
            />

            <template v-slot:append>
                <slot name="append" />

                <b-button variant="info" type="submit">
                    <b-icon-search />
                </b-button>
            </template>
        </b-input-group>
    </b-form>
</template>

<script>
export default {
    name: "SearchInput",

    props: {
        placeholder: {
            type: String,
            required: true
        }
    },

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

<style scoped>
@media (max-width: 600px) {
    .group {
        display: flex;
        flex-direction: column;
    }

    .input {
        width: 100%;
    }
}
</style>
