<template>
    <span :class="{'level1': level === 1, 
        'level2': level === 2, 
        'level3': level === 3 }">
        {{ taskLevelMap[level] }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { taskLevelMap } from '@/utils/const'

export default defineComponent ({
    props: ['level'],
    setup(props, ctx) {
        return {
            taskLevelMap,
        }
    }
})
</script>

<style lang="scss" scoped>
.level1 {
    color: red;
}
.level2 {
    color: orange;
}
.level3 {
    color: blue;
}
</style>