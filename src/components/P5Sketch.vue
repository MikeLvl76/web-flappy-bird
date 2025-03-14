<template>
  <div ref="p5Container"></div>
</template>

<script lang="ts">
import p5 from "p5";
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { sketch } from "../utils/p5/main";

export default defineComponent({
  name: "P5Sketch",
  setup() {
    const p5Container = ref<HTMLDivElement | null>(null);
    let sketchInstance: p5 | null = null;

    onMounted(() => {
      if (p5Container.value) {
        sketchInstance = new p5(sketch, p5Container.value);
      }
    });

    onUnmounted(() => {
      sketchInstance?.remove();
    });

    return {
      p5Container,
    };
  },
});
</script>
