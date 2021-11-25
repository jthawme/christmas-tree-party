<template>
  <div class="wrapper" :class="{ debug }">
    <canvas ref="canvas"></canvas>

    <span v-if="mountChildren">
      <slot />
    </span>
  </div>
</template>

<script>
import { MainEngine } from "~/assets/js/engine";
import { listenCb, tickUpdate } from "~/assets/js/utils";

export default {
  props: {
    debug: {
      type: Boolean,
      default: false,
    },
    zoom: {
      type: Number,
      default: 1,
    },
    perspective: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      mountChildren: false,
    };
  },
  beforeMount() {
    this.unlisten = [];
    this.unlisten.push(
      listenCb(window, "resize", tickUpdate(this.onWindowResize.bind(this)))
    );
    this.unlisten.push(
      listenCb(
        window,
        "orientationchange",
        tickUpdate(this.onWindowResize.bind(this))
      )
    );

    this.engine = new MainEngine(this.debug, this.zoom, this.perspective);
  },
  mounted() {
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;
    this.fireSize();
    this.engine.setup(this.$refs.canvas, this.width, this.height);

    this.mountChildren = true;

    this.start();
  },
  beforeDestroy() {
    this.unlisten.forEach((cb) => cb());
    this.engine.destroy();
  },
  methods: {
    start() {
      this.engine.start();
    },

    onWindowResize() {
      this.onResize({
        width: this.$el.clientWidth,
        height: this.$el.clientHeight,
      });
    },

    onResize({ width, height }) {
      this.width = width;
      this.height = height;

      this.engine.resize(this.width, this.height);
      this.fireSize();
    },

    fireSize() {
      this.$emit("size", {
        width: this.width,
        height: this.height,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;

  touch-action: none;

  canvas {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    z-index: 10;
  }
}
</style>
