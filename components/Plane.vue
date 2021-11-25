<script>
import { getFloor } from "~/assets/js/models";
import { deg2rad } from "~/assets/js/utils";

export default {
  props: {
    color: {
      type: Number,
      required: true,
    },
  },
  computed: {
    engine() {
      return this.$parent.engine;
    },
  },
  mounted() {
    this.floor = getFloor(2000, this.color);
    this.floor.rotateX(deg2rad(-90));
    this.engine.addObject(this.floor);
  },
  beforeDestroy() {
    this.engine.removeObject(this.floor);
  },
  render() {
    return null;
  },
};
</script>