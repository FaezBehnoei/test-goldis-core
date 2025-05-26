<template>
  <img
    :src="iconPath"
    :alt="name"
    class="svg-icon no-persian-convert"
    :class="[customClass,`svg-icon-${cursor}`]"
    @pointerdown.prevent="$emit('click', $event)"
  />
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  name: { type: String, required: true },
  state: { type: String, default: 'black' },
  size: { type: String, default: '24' },
  customClass: String,
  cursor:String
})

const iconPath = computed(() =>
  `/icons/name=${props.name}, state=${props.state}, size=${props.size}px.svg`
)
</script>

<style scoped>
.svg-icon {
  display: inline-block;
}
.svg-icon-true{
  cursor: pointer;
}
</style>
