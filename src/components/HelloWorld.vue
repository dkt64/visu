<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-1>
        <h1 class="display-2 font-weight-bold mb-3">SIEMENS S7 PLC VISUALISATION SYSTEM</h1>
      </v-flex>
    </v-layout>

    <v-row no-gutters>
      <v-col cols="3">
        <v-card elevation="10" style="margin: 4px">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">SIEMENS S7 PLC</v-list-item-title>
              <v-list-item-subtitle>Setup connection parameters:</v-list-item-subtitle>

              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-on:keyup.enter="connect"
                    v-model="plcAddress"
                    label="Remote PLC IP Address"
                  ></v-text-field>
                  <v-text-field
                    v-on:keyup.enter="connect"
                    v-model="slotNr"
                    label="Slot nr (S7-300/400: nr 2, S7-1200/1500: nr 0)"
                  ></v-text-field>
                  <v-text-field v-on:keyup.enter="connect" v-model="period" label="Period [ms]"></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-btn
                  style="width: 120px; margin: 2px"
                  class="mr-4"
                  color="success"
                  @click="connect"
                  :disabled="connected == true"
                >connect</v-btn>
                <v-btn
                  style="width: 120px;margin: 2px"
                  @click="disconnect"
                  :disabled="connected == false"
                >disconnect</v-btn>
              </v-row>
              <v-row no-gutters>
                <v-checkbox v-model="getData" :label="`Get Data`" style="margin-left: 8px"></v-checkbox>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card elevation="10" style="margin: 4px">
          <Plotly :data="tab" :layout="layout"></Plotly>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-layout text-center wrap>
      <v-flex mb-4>{{dummy}}</v-flex>
    </v-layout>-->

    <!-- <v-flex mb-4>{{ fetchedData }}</v-flex> -->
  </v-container>
</template>

<script>
// import { Plotly } from "vue-plotly";
import Plotly from "@statnett/vue-plotly";
import axios from "axios";
import { mask } from "vue-the-mask";
// import * as FormData from 'form-data';

const CYCLES = 256;

// var xaxisTemplate = {
//   range: [0, 128],
//   autorange: true,
//   showgrid: true,
//   zeroline: false,
//   linecolor: "black",
//   showticklabels: false,
//   ticks: ""
// };

// var yaxisTemplate = {
//   range: [0, CYCLES],
//   autorange: true,
//   showgrid: true,
//   zeroline: false,
//   linecolor: "black",
//   showticklabels: false,
//   ticks: ""
// };

var interval = {
  // to keep a reference to all the intervals
  intervals: new Set(),

  // create another interval
  make(...args) {
    var newInterval = setInterval(...args);
    this.intervals.add(newInterval);
    return newInterval;
  },

  // clear a single interval
  clear(id) {
    this.intervals.delete(id);
    return clearInterval(id);
  },

  // clear all intervals
  clearAll() {
    for (var id of this.intervals) {
      this.clear(id);
    }
  }
};

export default {
  directives: {
    mask
  },
  components: {
    Plotly
  },
  data: () => ({
    mask: "###.###.###.###",
    plcAddress: "",
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
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      title: {
        text: "PLC streaming data",
        font: {
          size: 32
        }
      }
      // xaxis: xaxisTemplate,
      // yaxis: yaxisTemplate
      // height: 600
    },

    fetchedData: null,
    response_data: null,
    getData: true,
    // cycle: null,
    connected: false,
    slotNr: 2,
    period: 250
  }),
  beforeDestroy() {
    // clearInterval(this.timer);
    interval.clearAll();
    this.connected = false;
  },
  methods: {
    disconnect() {
      // clearInterval(this.cycle);
      interval.clearAll();
      this.connected = false;
    },
    connect() {
      // eslint-disable-next-line
      console.log("connect()");

      // clearInterval(this.cycle);
      // this.cycle = setInterval(this.fetchData, this.period);
      interval.clearAll();
      interval.make(this.fetchData, Number(this.period));
      this.z_values.length = 0;
    },
    fetchData() {
      this.connected = true;
      if (this.getData) {
        var query =
          "http://localhost/api/v1/s7?plc_address=" +
          this.plcAddress +
          "&slot_nr=" +
          this.slotNr;
          "&period=" +
          this.period;

        // eslint-disable-next-line
        // console.log("Query = " + query);

        const config = {
          responseType: "arraybuffer",
          timeout: this.period
          // maxContentLength: 256,
          // responseEncoding: 'utf8'
        };

        axios
          .get(query, config)
          .then(response => {
            // eslint-disable-next-line
            // console.log("Response: " + this.response_data);

            if (response.data.byteLength == 256) {
              this.response_data = new Uint8Array(response.data);

              if (this.z_values.length == CYCLES) {
                this.z_values.shift();
              }

              this.z_values.push(this.response_data);

              this.tab[0].z = this.z_values;

              this.dummy++;
            }
          })
          .catch(function(error) {
            // eslint-disable-next-line
            console.log(error);
          });
      }
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created()....");

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

    // this.cycle = setInterval(this.fetchData, 100);

    // this.$mqtt.subscribe('iotgateway')
  }
};
</script>
