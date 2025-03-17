<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import p5 from "p5";
import { sketch } from "../utils/p5/main";

const p5Container = ref<HTMLDivElement | null>(null);
let sketchInstance: p5 | null = null;

const createSketch = () => {
  if (p5Container.value) {
    sketchInstance = new p5((p: p5) => {
      sketch(p);

      // Override setup to make canvas responsive
      const originalSetup = p.setup;
      p.setup = () => {
        originalSetup();
        p.windowResized = () => {
          p.resizeCanvas(
            p5Container.value!.clientWidth,
            p5Container.value!.clientHeight
          );
        };
      };
    }, p5Container.value);
  }
};

onMounted(createSketch);
onUnmounted(() => sketchInstance?.remove());
</script>

<template>
  <div class="p5-wrapper" ref="p5Container" />
</template>

<style>
.p5-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
