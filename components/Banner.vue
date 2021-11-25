<script>
import * as THREE from "three";
import { getBanner } from "~/assets/js/models";
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
    text: {
      type: String,
      default: "",
    },
  },
  watch: {
    x(val) {
      this.banner.position.x = val;
    },
    y(val) {
      this.banner.position.y = val;
    },
    z(val) {
      this.banner.position.z = val;
    },
    text(val) {
      this.writeText(val);
    },
  },
  computed: {
    engine() {
      return this.$parent.engine;
    },
  },
  async mounted() {
    const { group, ctx, texture } = getBanner(70, 55);
    this.banner = group;
    this.ctx = ctx;
    this.texture = texture;

    this.banner.position.set(this.x, this.y, this.z);

    this.engine.addObject(this.banner);

    this.writeText(this.text);
  },
  beforeDestroy() {
    this.engine.removeObject(this.banner);
  },
  methods: {
    writeText(txt) {
      const paper = this.banner.getObjectByName("paper");

      const w = (p) => p * this.ctx.canvas.width;
      const h = (p) => p * this.ctx.canvas.height;

      this.ctx.font = `${w(0.05)}px sans-serif`;
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, w(1), h(1));
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(txt, w(0.5), h(0.5));

      this.ctx.font = `${w(0.02)}px sans-serif`;
      this.ctx.fillText("🎁 Merry XMAS From ya boi JT 🎅", w(0.5), h(0.85));

      this.texture.needsUpdate = true;
      const texture = new THREE.CanvasTexture(this.ctx.canvas);
      paper.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture,
      });
    },
  },
  render() {
    return null;
  },
};
</script>