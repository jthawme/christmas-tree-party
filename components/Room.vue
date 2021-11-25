<template>
  <span>
    <slot />

    <Plane ref="plane" :color="0xff6646" />
  </span>
</template>

<script>
import * as THREE from "three";
import Plane from "./Plane.vue";
import { deg2rad, listenCb, mapRange, tickUpdate } from "~/assets/js/utils";

export default {
  props: {
    debug: {
      type: Boolean,
      default: false,
    },
  },
  components: { Plane },
  data() {
    return {
      perspective: true,
    };
  },
  computed: {
    engine() {
      return this.$parent.engine;
    },
  },
  mounted() {
    this.spot = new THREE.SpotLight(0xffffff, 0.5);
    this.spot.position.set(100, 50, 100);
    this.spot.castShadow = true;
    this.spot.shadow.mapSize.width = 1024; // default
    this.spot.shadow.mapSize.height = 1024; // default
    this.spot.shadow.bias = -0.0001;
    // this.helper = new THREE.DirectionalLightHelper(this.spot, 5);
    // this.engine.scene.add(this.helper);
    this.engine.scene.add(this.spot);

    this.ambient = new THREE.AmbientLight(0xff6646, 0.25);
    this.engine.scene.add(this.ambient);
    this.ambient2 = new THREE.AmbientLight(0xffffff, 0.8);
    this.engine.scene.add(this.ambient2);

    const color = 0xff6646;
    const near = 0;
    const far = 300;
    this.engine.scene.fog = new THREE.Fog(color, near, far);

    this.engine.scene.background = new THREE.Color(0xff6646);

    if (!this.perspective) {
      this.engine.camera.position.set(0, 500, 200);
      this.engine.camera.rotation.set(deg2rad(-20), 0, deg2rad(180));
      this.engine.camera.zoom = 1.6;
      this.engine.camera.updateProjectionMatrix();

      this.engine.group.position.set(-this.engine.width / 2, 0, 0);
    } else {
      this.engine.camera.position.set(0, 80, 100);
      this.engine.camera.lookAt(
        new THREE.Vector3(
          this.engine.scene.position.x,
          this.engine.scene.position.y + 45,
          this.engine.scene.position.z
        )
      );
    }

    this.unlisten = [
      () => {
        this.engine.scene.remove(this.spot);
        // this.engine.scene.remove(this.helper);
        this.engine.scene.remove(this.ambient);
        this.engine.scene.remove(this.ambient2);
      },
    ];

    if (!this.debug) {
      this.unlisten.push(
        listenCb(document, "mousemove", tickUpdate(this.onMouseMove.bind(this)))
      );
      this.unlisten.push(
        listenCb(document, "touchmove", tickUpdate(this.onTouchMove.bind(this)))
      );
    }

    // if (this.engine.controls) {
    //   this.engine.controls.target = new THREE.Vector3(
    //     this.engine.scene.position.x,
    //     this.engine.scene.position.y + 20,
    //     this.engine.scene.position.z
    //   );
    //   this.engine.controls.update();
    // }
  },
  beforeDestroy() {
    this.unlisten.forEach((cb) => {
      cb();
    });
  },
  methods: {
    onTouchMove(e) {
      this.setCamera(
        e.touches[0].pageX / this.engine.width,
        e.touches[0].pageY / this.engine.height
      );
    },
    onMouseMove(e) {
      this.setCamera(e.pageX / this.engine.width, e.pageY / this.engine.height);
    },
    setCamera(x, y) {
      this.engine.camera.position.x = mapRange(x, 0, 1, -40, 40);
      this.engine.camera.position.y = mapRange(y, 0, 1, 80, 10);
      this.engine.camera.lookAt(
        new THREE.Vector3(
          this.engine.scene.position.x,
          this.engine.scene.position.y + 30,
          this.engine.scene.position.z
        )
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>