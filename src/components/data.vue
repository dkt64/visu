<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-1>
        <h1 class="display-2 font-weight-bold mb-3">DATA VISUALISATION</h1>
      </v-flex>
    </v-layout>
    <v-card elevation="10" class="mx-auto" max-width="1440" tile>
      <v-list-item>
        <v-list-item-title class="headline mb-1">Machine Data Mask, States and Transitions:</v-list-item-title>
        <v-spacer />
        <v-btn @click="fetchData" color="primary" max-width="300px">Read data...</v-btn>
        <v-btn
          @click="clearData"
          color="warning"
          max-width="300px"
          style="margin-left: 10px"
        >Clear data...</v-btn>
      </v-list-item>
      <div>{{ $store.state.plcData }}</div>
      <!-- <v-list-item>{{ $store.state.plcData }}</v-list-item> -->
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
// var base64js = require("base64-js");

export default {
  components: {},
  data: () => ({}),
  beforeDestroy() {},
  methods: {
    clearData() {
      this.$store.state.plcData = "";
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

            // eslint-disable-next-line
            console.log("Response: " + response.data);
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
