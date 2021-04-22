<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/notice/principle' }">新闻中心</el-breadcrumb-item>
              <el-breadcrumb-item>新闻编辑</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="table_card">
      <div slot="header">
        <div class="infos">
          <i class="el-icon-edit"></i>
          <el-tag class="tag1">
            <span>新闻编辑</span>
            <div class="upload">
              <el-button type="primary" @click="handleSubmit" round>提交</el-button>
              <el-button type="info" @click="handleClear" round>清空</el-button>
            </div>
          </el-tag>
        </div>
      </div>

      <editor
        class="editor-container"
        :plugins="plugins"
        :value="mdContent"
        :locale="locale"
        @change="handleContentChange">
      </editor>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from "@vue/composition-api";
  import { Editor, Viewer} from "@bytemd/vue"
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight-ssr'
  import footnotes from '@bytemd/plugin-footnotes'
  import frontmatter from '@bytemd/plugin-frontmatter'
  import geomoji from '@bytemd/plugin-gemoji'
  import math from '@bytemd/plugin-math'
  import zh_Hans from 'bytemd/lib/locales/zh_Hans.json'

export default defineComponent ({
  components: {
    Editor,
    Viewer,
  },
  setup(props, ctx) {
    const mdContent = ref('')
    const plugins =  ref([
      gfm(),
      highlight(),
      geomoji(),
      footnotes(),
      frontmatter(),
      math(),
    ])
    const locale = computed(() => zh_Hans)
    const handleContentChange = (text: string) => {
      mdContent.value = text
    }

    const handleSubmit = () => {
      ctx.root.$message.success('提交成功')
    }

    const handleClear = () => {
      mdContent.value = ''
    }

    return {
      mdContent,
      plugins,
      handleContentChange,
      locale,
      handleSubmit,
      handleClear,
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: calc(100% - 10px);
}
.editor-container {
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  .header {
    border: 2px solid #DCDFE6;
    padding: 10px;
    border-radius: 15px;
    background: #f2f2f2;
  }
  .infos {
    width: 100%;
    padding: 20px 30px;
    position: relative;
    font-size: 20px;
    font-weight: bolder;
    .tag1 {
      margin-left: 20px;
      font-size: 20px;
      font-weight: bolder;
      border-radius: 10px;
      elevation: higher;
    }
    .upload {
      width: 200px;
      position: absolute;
      top: 20px;
      right: 30px;
      display: flex;
    }
  }
  .top_card {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
    /*background-color: #f2f2f2;*/
    background: url("../../pages/asset/朦胧背景3.jpg");
    outline-width: 1px;
    border-bottom-color: #f2f2f2;
    elevation: lower;
    border-radius: 2px;
  }
  .table_card {
    height: 90%;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    background: url("../../pages/asset/卡片背景.png");
    /*background-color: #c4c4c4;*/
    /*background: url("../../pages/asset/黄色渐变.jpg");*/
  }
}
</style>

<style>
.bytemd {
  height: calc(100% - 200px);
}
.el-card__body {
  height: 100%;
}
</style>