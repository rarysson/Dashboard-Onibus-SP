<template>
    <div class="home-container">
        <h1>Dashboard</h1>
        <b-img fluid src="@/assets/logos/logo.png" />
    </div>
</template>

<script>
export default {
    name: "HomePage"
};
</script>

<style scoped>
.home-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    margin-bottom: 20px;
    text-transform: uppercase;
    font-weight: bolder;
}
</style>
