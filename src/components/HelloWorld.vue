<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">DTP-VISU VUE PLOTLY</h1>
      </v-flex>
    </v-layout>

    <v-layout text-center wrap>
      <v-flex mb-4>
        <vue-plotly :data="tab"></vue-plotly>
        {{dummy}}
      </v-flex>
    </v-layout>

    <v-checkbox v-model="getData" :label="`Get Data:`"></v-checkbox>
    <v-flex mb-4>{{ fetchedData }}</v-flex>
  </v-container>
</template>

<script>
// import { Plotly } from "vue-plotly";
import VuePlotly from "@statnett/vue-plotly";
import axios from "axios";

const CYCLES = 128

var xaxisTemplate = {
  range: [0, 128],
  autorange: true,
  showgrid: true,
  zeroline: false,
  linecolor: "black",
  showticklabels: false,
  ticks: ""
};

var yaxisTemplate = {
  range: [0, CYCLES],
  autorange: true,
  showgrid: true,
  zeroline: false,
  linecolor: "black",
  showticklabels: false,
  ticks: ""
};

export default {
  components: {
    VuePlotly
  },
  data: () => ({
    z_values: [],
    dummy: 0,
    tab: [
      {
        // x: [],
        // y: [],
        z: [],
        type: "heatmap"
      }
    ],

    layout: {
      title: "Siemens.PLC.Merkers",
      xaxis: xaxisTemplate,
      yaxis: yaxisTemplate
    },

    fetchedData: null,
    getData: true,
    cycle: null
  }),
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    fetchData() {
      clearInterval(this.cycle);
      if (this.getData) {
        axios
          .get("http://127.0.0.1:8070/iotgateway/read?ids=Siemens.PLC.Merkers")
          .then(response => (this.fetchedData = response.data));

        if (this.fetchedData != null) {
          if (this.fetchedData.readResults[0].s) {
            if (this.z_values.length == CYCLES) {
              this.z_values.shift();
            }

            this.z_values.push(JSON.parse(this.fetchedData.readResults[0].v));

            this.tab[0].z = this.z_values;

            this.dummy++;
          }
        }
      }
      this.cycle = setInterval(this.fetchData, 100);
    },
    cancelAutoUpdate() {
      clearInterval(this.cycle);
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created()...");

    // var dx, dy;
    // for (dx = 0; dx < 16; dx++) {
    //   this.tab[0].y.push(dx);
    // }
    // for (dx = 0; dx < 128; dx++) {
    //   this.tab[0].x.push(dx);
    // }

    // for (dx = 0; dx < 16; dx++) {
    //   var arr = new Array(128);
    //   for (dy = 0; dy < 128; dy++) {
    //     arr[dy] = Math.random() * 256
    //   }
    //   z_values.push(arr);
    // }

    this.cycle = setInterval(this.fetchData, 100);
  }
};
</script>
