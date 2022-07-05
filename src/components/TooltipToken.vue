<template>
  <b-tooltip class="tooltip-token" :position="getPosition()" multilined>
    <span class="tooltip-label">
      (Details)
    </span>
    <template v-slot:content>
      <div class="columns is-mobile">
        <div class="column is-full has-text-left p-0 header" style="border-bottom: 1px solid rgb(44, 47, 54)">
          Transaction costs
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-8 has-text-left p-0">Liquidity fees</div>
        <div class="column is-4 has-text-right p-0">0.0</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-8 has-text-left p-0">Price impact</div>
        <div class="column is-4 has-text-right p-0">0.0</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-8 has-text-left p-0">Allowed slippage</div>
        <div class="column is-4 has-text-right p-0">0.0</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-8 has-text-left p-0">Front running</div>
        <div class="column is-4 has-text-right p-0">Zero</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-8 has-text-left p-0">LP earnings</div>
        <div class="column is-4 has-text-right p-0">You gain</div>
      </div>

      <div class="note">
        This will execute when the market meets your target price
      </div>
    </template>
  </b-tooltip>
</template>


<script>
export default {
  name: "TooltipToken",
  components: {},
  methods: {
    getPosition() {
      if (window.innerWidth <= 760) {
        return 'is-right';
      } else {
        return 'is-right';
      }
    }
  }
}
</script>

<style lang="scss">
.tooltip-token {
  &.b-tooltip {
    top: 1px;
    left: 2px;

    .tooltip-content {
      width: 300px !important;
      padding: 30px !important;
      background-color: #191b1f;
      cursor: pointer;
      color: cornflowerblue;

      .note {
        font-size: 14px !important;
      }
    }

    .mdi-information-outline {
      &::before {
        color: gray !important;
      }
      &:hover::before {
        color: white !important;
      }
    }

    .header {
      margin-bottom: 5px !important;
      padding-bottom: 5px !important;
    }

    div {
      color: white !important;
      font-weight: 500 !important;
      font-size: 16px !important;
      padding: 2px;
    }

    .tooltip-label {
      color: cornflowerblue;
      cursor: pointer;
    }
  }
}
</style>
