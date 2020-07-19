<template>
    <div v-if="!conditionVar">
        <b-icon-eye />
        {{ visibleMessage }}
    </div>
    <div v-else>
        <b-icon-eye-slash />
        {{ hiddenMessage }}
    </div>
</template>

<script>
export default {
    name: "EyeIconMsg",

    props: {
        conditionVar: {
            type: Boolean,
            required: true
        },

        visibleMessage: {
            type: String,
            required: true
        },

        hiddenMessage: {
            type: String,
            required: true
        }
    }
};
</script>
