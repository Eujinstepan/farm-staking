<template>
  <div class="fund-performance">
    <div class="container is-fluid">
      <div class="columns">
        <div class="column is-one-third">
          <div class="box">
            <h4>Total current pool size:</h4>
            <div class="value">
              <h2>182.5</h2>
              <span>ETH</span>
            </div>
          </div>

          <div class="box">
            <h5>Global pool return:</h5>

            <p>Since Inception: <span>123.4%</span></p>
            <p>Last 7 Days: <span>18.3%</span></p>
            <p>Last 30 Days: <span>9.1%</span></p>
            <p>Yesterday: <span>0.7%</span></p>
          </div>
        </div>
        <div class="column">
          <b-tabs v-model="activeTab">
            <b-tab-item class="tabItem" label="Fund Size" />

            <b-tab-item class="tabItem" label="Fund Returns" />
          </b-tabs>

          <div class="box view-chart">
            <line-chart />
          </div>
        </div>
      </div>

      <div class="box statistic">
        <div class="columns">
          <div class="column">
            <h6>Staked now:</h6>
            <h1 class="textGreen">2.12 <span class="textWhite">ETH</span></h1>
            <p>Staked since: 12 August 2021 (32 days)</p>
          </div>
          <div class="column">
            <h6>Your % on ETH Pool:</h6>
            <h1 class="textGreen">1.2%</h1>
            <p>
              Average Yearly % Return until now:
              <span class="textGreen">92.4%</span>
            </p>
          </div>
          <div class="column">
            <h6>ETH Available in wallet:</h6>
            <h1 class="textGreen">5.56</h1>

            <div class="stakeBox">
              <div class="columns">
                <div class="column">
                  <div class="inputStake">
                    <p>ETH</p>
                    <b-input v-model="stakeValue" />
                  </div>
                </div>
                <div class="column">
                  <b-button class="btnStake" @click="clickMe">Stake</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LineChart from "@/components/LineChart.vue";

export default {
  name: "Fund Performance",
  components: {
    "line-chart": LineChart,
  },
  data() {
    return {
      activeTab: 0,
      stakeValue: "0.0",
      loaded: false,
      chartdata: null,
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10,
      },
    };
  },
  async mounted() {
    this.loaded = false;
    try {
      const { userlist } = await fetch("/api/userlist");
      this.chartdata = userlist;
      this.loaded = true;
    } catch (e) {
      this.$log.error(e)
    }
  },

  methods: {
    clickMe() {
      this.$buefy.notification.open("Clicked!!");
    },
  },
};
</script>
<style lang="scss">
.fund-performance {
  margin-top: 40px;
  background: #121622;
  width: 100%;
  height: 100%;
}

.textGreen {
  color: $success-1;
}

.textWhite {
  color: $white;
}

.box {
  border-radius: 31px;
  padding: 27px 32px;
  color: $white;
  text-align: left;
  border: solid 2px transparent;
  background: $dark linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0)
  ),
  linear-gradient(101deg, $success, $purple);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $dark-1 inset;

  h4 {
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 37px;
    display: flex;
    align-items: center;
    color: $white;
    margin: 0 0 2px;
  }

  .value {
    display: flex;

    @include mq($from: mobile, $until: tablet) {
      flex-direction: column;
      align-items: start;
    }
  }

  h2 {
    font-style: normal;
    font-weight: 600;
    font-size: 64px;
    line-height: 78px;
    color: $success-1;
    display: inline-flex;
    align-items: center;
  }

  span {
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    display: flex;
    align-items: center;
    color: $white;
    margin-left: 6px;
  }

  h5 {
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 37px;

    color: $white;
    margin: 0 0 40px;
  }

  p {
    font-style: normal;
    font-weight: 500;
    font-size: 23px;
    line-height: 30px;

    color: $white;
    margin: 0 0 10px;
    display: flex;
    width: 100%;
    align-content: center;

    span {
      text-align: right;
      color: $success-1;
      margin-left: auto;
    }
  }
}

.b-tabs {
  .tabs {
    border: solid 2px transparent;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0)
      ),
      linear-gradient(101deg, $success, $purple);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 2px 1000px 1px $dark-1 inset;
    background-color: $dark;
    border-radius: 31px;
  }

  section {
    padding: 0 !important;
  }

  .tabs {
    .is-active {
      background: linear-gradient(272.01deg, $success-1 -93.28%, $purple 102.43%);
      transform: matrix(-1, 0, 0, 1, 0, 0);

      a {
        transform: matrix(-1, 0, 0, 1, 0, 0);
      }
    }

    a {
      font-style: normal;
      font-weight: 600;
      font-size: 30px;
      line-height: 37px;
      display: flex;
      align-items: center;
      text-align: center;

      color: $white;
      padding: 27px;

      @include mq($until: mobile) {
        font-size: 20px;
      }
    }

    ul {
      border: none;
      width: 100%;

      li {
        width: 50%;
      }
    }
  }
}

.statistic {
  padding-left: 107px;
  padding-right: 43px;

  @include mq($until: mobile) {
    padding-left: 16px;
  }
}

h6 {
  font-style: normal;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

h1 {
  font-style: normal;
  font-weight: 600;
  font-size: 70px;
}

h1 span {
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
}

.statistic {
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 38px;
    margin: 0;

    span {
      margin-left: 5px;
    }
  }
}

.inputStake {
  padding: 10px 14px;
  border-radius: 31px;
  border: solid 2px transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(101deg, $success, $purple);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $dark-1 inset;
  background-color: $dark;
  display: flex;
  align-items: center;
  width: 100%;

  p {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: $white;
    margin: 0;
  }
}

.stakeBox input {
  padding: 0;
  height: auto;
  background: no-repeat;
  border: none;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: right;
  color: $white;

  &:focus {
    box-shadow: none;
  }
}

.btnStake {
  width: 100%;
  height: 44px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;

  color: $white;
  border: solid 4px transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(101deg, $success, $purple);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $dark-1 inset;
  background-color: $dark;
  border-radius: 30px;

  span {
    font-size: 16px;
  }

  &:hover {
    color: $white;
  }
}
</style>
