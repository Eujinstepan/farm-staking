<template>
  <b-modal v-model="isNotificationModalActive" @after-enter="checkSubscribed()" @after-leave="reset()">
    <div class="notification-modal">
      <div class="columns is-mobile">
        <div class="column is-four-fifths">
          <p>Add your email</p>
        </div>
        <button
            type="button"
            class="delete"
            @click="$emit('close')"/>
      </div>

      <b-field>
        <b-input type="email"
                 placeholder="johndoe@gmail.com"
                 v-model="email"
                 @input="checkEmailValidity()"
                 v-if="alreadySubscribed===false">
        </b-input>
      </b-field>

      <p class="mb-5 has-text-light has-text-weight-bold" v-if="alreadySubscribed">You are subscribed with email: {{subscribedEmail}}</p>

      <button class="save" @click="subscribeEmail()" v-if="alreadySubscribed===false" :disabled="invalidEmail">
        Save
      </button>
      <button class="save" @click="unSubscribeEmail()" v-if="alreadySubscribed===true">
        Unsubscribe
      </button>
    </div>
  </b-modal>
</template>

<script>
import ApiClient from "../utils/apiClient";
import BlockchainHelper from "../utils/blockchain";

export default {
  name: "NotificationModal",
  data() {
    return {
      email: undefined,
      alreadySubscribed: undefined,
      invalidEmail: true,
      subscribedEmail: undefined
    }
  },
  props: {
    isNotificationModalActive: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isNotificationModalActive: {
      handler: function () {
        if (!this.isNotificationModalActive) {
          this.$emit("close");
        }
      },
    }
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
        await this.checkSubscribed()
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
    async unSubscribeEmail() {
      const loadingComponent = this.$buefy.loading.open()
      let accounts = await new BlockchainHelper().getAccounts()
      const postData = {
        wallet: accounts[0],
      }
      try {
        const subscribeResponse = (await new ApiClient().unSubscribeEmail(postData)).data
        this.$log.debug(subscribeResponse)
        await this.checkSubscribed()
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
    async checkSubscribed() {
      const loadingComponent = this.$buefy.loading.open()
      try {
        let accounts = await new BlockchainHelper().getAccounts()
        const isSubscribedResponse = (await new ApiClient().isSubscribedEmail(accounts[0])).data
        this.alreadySubscribed = isSubscribedResponse.subscribed
        this.subscribedEmail = isSubscribedResponse.email
        this.$log.debug(isSubscribedResponse)
      } catch (e) {
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
    reset() {
      this.email = undefined
      this.alreadySubscribed = undefined
    },
    checkEmailValidity() {
      this.invalidEmail = String(this.email)
          .toLowerCase()
          .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) === null
    }
  },
}
</script>

<style scoped lang="scss">
.notification-modal {
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
