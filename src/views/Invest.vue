<template>
  <div>
    <confirmation-modal
      :is-component-modal-active="stakePlaced"
      @close="onClose"
      title="Stake"
      notification-title="You have successfully staked:"
      notification-sub-title="1.5 ETH"
    />

    <confirmation-modal
        :is-component-modal-active="redeemPlaced"
        @close="onClose"
        title="Redeem"
        notification-title="You have successfully redeemed:"
        notification-sub-title="1.5 ETH"
    />
    <div class="stake">
      <div class="columns is-mobile">
        <div class="column is-four-fifths">
          <p>Civilization Fund</p>
        </div>
        <div class="column cog-icon">
          <b-icon
              icon="cog-outline"
              size="is-medium"
              type="is-dim">
          </b-icon>
        </div>
      </div>


      <div class="options">
        <ul class="options-list">
          <li>
            <div class="crypto">
              <div class="is-pulled-left">Stake</div>
              <div class="is-pulled-right crypto-value">
                <b-numberinput :controls="false" :step="0.000001" v-model="ethereumValue"></b-numberinput>
              </div>
            </div>
          </li>
          <li>
            <div class="crypto">
              <div class="is-pulled-left">Redeem</div>
              <div>0.0</div>
            </div>
          </li>
          <li>
            <div class="crypto">
              <div class="is-pulled-left">Position Total</div>
              <div>2.12</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="trade-info">
        All the value are expressed in ETH
      </div>

      <button class="stake-button mr-4" @click="stakePlaced = true">
        Stake
      </button>
      <button class="stake-button" @click="redeemPlaced = true">
        Redeem
      </button>
    </div>

    <div class="fund-performance">
      View <router-link :to="{name: 'Fund Performance'}">Fund Performance</router-link>
    </div>

  </div>
</template>

<script>
import ConfirmationModal from "@/components/ConfirmationModal.vue"

export default {
  name: 'Invest',
  components: { ConfirmationModal }, 
  data: () => {
    return {
      stakePlaced: false,
      redeemPlaced: false,
      ethereumValue: '0.0000001',
    }
  },
  methods: {
    onClose: function() {
      this.stakePlaced = false;
      this.redeemPlaced = false;
    }
  }
}
</script>

<style scoped lang="scss">

  .stake {
    background-color: $dark;
    max-width: 470px;
    width: 90%;
    margin: 150px auto 30px auto;
    border-radius: 31px;

    p {
      text-align: left;
      color: $white;
      padding: 20px 20px 10px 35px;
      font-weight: 300;
      font-size: 20px;
      line-height: 24px;
    }
  }

  .options {
    margin-top: 20px;
  }

  .options-list {
    li {
      max-width: 440px;
      width: 90%;
      height: 75px;
      font-weight: 500;
      font-size: 22px;
      line-height: 21px;
      padding: 10px;
      border-radius: 30px;
      margin: 12px auto;
      color: $white;
      border: solid 2px transparent;
      background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, $success, $purple);
      background-origin: border-box;
      background-clip: content-box, border-box;
      box-shadow: 2px 1000px 1px $dark-1 inset;

      &:hover {
        box-shadow: 2px 1000px 1px #4b5369 inset;
      }
    }
  }

  li {
    img {
      float: left;
      width: 45px;
    }

    div {
      text-align: right;
      line-height: 50px;
    }
  }

  .cog-icon {
    margin-top:20px;
    cursor: pointer;
    margin-right: 30px;
  }

  .crypto-value {
    width: 150px;
  }

  .trade-info {
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    color: #999999;
  }

  .stake-button {
    border-radius: 31px;
    width: 40%;
    height: 50px;
    border: solid 3px transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px $dark-1 inset;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, $success-1, $purple);
    margin: 100px 0 25px;
    font-weight: 600;
    font-size: 25px;
    line-height: 30px;
    color: $white;
    cursor: pointer;

    &:hover {
      box-shadow: 2px 1000px 1px #4b5369 inset;
    }
  }

  .fund-performance {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    color: $white;

    a {
      color: rgba(0, 252, 222, 0.6) !important;
    }
  }

</style>
