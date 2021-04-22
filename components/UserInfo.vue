<template>
  <div class="user-info">
      <!-- <el-avatar size="medium"></el-avatar> -->
      <div class="avatar">{{ namePhoto }}</div>
      <span class="name">{{ user.name || name }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch, ref } from "@vue/composition-api";

export default defineComponent ({
    setup(props, ctx) {
        const user = computed(() => ctx.root.$store.state)
        const name = ref<string | null>('')
        
        const namePhoto = ref(user.value?.name.slice(-1) || '')
        if (process.client) {
            if (!namePhoto.value) {
                name.value = window.sessionStorage.getItem('name')
                namePhoto.value = window.sessionStorage.getItem('name')?.slice(-1)
            }
        }

        return {
            user,
            namePhoto,
            name,
        }
    }
})
</script>

<style lang="scss" scoped>
.user-info {
    display: flex;
    align-items: center;
    .avatar {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        background: #388eff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .name {
        margin-left: 10px;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
