<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-1>
        <h1 class="display-2 font-weight-bold mb-3">DATA VISUALISATION</h1>
      </v-flex>
    </v-layout>
    <v-card elevation="10" class="mx-auto" max-width="1440" tile>
      <v-list-item>
        <v-list-item-title class="headline mb-1"
          >Machine Data Mask, States and Transitions:</v-list-item-title
        >
        <v-spacer />
        <v-btn @click="fetchData" color="primary" max-width="300px"
          >Read data...</v-btn
        >
        <v-btn
          @click="clearData"
          color="warning"
          max-width="300px"
          style="margin-left: 10px"
          >Clear data...</v-btn
        >
      </v-list-item>
      <v-list-item>
        <v-list-item-title style="margin: 14px"
          >Stats counter table:</v-list-item-title
        >
      </v-list-item>
      <v-list-item>
        <div style="margin: 14px">{{ $store.state.objData.Stats }}</div>
      </v-list-item>

      <v-list-item>
        <v-list-item-title style="margin: 14px"
          >Transitions table:</v-list-item-title
        >
      </v-list-item>
      <v-list-item style="margin: 14px" v-for="item in $store.state.objData.Trans">
        {{ item }}
        <!-- <div style="margin: 14px">{{ $store.state.objData.Trans }}</div> -->
      </v-list-item>

      <v-list-item>
        <v-list-item-title style="margin: 14px"
          >Registered states table:</v-list-item-title
        >
      </v-list-item>
      <v-list-item style="margin: 14px" v-for="item in $store.state.objData.States">
        {{ item }}
        <!-- <div style="margin: 14px">{{ $store.state.objData.States }}</div> -->
      </v-list-item>
      <!-- <div>{{ $store.state.plcData }}</div> -->
      <!-- <v-list-item>{{ $store.state.plcData }}</v-list-item> -->
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
// var base64js = require("base64-js");

export default {
  components: {},
  data: () => ({
    //
    myData: null
  }),
  beforeDestroy() {},
  methods: {
    clearData() {
      // this.$store.state.plcData = "";
    },
    fetchData() {
      var query = "http://localhost/api/v1/data";

      const config = {
        timeout: 10000
      };

      axios
        .get(query, config)
        .then(response => {
          // eslint-disable-next-line
          console.log("fetchData()");

          if (response.data != null) {
            this.$store.state.plcData = response.data;

            // // eslint-disable-next-line
            // console.log("Response plcData: " + this.$store.state.plcData);

            this.$store.state.objData = JSON.parse(response.data);

            // // eslint-disable-next-line
            // console.log("Response Stats: " + this.$store.state.objData.Stats);
          }
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.log(error);
        });
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created(data)....");
  },
  destroyed() {}
};
</script>
