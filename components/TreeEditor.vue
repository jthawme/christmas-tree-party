<template>
  <div class="wrapper" :class="{ active: activeDrop }">
    <div class="left">
      <Canvas
        v-if="mountCanvas"
        ref="canvas"
        @mounted="onMount"
        @resize="onResize"
        @click.native="onClick"
        class="container"
      />
    </div>

    <aside>
      <div class="parts">
        <h2>Drag items onto the tree</h2>
        <DragItem
          v-for="(item, idx) in items"
          :key="idx"
          class="parts-item"
          :class="{
            active: isActive(item.data),
          }"
          :data="item.data"
          @drop="onItemDrop"
          @activate="onItemActivate"
        >
          <img :src="`/modelimages/${item.image}.png`" />
        </DragItem>
      </div>

      <div class="display" v-if="displayText">{{ displayText }}</div>

      <div class="text">
        <input
          placeholder="Type message here..."
          type="text"
          v-model="inputText"
          maxlength="40"
        />
      </div>

      <div class="actions">
        <button @click="onSave" :disabled="saving">
          {{ saving ? "Saving" : "Save" }}
        </button>
      </div>

      <div class="layers">
        <div v-for="item in parts" :key="item.id" class="row">
          <img :src="`/modelimages/${getKey(item.data)}.png`" />

          <span>{{ item.id }}</span>

          <button @click="() => removeLayer(item.id)">Delete</button>
        </div>
      </div>
    </aside>

    <!-- <div>
      <textarea v-model="stringified" readonly></textarea>
    </div> -->
  </div>
</template>

<script>
import { addTree } from "~/assets/js/db";
import { nanoid } from "nanoid";
import { loadImage, timer } from "~/assets/js/utils";
import Canvas from "./common/Canvas.vue";
import DragItem from "./common/DragItem.vue";

