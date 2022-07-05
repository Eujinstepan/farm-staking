import axiosRetry from "axios-retry";
import axios from "axios";
import Vue from "vue";
import Web3Helper from "./web3Requests";
axiosRetry(axios, { retries: process.env.VUE_APP_API_RETRIES });

export const serverCivAddress = process.env.VUE_APP_API_HOST;

export default class ApiClient {
  async getPricesUSD(ids) {
    try {
      if (ids) {
        return (
          await axios.get(
            "https://api.thegraph.com/subgraphs/name/fantasy2345/civfarm" + ids
          )
        ).data;
      }
      return null;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getPoolData(id) {
    try {
      await new Web3Helper().getUserAcc().then(() => {});
      let result = await axios.post(
        "https://api.thegraph.com/subgraphs/name/fantasy2345/civfarm",
        {
          query: `{
            pool(id:${id}){
                owner {
                  id
                }
                  lpToken
                  representToken
                  allocPoint
                  lastRewardBlock
                  accTokensPerShare
                  balance
                  userCount
                  stoneHarvested
              }
          }`,
        }
      );
      return result.data.data.pool;
    } catch (err) {
      throw ("Wrong API call", err);
    }
  }

  async getDepositedAmount() {
    try {
      return await new Web3Helper().getUserAcc().then((res) => {
        return axios
          .post("https://api.thegraph.com/subgraphs/name/fantasy2345/civfarm", {
            query: `{
          users( first: 5 where: {address: "${res}"} ) {
           address
           amount
         }
       }`,
          })
          .then((resp) => {
            return resp;
          });
      });
    } catch (err) {
      throw ("Wrong API call", err);
    }
  }
}
