<template>
  <div :class="{ tooltip: props.showToolTip }">
    <slot />
    <div v-if="$slots.image" class="tooltipImage" :style="{...props.imageStyle}">
      <slot name="image" />
    </div>
    <span v-if="props.showToolTip && props.toolTipText" class="tooltipText">
      {{ props.toolTipText }}
    </span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  toolTipText: {
    type: String,
    default: undefined
  },
  showToolTip: {
    type: Boolean,
    default: true
  },
  imageStyle: {
    type: Object,
    default: () => ({ width: '400px' })
  }
})
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  z-index: 0;
}

/* Tooltip text */
.tooltip .tooltipText {
  visibility: hidden;
  min-width: 120px;
  background-color: #9b9b9b;
  color: #fff;
  font-size: 10px;
  text-align: center;
  padding: 5px 6px;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Tooltip arrow */
.tooltip .tooltipText::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #9b9b9b transparent transparent transparent;
}

/* Tooltip content */
.tooltip .tooltipImage {
  visibility: hidden;
  background-color: #e9e9e9;
  padding: 5px 6px;

  /* Position the tooltip text */
  position: absolute;
  bottom: 125%;
  left: 0px;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltipText{
  visibility: visible;
  opacity: 1;
}

.tooltip:hover .tooltipImage{
  visibility: visible;
  opacity: 1;
}
</style>
