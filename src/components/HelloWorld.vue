<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">DTP-VISU VUE PLOTLY</h1>
      </v-flex>
    </v-layout>

    <v-layout text-center wrap>
      <v-flex mb-4>
        <Plotly :data="tab" :layout="layout"></Plotly>
      </v-flex>
    </v-layout>

    <v-checkbox v-model="getData" :label="`Get Data:`"></v-checkbox>
    <v-flex mb-4>{{ fetchedData }}</v-flex>
  </v-container>
</template>

<script>
import { Plotly } from "vue-plotly";
import axios from "axios";

export default {
  components: {
    Plotly
  },
  data: () => ({
    tab: [
      {
        z: [],
        type: "heatmap",
      }
    ],

    layout: {
      title: "Siemens.PLC.Merkers",
    },

    fetchedData: null,
    getData: true
  }),
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    fetchData() {
      if (this.getData) {
        axios
          .get("http://127.0.0.1:8070/iotgateway/read?ids=Siemens.PLC.Merkers")
          .then(response => (this.fetchedData = response.data));

        if (this.fetchedData != null) {

          this.tab[0].z.push(JSON.parse(this.fetchedData.readResults[0].v))

          if (this.tab[0].z.length > 16) {
            this.tab[0].z.shift();
          }
          
          
        }
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created()...");

    this.timer = setInterval(this.fetchData, 1000);
  }
};
</script>
