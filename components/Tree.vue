<script>
import * as THREE from "three";
import {
  getBauble,
  getCar,
  getTree,
  getCash,
  getTank,
  getGlasses,
  getRainbow,
} from "~/assets/js/models";
import { deg2rad } from "~/assets/js/utils";

const COLOR = {
  gold: 0xffd700,
  red: 0xff0000,
};

export default {
  props: {
    parts: {
      type: Array,
      required: true,
      validator(val) {
        return val.every((v) => v.data.type && v.x && v.y);
      },
    },
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
  },
  watch: {
    parts(val) {
      this.addObjects(val);
    },
    x(val) {
      this.tree.position.x = val;
    },
    y(val) {
      this.tree.position.y = val + 5;
    },
    z(val) {
      this.tree.position.z = val;
    },
  },
  computed: {
    engine() {
      return this.$parent.engine;
    },
  },
  async mounted() {
    const models = await Promise.all([
      getCar(1),
      getCash(20),
      getTank(1),
      getGlasses(1),
    ]);

    this.tree = getTree();
    this.tree.rotateX(deg2rad(180));

    this.raycaster = new THREE.Raycaster();
    this.baubles = {};

    this.objectGroup = new THREE.Group();
    // this.objectGroup.rotateY(deg2rad(180));
    this.addObjects(this.parts);

    this.tree.add(this.objectGroup);
    this.tree.position.set(this.x, this.y + 5, this.z);
    this.tree.rotateY(deg2rad(180));
    // this.tree.visible = false;
    this.engine.addObject(this.tree);
  },
  beforeDestroy() {
    this.engine.removeObject(this.tree);
  },
  render() {
    return null;
  },
  methods: {
    getBauble(color) {
      if (!this.baubles[color]) {
        this.baubles[color] = getBauble(0.5, COLOR[color], color);
      }

      return this.baubles[color].clone();
    },
    addObjects(newParts = []) {
      const leaves = this.tree.getObjectByName("leaves");
      const boundingBox = new THREE.Box3().setFromObject(leaves);

      const wid = boundingBox.max.x - boundingBox.min.x;
      const hei = boundingBox.max.y - boundingBox.min.y;

      const w = (perc) => wid * (perc * 0.98) + boundingBox.min.x;
      const h = (perc) => hei * perc + boundingBox.min.y;

      newParts.forEach(async (part) => {
        const obj = this.objectGroup.getObjectByName(part.id);

        if (!obj) {
          this.raycaster.set(
            new THREE.Vector3(w(part.x), h(part.y), 100),
            new THREE.Vector3(0, 0, -1)
          );

          const intersects = this.raycaster.intersectObject(leaves, true);

          const target = intersects.length
            ? intersects[0].point
            : new THREE.Vector3(w(part.x), h(part.y), 0);

          const normal = intersects.length
            ? intersects[0].face.normal.normalize()
            : new THREE.Vector3(0, 0, 0);

          if (part.data.type === "bauble") {
            const b = this.getBauble(part.data.color);

            b.position.set(...target);
            b.position.x = -target.x;
            b.position.y = target.y;
            b.name = part.id;

            this.objectGroup.add(b);
          }

          if (part.data.type === "car") {
            const c = (await getCar(1)).clone();
            c.position.set(...target);
            c.position.y = target.y;
            c.position.x = -target.x;
            c.position.z = target.z + 1.5;
            c.rotation.set(...normal);
            c.name = part.id;

            this.objectGroup.add(c);
          }

          if (part.data.type === "cash") {
            const c = (await getCash(20)).clone();
            c.position.set(...target);
            c.position.y = target.y;
            c.position.x = -target.x;
            c.position.z = target.z + 1;
            c.rotation.set(...normal);
            c.name = part.id;

            this.objectGroup.add(c);
          }

          if (part.data.type === "tank") {
            const c = (await getTank(1)).clone();
            c.position.set(...target);
            c.position.y = target.y;
            c.position.x = -target.x;
            c.position.z = target.z;
            // c.rotation.set(...intersects[0].face.normal);
            c.rotation.set(...normal);
            c.rotateZ(deg2rad(180));
            c.rotateX(deg2rad(40));
            c.name = part.id;

            this.objectGroup.add(c);
          }

          if (part.data.type === "glasses") {
            const c = (await getGlasses(1)).clone();
            c.position.set(...target);
            c.position.y = target.y;
            c.position.x = -target.x;
            c.position.z = target.z + 2.5;
            // c.rotation.set(normal.x, normal.y, deg2rad(180));
            c.rotation.set(0, deg2rad(-50 + normal.y * 10), deg2rad(180));
            // c.rotation.set(...normal);
            // c.rotation.set(...intersects[0].face.normal);
            // c.rotateZ(deg2rad(180));
            // c.rotateX(deg2rad(40));
            c.name = part.id;

            this.objectGroup.add(c);
          }

          if (part.data.type === "rainbow") {
            const c = (await getRainbow(1)).clone();
            c.position.set(...target);
            c.position.y = target.y;
            c.position.x = -target.x;
            c.position.z = target.z + 1.5;
            c.rotation.set(normal.x, normal.y, deg2rad(180));
            // c.rotation.set(...intersects[0].face.normal);
            // c.rotateZ(deg2rad(180));
            // c.rotateX(deg2rad(40));
            c.name = part.id;

            this.objectGroup.add(c);
          }
        }
      });
    },
    rotate(deg) {
      if (this.tree) {
        this.tree.rotation.y += deg;
      }
    },
  },
};
</script>