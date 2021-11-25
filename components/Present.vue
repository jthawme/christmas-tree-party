<script>
import * as THREE from "three";
import { getPresent } from "~/assets/js/models";
import { deg2rad } from "~/assets/js/utils";
export default {
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    z: {
      type: Number,
      default: 0,
    },
    r: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 5,
    },
    color: {
      type: Number,
      default: 0xff0000,
    },
  },
  watch: {
    x(val) {
      this.present && (this.present.position.x = val);
    },
    y(val) {
      this.present && (this.present.position.y = val);
    },
    z(val) {
      this.present && (this.present.position.z = val);
    },
    r(val) {
      this.present && (this.present.rotation.y = deg2rad(val));
    },
  },
  computed: {
    engine() {
      return this.$parent.engine;
    },
  },
  async mounted() {
    this.present = await getPresent(this.size, this.color);
    this.present.traverse((child) => {
      // if (child.name === "Cube001") {
      if (child.material && child.material.name === "M_Box") {
        // console.log(child.material);
        child.material = new THREE.MeshStandardMaterial({
          color: this.color,
        });
      }
    });

    this.present.position.set(this.x, this.y, this.z);
    this.present.rotation.y = deg2rad(this.r);

    this.engine.addObject(this.present);
  },
  beforeDestroy() {
    this.engine.removeObject(this.present);
  },
  render() {
    return null;
  },
};
</script>