<template>
    <b-form-select
        v-model="selected_item"
        :options="options"
        class="dropdown-menu-class"
    >
        <template v-slot:first>
            <b-form-select-option :value="null" disabled>
                {{ title }}
            </b-form-select-option>
        </template>

        <b-form-select-option
            v-if="options.length === 0"
            :value="null"
            disabled
        >
            {{ emptyOption }}
        </b-form-select-option>
    </b-form-select>
</template>

<script>
export default {
    name: "DropdownSelectMenu",

    props: {
        title: {
            type: String,
            required: true
        },

        options: {
            type: Array,
            required: true
        },

        selected: [String, Number],

        emptyOption: String
    },

    data() {
        return {
            selected_item: this.selected || null
        };
    },

    watch: {
        selected_item(val) {
            this.$emit("change", val);
        },

        selected(val) {
            this.selected_item = val;
        }
    }
};
</script>
