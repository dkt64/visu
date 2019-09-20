<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">Welcome to plotly.js DTP-VISU app</h1>
      </v-flex>
    </v-layout>

    <v-checkbox v-model="getData" :label="`Get Data:`"></v-checkbox>
    <v-flex mb-4>{{ fetchedData }}</v-flex>

    <v-layout text-center wrap>
      <v-flex mb-4>
        <Plotly :data="tab" :layout="layout" :display-mode-bar="false"></Plotly>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Plotly } from "vue-plotly";
import axios from "axios";

var tab = []

var z1 = [
  // [6.7, 6.9, 7, 7, 7, 7, 6.9, 6.7],
  // [2, 2, 2, 2, 2, 2, 2, 2],
  // [6.7, 6.9, 7, 7, 7, 7, 6.9, 6.7],
  [8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [8.89, 8.94, 8.85, 8.94, 8.96, 8.92]
  // [8.84, 8.9, 8.82, 8.92, 8.93, 8.91],
  // [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
  // [8.79, 8.88, 8.81, 8.9, 8.95, 8.92],
  // [8.8, 8.82, 8.78, 8.91, 8.94, 8.92],
  // [8.75, 8.78, 8.77, 8.91, 8.95, 8.92],
  // [8.8, 8.8, 8.77, 8.91, 8.95, 8.94],
  // [8.74, 8.81, 8.76, 8.93, 8.98, 8.99],
  // [8.89, 8.99, 8.92, 9.1, 9.13, 9.11],
  // [8.97, 8.97, 8.91, 9.09, 9.11, 9.11],
  // [9.04, 9.08, 9.05, 9.25, 9.28, 9.27],
  // [9, 9.01, 9, 9.2, 9.23, 9.2],
  // [8.99, 8.99, 8.98, 9.18, 9.2, 9.19],
  // [8.93, 8.97, 8.97, 9.18, 9.2, 9.18]
];

export default {
  components: {
    Plotly
  },
  data: () => ({
    tab: [
      {
        y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        // y: [10, 15, 13, 17],
        z: z1,
        type: "surface"
      }
    ],

    layout: {
      title: "Wykres",
      // scene: { camera: { eye: { x: 1.87, y: 0.88, z: -0.64 } } },
      autosize: true,
      // width: 800,
      height: 700
      // margin: {
      //   l: 65,
      //   r: 50,
      //   b: 65,
      //   t: 90
      // }
    },

    timer: null,
    fetchedData: null,
    getData: false
  }),
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    fetchData() {
      if (this.getData) {
        axios
          .get("http://127.0.0.1:8070/iotgateway/read?ids=Siemens.PLC.ClockMem")
          .then(response => (this.fetchedData = response.data));

        // eslint-disable-next-line
        console.log("fetchedData: ", this.fetchedData.readResults[0].v);
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created()...");

    this.timer = setInterval(this.fetchData, 500);
  }
};
</script>
