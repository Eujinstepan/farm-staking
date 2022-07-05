<template>
  <div>
    <a href="#" @mouseover="tooltip = true" @mouseleave="tooltip = false" class="inactive-link">
      {{ label }}
    </a>
    <span class="b-tooltip is-primary is-bottom is-medium" v-bind:class="{'is-hidden': !tooltip}" style="position: absolute;" @mouseover="tooltip = true" @mouseleave="tooltip = false">
      <div class="tooltip-content">Soon</div>
      <div class="tooltip-trigger is-invisible"> Trade </div>
    </span>
  </div>
</template>


<script>
export default {
  name: "TooltipLink",
  components: {},
  props: {
    label: {type: String}
  },
  data() {
    return{
      tooltip: false
    }
  }
}
</script>

<style scoped lang="scss">
  a {
    display: flex;
    flex-flow: row nowrap;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: rgb(195, 197, 203);
    font-size: 1rem;
    font-weight: 500;
    padding: 8px 12px;
    word-break: break-word;
    overflow: hidden;
    white-space: nowrap;

    &.inactive-link{
      color: gray !important;
      cursor: default;
    }
  }
  .b-tooltip.is-bottom .tooltip-content {
    top: 50%;
    left: 0;
  }
</style>
