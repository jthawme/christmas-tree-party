<template>
  <div @mousedown="onMouseDown" @touchstart="onTouchStart" ref="item">
    <slot />
  </div>
</template>

<script>
import { listenCb, tickUpdate } from "~/assets/js/utils";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    attachFake(left, top) {
      const el = this.$refs.item.cloneNode(true);
      el.classList.add("fake");
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      document.body.appendChild(el);
      return el;
    },
    fakePosition(el, left, top) {
      this._x = left;
      this._y = top;

      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    },
    onMouseDown(e) {
      const el = this.attachFake(e.pageX, e.pageY - window.scrollY);

      this.unlisten = [
        listenCb(
          document,
          "mousemove",
          tickUpdate((e) => {
            e.preventDefault();
            this.fakePosition(el, e.pageX, e.pageY - window.scrollY);
          })
        ),
        listenCb(document, "mouseup", this.onDrop.bind(this)),
        // listenCb(document, "touchcancel", this.onDrop.bind(this)),
        () => {
          el.remove();
        },
      ];
    },
    onTouchStart(e) {
      this.$emit("start");
      const el = this.attachFake(
        e.touches[0].pageX,
        e.touches[0].pageY - window.scrollY
      );

      this.unlisten = [
        listenCb(
          this.$refs.item,
          "touchmove",
          tickUpdate((e) => {
            e.preventDefault();
            this.fakePosition(
              el,
              e.touches[0].pageX,
              e.touches[0].pageY - window.scrollY
            );
          })
        ),
        listenCb(document, "touchend", this.onDrop.bind(this)),
        listenCb(document, "touchcancel", this.onDrop.bind(this)),
        () => {
          el.remove();
        },
      ];
    },
    onDrop() {
      if (this._x && this._y) {
        this.$emit("drop", {
          x: this._x,
          y: this._y,
          data: this.data,
        });
      } else {
        this.$emit("activate", this.data);
      }
      this._x = null;
      this._y = null;
      this.unlisten.forEach((cb) => cb());
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  touch-action: none;
  user-select: none;
}
</style>

<style lang="scss">
.fake {
  position: fixed;

  width: 100px;

  transform-origin: top left;
  transform: scale(0.75);

  opacity: 0.75;

  img {
    width: 100%;

    transform: translate3d(-50%, -50%, 0);
    pointer-events: none;
  }
}
</style>