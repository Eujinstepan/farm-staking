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

      <button class="action-button" @click="onSubmitAction()" v-if="!disableButtons">
        Submit
      </button>
      <button class="action-button" @click="closeModal()" v-if="!disableButtons">
        Dismiss
      </button>
    </div>
  </b-modal>
</template>


<script>
export default {
  name: "TradeActionConfirmationModal",
  components: {},
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
    type: {
      type: String,
      default: "",
      required: true
    },
    disableButtons: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmitAction() {
      this.$emit("onSubmitAction", this.type);
    },
    closeModal() {
      this.$emit("close");
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

.action-button {
  border-radius: 31px;
  width: 113px;
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
  margin: 0 0 25px 20px;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: $white;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 1000px 1px #4b5369 inset;
  }
}

</style>
