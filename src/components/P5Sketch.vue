<template>
  <div ref="p5Container"></div>
</template>

<script lang="ts">
import p5 from "p5";
import { defineComponent, ref, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "P5Sketch",
  setup() {
    const p5Container = ref<HTMLDivElement | null>(null);
    let sketchInstance: p5 | null = null;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(400, 400);
        p.background(220);
      };

      p.draw = () => {
        p.ellipse(p.mouseX, p.mouseY, 50, 50);
      };
    };

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
