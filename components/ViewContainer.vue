<template>
  <div>
      <main-header></main-header>
      <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import MainHeader from '@/components/MainHeader.vue'

export default defineComponent ({
    components: {
        MainHeader,
    },
    setup() {}
})
</script>

<style>

</style>