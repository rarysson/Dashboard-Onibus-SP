<template>
    <div class="container">
        <b-icon-exclamation-circle-fill
            variant="danger"
            style="width: 100px; height: 100px;"
        />
        <h1>A página que você digitou não existe</h1>
        <b-button variant="info" to="/">Voltar para a página inicial</b-button>
    </div>
</template>

<script>
export default {
    name: "Error404page"
};
</script>

<style scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.container > *:not(:first-child) {
    margin: 25px 0;
}
</style>
