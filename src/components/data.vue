<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-1>
        <h1 class="display-2 font-weight-bold mb-3">DATA VISUALISATION</h1>
      </v-flex>
    </v-layout>
    <v-card class="mx-auto" max-width="1200" tile>
      <v-list-item>
        <v-list-item-title class="headline mb-1">Machine Timeline</v-list-item-title>
        <v-spacer />
        <v-btn @click="fetchData" color="primary" max-width="200px">Read data...</v-btn>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item>item 1</v-list-item>
          <v-list-item>item 2</v-list-item>
          <v-list-item>item 3</v-list-item>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data: () => ({}),
  beforeDestroy() {},
  methods: {
    fetchData() {
      var query = "http://localhost/api/v1/data";

      const config = {
        // responseType: "arraybuffer",
        // timeout: this.period * 2
        timeout: 2000
        // maxContentLength: 256,
        // responseEncoding: 'utf8'
      };

      axios
        .get(query, config)
        .then(response => {
          // eslint-disable-next-line
          console.log("Response: " + response.data);
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
