<template>
  <div class="main">
    <Scene :debug="debug" class="three" :perspective="perspective">
      <Room :debug="debug">
        <Banner :z="-10" :text="bannerText" />
        <Present :x="20" :y="4" :size="4" />
        <Present :x="-20" :y="2" :size="2" :r="-45" :color="0xffff00" />
        <Present
          :x="-10"
          :y="2.5"
          :z="15"
          :size="2.5"
          :r="-45"
          :color="0x00ffff"
        />

        <Tree v-if="latestTree" v-bind="latestTree" :key="latestTree.id" />
        <Tree
          v-for="tree in positionedTrees.slice(1)"
          :key="tree.id"
          v-bind="tree"
        />
      </Room>
    </Scene>
  </div>
</template>

<script>
import Scene from "~/components/Scene.vue";
import { nanoid } from "nanoid";
import Tree from "~/components/Tree.vue";
import Room from "~/components/Room.vue";
import { makeNoise2D } from "fast-simplex-noise";
import Banner from "~/components/Banner.vue";
import Present from "~/components/Present.vue";
import { getTrees, listenForTrees } from "~/assets/js/db";

const DIST = 40;
const ROW_COUNT = 8;

export default {
  components: { Scene, Tree, Room, Banner, Present },
  computed: {
    centreX() {
      return (ROW_COUNT / 2) * DIST - DIST / 2;
    },
    latestTree() {
      if (!this.trees.length) {
        return false;
      }

      return { ...this.trees[0], x: 0 };
    },
    bannerText() {
      return this.latestTree ? this.latestTree.text : "Merry XMAS";
    },
    positionedTrees() {
      return this.trees.map((tree, idx) => {
        const row = Math.floor(idx / ROW_COUNT) + 1;

        const xMod = this.noise((idx % ROW_COUNT) / 64, row);
        const zMod = this.noise(idx % ROW_COUNT, row / 32);

        return {
          ...tree,
          x:
            (idx % ROW_COUNT) * DIST +
            xMod * (DIST / 2) -
            (this.perspective ? this.centreX : 0),
          z: row * -DIST + zMod * (DIST / 2),
        };
      });
    },
  },
  created() {
    this.noise = makeNoise2D();

    getTrees().then((trees) => {
      const sorted = Object.entries(trees).map(([key, value]) => ({
        id: key,
        timestamp: value.timestamp,
        ...value.value,
      }));
      sorted.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
      this.trees = sorted.reverse();
    });
    this.unlisten = listenForTrees((id, tree) => {
      const idx = this.trees.findIndex((t) => t.id === id);

      if (idx < 0) {
        this.trees = [
          {
            id,
            ...tree.value,
          },
          ...this.trees,
        ];
      } else {
        this.trees.splice(idx, 1, {
          id,
          ...tree.value,
        });
      }
    });
  },
  beforeDestroy() {
    this.unlisten();
  },
  data() {
    return {
      debug: false,
      perspective: true,
      trees: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.three {
  height: 100vh;
}
</style>
