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
        {{dummy}}
      </v-flex>
    </v-layout>

    <v-checkbox v-model="getData" :label="`Get Data:`"></v-checkbox>
    <v-flex mb-4>{{ fetchedData }}</v-flex>
  </v-container>
</template>

<script>
import { Plotly } from "vue-plotly";
import axios from "axios";

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
  range: [0, 16],
  autorange: true,
  showgrid: true,
  zeroline: false,
  linecolor: "black",
  showticklabels: false,
  ticks: ""
};

export default {
  components: {
    Plotly
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
      if (this.getData) {
        axios
          .get("http://127.0.0.1:8070/iotgateway/read?ids=Siemens.PLC.Merkers")
          .then(response => (this.fetchedData = response.data));

        if (this.fetchedData != null) {
          if (this.fetchedData.readResults[0].s) {
            if (this.z_values.length == 16) {
              this.z_values.shift();
              // this.tab[0].y.shift();
            }

            this.z_values.push(JSON.parse(this.fetchedData.readResults[0].v));

            // this.tab[0].y.push(JSON.parse(this.fetchedData.readResults[0].t % 1000000));

            // yaxisTemplate.range[0] = this.tab[0].y[0]
            // yaxisTemplate.range[1] = this.tab[0].y[15]
          }

          if ((this.dummy & 1) > 0) {
            this.tab[0].z = [];
          } else {
            this.tab[0].z = this.z_values;
          }
          this.dummy++;
        }
      }
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

    this.cycle = setInterval(this.fetchData, 200);
  }
};
</script>
