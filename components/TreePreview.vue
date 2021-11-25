<template>
  <span>
    <Tree ref="tree" :parts="parts" />
    <Plane ref="plane" :color="0x81d4fa" />
  </span>
</template>

<script>
import * as THREE from "three";
import Tree from "./Tree.vue";
import { deg2rad, listenCb, mapRange, tickUpdate } from "~/assets/js/utils";
import Plane from "./Plane.vue";

export default {
  props: {
    parts: {
      type: Array,
      required: true,
      validator(val) {
        return val.every((v) => v.data.type && v.x && v.y);
      },
    },
  },
  components: { Tree, Plane },
  computed: {
    engine() {
      return this.$parent.engine;
    },
  },
  mounted() {
    const spot = new THREE.SpotLight(0xffffff, 0.75, 1000);
    spot.position.set(100, 100, 100);
    spot.target.position.set(0, 10, 0);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024; // default
    spot.shadow.mapSize.height = 1024; // default
    spot.shadow.bias = -0.0005;
    this.engine.scene.add(spot);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    this.engine.scene.add(ambient);

    this.engine.scene.background = new THREE.Color(0x81d4fa);
    this.engine.camera.position.set(0, 20, 100);
    this.engine.camera.lookAt(
      this.engine.scene.position.x,
      this.engine.scene.position.y + 20,
      this.engine.scene.position.z
    );

    if (!this.engine.controls) {
      this.engine._setupControls(true);
    }

    this.engine.controls.target = new THREE.Vector3(
      this.engine.scene.position.x,
      this.engine.scene.position.y + 20,
      this.engine.scene.position.z
    );
    this.engine.controls.update();

    this.unlisten = [
      listenCb(document, "mousemove", tickUpdate(this.onMouseMove.bind(this))),
    ];
    // this.unlisten = this.engine.render(() => {
    //   this.$refs.tree.rotate(deg2rad(0.1));
    // });
  },
  beforeDestroy() {
    this.unlisten && this.unlisten.forEach((cb) => cb());
  },
  methods: {
    onMouseMove(e) {
      this.engine.camera.position.x = mapRange(
        e.pageX / this.engine.width,
        0,
        1,
        -40,
        40
      );
      this.engine.camera.position.y = mapRange(
        e.pageY / this.engine.height,
        0,
        1,
        80,
        10
      );
      this.engine.camera.lookAt(
        new THREE.Vector3(
          this.engine.scene.position.x,
          this.engine.scene.position.y + 20,
          this.engine.scene.position.z
        )
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>