export default {
  components: { Canvas, DragItem },
  props: {
    parts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      displayText: null,
      inputText: "",
      mountCanvas: false,
      activeDrop: false,
      active: null,
      saving: false,
      items: [
        {
          label: "Red Bauble",
          image: "bauble-red",
          data: { type: "bauble", color: "red" },
        },
        {
          label: "Gold Bauble",
          image: "bauble-gold",
          data: { type: "bauble", color: "gold" },
        },
        {
          label: "Car",
          image: "car",
          data: { type: "car" },
        },
        {
          label: "Glasses",
          image: "glasses",
          data: { type: "glasses" },
        },
        {
          label: "Cash",
          image: "cash",
          data: { type: "cash" },
        },
        {
          label: "Tank",
          image: "tank",
          data: { type: "tank" },
        },
        {
          label: "Rainbow",
          image: "rainbow",
          data: { type: "rainbow" },
        },
      ],
    };
  },
  computed: {
    stringified() {
      return JSON.stringify(this.parts);
    },
    canvas() {
      return this.$refs.canvas.canvas;
    },
    ctx() {
      return this.$refs.canvas.ctx;
    },
    width() {
      return this.$refs.canvas.width;
    },
    height() {
      return this.$refs.canvas.height;
    },
  },
  async mounted() {
    const images = await Promise.all(
      this.items.map((item) =>
        loadImage(`/modelimages/${item.image}.png`).then((img) => ({
          img,
          key: this.getKey(item.data),
        }))
      )
    );

    this.images = images.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.key]: curr.img,
      }),
      {}
    );

    this.id = nanoid();
    this.treeImage = await loadImage(require("~/assets/img/tree.png"));
    this.mountCanvas = true;
  },
  watch: {
    parts(val) {
      this.draw();
    },
  },
  methods: {
    getKey(data) {
      return `${data.type}${data.color ? `-${data.color}` : ""}`;
    },
    removeLayer(id) {
      const idx = this.parts.findIndex((item) => item.id === id);

      if (idx >= 0) {
        const parts = this.parts.slice();
        parts.splice(idx, 1);
        this.$emit("update", parts);
      }
    },
    async onSave() {
      this.saving = true;

      if (!this.inputText || this.parts.length === 0) {
        this.addMessage("Add a message and add items to the tree");
        return;
      }

      await addTree(this.id, {
        text: this.inputText,
        parts: this.parts.slice(0, 50),
      }).then(() =>
        this.addMessage("Tree added! Click 'View all' to see them")
      );

      this.saving = false;
    },
    isActive(obj) {
      if (!this.active) {
        return false;
      }

      return Object.keys(this.active).every((k) => this.active[k] === obj[k]);
    },
    draw() {
      // this.ctx.fillStyle = "red";
      // this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.treeImage, 0, 0, this.width, this.height);

      this.parts.forEach((part) => {
        this.ctx.save();

        this.ctx.translate(part.x * this.width, part.y * this.height);

        const key = this.getKey(part.data);
        this.ctx.drawImage(this.images[key], -20, -20, 40, 40);

        // if (type === "bauble") {
        //   this.ctx.fillStyle = color;
        //   this.ctx.beginPath();
        //   this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
        //   this.ctx.fill();
        // } else if (type === "car") {
        //   this.ctx.fillStyle = color;
        //   this.ctx.fillRect(-5, -5, 10, 10);
        //   this.ctx.fillStyle = "white";
        //   this.ctx.textAlign = "center";
        //   this.ctx.textBaseline = "middle";
        //   this.ctx.fillText("C", 0, 0);
        // } else if (type === "cash") {
        //   this.ctx.fillStyle = color;
        //   this.ctx.fillRect(-5, -5, 10, 10);
        //   this.ctx.fillStyle = "white";
        //   this.ctx.textAlign = "center";
        //   this.ctx.textBaseline = "middle";
        //   this.ctx.fillText("$", 0, 0);
        // } else if (type === "tank") {
        //   this.ctx.fillStyle = color;
        //   this.ctx.fillRect(-5, -5, 10, 10);
        //   this.ctx.fillStyle = "white";
        //   this.ctx.textAlign = "center";
        //   this.ctx.textBaseline = "middle";
        //   this.ctx.fillText("T", 0, 0);
        // } else {
        //   this.ctx.fillStyle = color;
        //   this.ctx.fillRect(-5, -5, 10, 10);
        //   this.ctx.fillStyle = "white";
        //   this.ctx.textAlign = "center";
        //   this.ctx.textBaseline = "middle";
        //   this.ctx.fillText(type.charAt(0), 0, 0);
        // }

        this.ctx.restore();
      });
    },
    onMount() {
      this.draw();
    },
    onResize() {
      this.draw();
    },
    addMessage(txt) {
      this.displayText = txt;

      timer(2500).then(() => {
        this.displayText = null;
      });
    },
    onItemDrop(data) {
      if (this.saving) {
        return;
      }

      const { left, top, width, height } = this.canvas.getBoundingClientRect();

      const dropX = data.x - left;
      const dropY = data.y - top;

      if (dropX > width || dropY > height) {
        return;
      }

      const pixel = this.ctx.getImageData(
        Math.floor(dropX * window.devicePixelRatio),
        Math.floor(dropY * window.devicePixelRatio),
        1,
        1
      );
      if (pixel.data[3] !== 255) {
        console.log("Place ON the tree");
      } else {
        const parts = [
          ...this.parts,
          {
            id: nanoid(),
            data: data.data,
            x: dropX / width,
            y: dropY / height,
          },
        ];

        this.$emit("update", parts);
      }

      // ev.dataTransfer.clearData();
    },
    onClick(e) {
      if (!this.active) {
        return;
      }

      this.onItemDrop({
        x: e.pageX,
        y: e.pageY - window.scrollY,
        data: this.active,
      });
    },
    onItemActivate(data) {
      this.active = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 400px;
  height: 500px;
}

.wrapper {
  display: grid;
  padding-bottom: 100px;

  @include tablet {
    grid-template-columns: 1fr 350px;
    height: 100vh;
    padding-bottom: 0;
  }

  .left {
    display: flex;

    align-items: center;
    justify-content: center;

    background-color: #81d4fa;
  }

  aside {
    display: flex;
    flex-direction: column;

    justify-content: center;

    @include tablet {
      padding-bottom: 60px;
      max-height: 100vh;
    }
  }
}

.parts {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  h2 {
    flex-basis: 100%;

    text-align: center;
    padding: 0 10px;
    font-size: 1em;
  }

  &-item {
    padding: 20px;
    flex-basis: 25%;

    max-width: 100px;

    img {
      transform: scale(1.5);
    }

    &.active {
      outline: 2px solid #ccc;
      background-color: #e5e5e5;
    }
  }
}

.text {
  padding: 10px;

  input {
    width: 100%;

    border: 1px solid #ccc;
    padding: 10px;
  }
}

.actions {
  text-align: center;

  button {
    cursor: pointer;

    padding: 12px 20px;

    &:hover,
    &:focus-visible {
      opacity: 0.5;
    }
  }
}

.row {
  display: flex;

  align-items: center;
  gap: 10px;

  font-size: 10px;
  padding: 10px;

  img {
    flex-basis: 50px;
    width: 50px;
  }

  span {
    flex-grow: 1;
  }
}

.layers {
  @include tablet {
    flex-grow: 1;
    overflow: auto;
  }
}

.display {
  padding: 20px;
}
</style>