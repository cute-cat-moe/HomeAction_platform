<template>
  <span>
      <span v-if="finded" class="yes">是</span>
      <span v-else class="no">否</span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent ({
    props: ['finded'],
})
</script>

<style lang="scss" scoped>
.yes {
    color: green;
}
.no {
    color: red;
}
</style>