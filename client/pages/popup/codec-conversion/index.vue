<template>
    <div class="modal-container">
        <codecChangeModal> </codecChangeModal>
    </div>
</template>


<script>
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.refreshToken()
    }
}
</script>

<style scoped lang="sass">
.modal-container
    width: 100%
    height: 100%
</style>