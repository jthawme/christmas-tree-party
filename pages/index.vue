<template>
  <div class="main">
    <TreeEditor v-if="editorView" :parts="parts" @update="onUpdate" />

    <Scene v-else :debug="false" class="three">
      <TreePreview :parts="parts" />
    </Scene>

    <nav>
      <button @click="() => (editorView = true)" :disabled="editorView">
        Editor
      </button>
      <button @click="() => (editorView = false)" :disabled="!editorView">
        Preview
      </button>
      <a href="/room" target="_blank"> View all </a>
    </nav>
  </div>
</template>

<script>
import TreeEditor from "~/components/TreeEditor.vue";
import TreePreview from "~/components/TreePreview.vue";
import Scene from "~/components/Scene.vue";
export default {
  components: { TreeEditor, Scene, TreePreview },
  data() {
    return {
      parts: [],
      editorView: true,
    };
  },
  methods: {
    onUpdate(parts) {
      this.parts = parts.slice(0, 50);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
}

.three {
  height: 100vh;
}

nav {
  position: fixed;

  bottom: 0;
  left: 0;

  width: 100%;

  display: flex;

  z-index: 10;
  border-top: #ccc;
  background-color: skyblue;

  button,
  a {
    padding: 20px;

    flex-grow: 1;

    border: none;
    background-color: transparent;

    text-align: center;

    text-decoration: none;
    color: inherit;
  }
}
</style>
