<template>
  <span>
    <slot />

    <!-- <Plane ref="plane" :color="0xffffff" /> -->
  </span>
</template>

<script>
import * as THREE from "three";
import Plane from "./Plane.vue";
import { deg2rad, listenCb, mapRange, tickUpdate } from "~/assets/js/utils";
import {
  getBauble,
  getCar,
  getCash,
  getGlasses,
  getRainbow,
  getTank,
} from "~/assets/js/models";
const COLOR = {
  gold: 0xffd700,
  red: 0xff0000,
};

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
  async mounted() {
    this.spot = new THREE.SpotLight(0xffffff, 0.5);
    this.spot.position.set(20, 50, 20);
    this.engine.scene.add(this.spot);

    this.ambient = new THREE.AmbientLight(0xffffff, 0.65);
    this.engine.scene.add(this.ambient);

    // this.engine.scene.background = new THREE.Color(0x81d4fa);
    this.engine.camera.position.set(0, 80, 100);
    this.engine.camera.lookAt(
      new THREE.Vector3(
        this.engine.scene.position.x,
        this.engine.scene.position.y,
        this.engine.scene.position.z
      )
    );

    // const model = await getCash(400);

    // const model = await getCar(20);
    // model.position.y = -5;

    // const model = await getTank(20);
    // model.position.y = -20;

    // const model = getBauble(20, COLOR["gold"], "gold");
    const model = getBauble(20, COLOR["red"], "red");

    // const model = await getGlasses(25);
    // model.rotateY(deg2rad(25));
    // model.position.y = -50;
    // model.position.z = 10;
    // model.position.x = 20;

    // const model = await getRainbow(25);
    // model.position.y = -15;
    // model.position.x = 5;

    model.rotateY(deg2rad(45));
    this.engine.addObject(model);

    this.unlisten = [
      () => {
        this.engine.scene.remove(this.spot);
        // this.engine.scene.remove(this.helper);
        this.engine.scene.remove(this.ambient);
      },
    ];

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
};
</script>

<style lang="scss" scoped>
</style>