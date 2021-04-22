<template>
    <span :class="{'state1': state === 1, 
        'state2': state === 2 }">
        {{ taskStateMap[state] }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { taskStateMap } from '@/utils/const'

export default defineComponent ({
    props: ['state'],
    setup(props, ctx) {
        return {
            taskStateMap,
        }
    }
})
</script>

<style lang="scss" scoped>
.state1 {
    color: orange;
}
.state2 {
    color: green;
}
</style>