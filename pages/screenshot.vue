<template>
  <div class="main">
    <Scene :debug="debug" class="three">
      <Platform :debug="debug" />
    </Scene>
  </div>
</template>

<script>
import Scene from "~/components/Scene.vue";
import Platform from "~/components/Platform.vue";

export default {
  components: { Scene, Platform },
  data() {
    return {
      debug: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.three {
  width: 400px;
  height: 400px;

  outline: 1px solid black;
}
</style>
