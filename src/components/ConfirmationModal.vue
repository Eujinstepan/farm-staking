<template>
  <b-modal v-model="isComponentModalActive">
    <div class="confirmation-modal">
      <div class="columns is-mobile">
        <div class="column is-four-fifths">
          <p>{{ title }}</p>
        </div>
        <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
      </div>

      <div class="main-notification">
        <div class="c-notification">
          <p class="c-notification-title" v-if="!!notificationTitle">
            {{ notificationTitle }}
          </p>
          <p class="c-notification-subtitle" v-if="!!notificationSubTitle">
            {{ notificationSubTitle }}
          </p>
          <p class="c-notification-content" v-if="!!notificationContent">
            {{ notificationContent }}
          </p>
          <p
            class="c-notification-disabled-content"
            v-if="!!notificationDisabledContent"
          >
            {{ notificationDisabledContent }}
          </p>
        </div>
      </div>

      <div class="etherscan-link" v-if="etherscanLink!==undefined">
        <a :href="etherscanLink"><u>View on Block Explorer</u></a>
      </div>

      <div class="has-text-light has-text-weight-bold mb-4" v-if="subscribedEmail!==undefined">
        Confirmation email sent to {{subscribedEmail}}
      </div>

      <div class="p-3 m-5 subscribe-box" v-if="subscribedEmail===undefined">
        <p class="has-text-light mb-1">Subscribe to free trade updates</p>
        <b-field>
          <b-input type="email"
                   placeholder="optional.email@example.com"
                   v-model="email"
                   @input="checkEmailValidity()"
                   class="confirmation-email-input">
          </b-input>
        </b-field>

        <button class="save" @click="subscribeEmail()" :disabled="invalidEmail">
          Subscribe
        </button>
      </div>

      <button class="open-trades">
        Your 
        <router-link :to="{ name: 'TradesPerformance' }">CivTrades</router-link>
      </button>
    </div>
  </b-modal>
</template>


<script>
import ApiClient from "../utils/apiClient";
import BlockchainHelper from "../utils/blockchain";

export default {
  name: "ConfirmationModal",
  components: {},
  data() {
    return {
      email: '',
      invalidEmail: true
    }
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    notificationTitle: {
      type: String,
      default: "",
    },
    notificationSubTitle: {
      type: String,
      default: "",
    },
    notificationContent: {
      type: String,
      default: "",
    },
    notificationDisabledContent: {
      type: String,
      default: "",
    },
    isComponentModalActive: {
      type: Boolean,
      default: false,
    },
    etherscanLink: {
      type: String,
    },
    subscribedEmail: {
      type: String,
    }
  },
  watch: {
    isComponentModalActive: {
      handler: function () {
        if (!this.isComponentModalActive) {
          this.$emit("close");
        }
      },
    },
  },
  methods: {
    async subscribeEmail() {
      const loadingComponent = this.$buefy.loading.open()
      let accounts = await new BlockchainHelper().getAccounts()
      const postData = {
        wallet: accounts[0],
        mail: this.email
      }
      try {
        const subscribeResponse = (await new ApiClient().subscribeEmail(postData)).data
        this.$log.debug(subscribeResponse)
        const isSubscribedResponse = (await new ApiClient().isSubscribedEmail(accounts[0])).data
        this.subscribedEmail = isSubscribedResponse.email
      } catch (e){
        this.$log.error(e)
        this.$buefy.toast.open({
          duration: 5000,
          message: `An error occurred, please try again`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        loadingComponent.close()
      }
    },
    checkEmailValidity() {
      this.invalidEmail = String(this.email)
          .toLowerCase()
          .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) === null
    }
  },
};
</script>

<style scoped lang="scss">
.confirmation-modal {
  background-color: $dark;
  max-width: 470px;
  width: 90%;
  border-radius: 30px;
  margin: auto;
  padding: 15px 10px;

  .column {
    p {
      text-align: left;
      color: $white;
      padding: 0 10px;
      font-weight: 300;
      font-size: 20px;
      line-height: 24px;
    }
  }

  .columns {
    position: relative;

    button {
      position: absolute;
      top: 8px;
      right: 16px;
    }
  }
}

.c-notification {
  width: 90%;
  height: auto;
  font-weight: 500;
  font-size: 22px;
  border-radius: 24px;
  padding: 15px 15px 0 15px;
  margin: 12px auto;
  border: solid 1px transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;

  .c-notification-title,
  .c-notification-content {
    color: white;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    padding: 0;
    margin-bottom: 12px;
  }

  .c-notification-subtitle {
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: $success-1;
    margin-bottom: 15px;
  }

  .c-notification-disabled-content {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: $light-1;
    margin-bottom: 15px;
  }
}

.etherscan-link {
  margin-bottom: 20px;
}

.open-trades {
  border-radius: 31px;
  width: 213px;
  height: 50px;
  border: solid 3px transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $black inset;
  background-image: linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0)
  ),
  linear-gradient(101deg, $success, $purple);
  margin: 0 0 25px 0;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: $white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    box-shadow: 2px 1000px 1px #4b5369 inset;
  }
}

.save {
  border-radius: 31px;
  width: 213px;
  height: 50px;
  border: solid 3px transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $black inset;
  background-image: linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0)
  ),
  linear-gradient(101deg, $success, $purple);
  margin: 0 0 25px 0;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: $white;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 1000px 1px #4b5369 inset;
  }

  &:disabled {
    border-radius: 31px;
    width: 213px;
    height: 50px;
    border: solid 3px transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px $light-1 inset;
    margin: 0 0 25px 0;
    font-weight: 600;
    font-size: 25px;
    line-height: 30px;
    color: $white;
    cursor: not-allowed;
    background-image: unset;
  }
}
</style>

<style>
.confirmation-email-input input::placeholder{
  color: #676767 !important;
}
.confirmation-email-input input::-moz-placeholder{
  color: #676767 !important;
  opacity: 1;
}

.subscribe-box {
  border: 1px solid #383737;
  border-radius: 10px;
}
</style>
