<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-1>
        <h1 class="display-2 font-weight-bold mb-3">SIEMENS S7 PLC VISUALISATION SYSTEM</h1>
      </v-flex>
    </v-layout>

    <v-row>
      <v-col cols="2">
        <v-card elevation="10">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">SIEMENS S7 PLC</v-list-item-title>
              <v-list-item-subtitle>Setup connection parameters:</v-list-item-subtitle>

              <v-row no-gutters>
                <v-col>
                  <!-- v-on:keyup.enter="connect" -->
                  <v-text-field v-model="$store.state.plcAddress" label="Remote PLC IP Address"></v-text-field>
                  <v-text-field
                    v-model="slotNr"
                    label="Slot nr (S7-300/400: nr 2, S7-1200/1500: nr 0)"
                  ></v-text-field>
                  <v-text-field
                    v-model="period"
                    label="Period [ms] (0 ms means as fast as possible)"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-btn
                  style="width: 110px; margin: 2px"
                  class="mr-4"
                  color="success"
                  @click="connect"
                  :disabled="$store.state.connected == true"
                >connect</v-btn>
                <v-btn
                  style="width: 110px;margin: 2px"
                  @click="disconnect"
                  :disabled="$store.state.connected == false"
                >disconnect</v-btn>
              </v-row>

              <v-card elevation="10" style="margin-top: 8px">
                <!-- <v-list-item-title class="headline mb-1">INFO</v-list-item-title> -->
                <v-checkbox v-model="getData" :label="`Draw data`" style="margin: 14px"></v-checkbox>
                <v-list-item-subtitle style="margin: 14px">Counter {{$store.state.dummy}}</v-list-item-subtitle>
                <!-- <v-flex mb-12 style="margin: 4px">Info: {{server_message}}</v-flex> -->
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="6">
        <!-- <v-card elevation="10"> -->
        <Plotly :data="$store.state.tab1" :layout="layout1" :options="options1"></Plotly>
        <!-- </v-card> -->
      </v-col>
      <v-col cols="4">
        <!-- <v-card elevation="10"> -->
        <Plotly :data="$store.state.tab2" :layout="layout2" :options="options2"></Plotly>
        <!-- </v-card> -->
      </v-col>
    </v-row>

    <!-- <v-flex mb-4>{{ fetchedData }}</v-flex> -->
  </v-container>
</template>

<script>
import Plotly from "@statnett/vue-plotly";
var base64js = require("base64-js");
// import { Plotly } from "vue-plotly";
// import mask from "vue-the-mask";
// import base64 from "base64-js";
// import VueSSE from 'vue-sse';
// import * as FormData from 'form-data';

const CYCLES = 64;

// var xaxisTemplate = {
//   // range: [0, 128],
//   // autorange: true
//   // showgrid: true,
//   // zeroline: false,
//   // linecolor: "black",
//   // showticklabels: false,
//   // ticks: ""
// };

// var yaxisTemplate = {
//   // range: [0, CYCLES],
//   // autorange: true
//   // showgrid: true,
//   // zeroline: false,
//   // linecolor: "black",
//   // showticklabels: false,
//   // ticks: ""
// };

// var interval = {
//   // to keep a reference to all the intervals
//   intervals: new Set(),

//   // create another interval
//   make(...args) {
//     var newInterval = setInterval(...args);
//     this.intervals.add(newInterval);
//     return newInterval;
//   },

//   // clear a single interval
//   clear(id) {
//     this.intervals.delete(id);
//     return clearInterval(id);
//   },

//   // clear all intervals
//   clearAll() {
//     for (var id of this.intervals) {
//       this.clear(id);
//     }
//   }
// };

// var event = {
//   // to keep a reference to all the intervals
//   events: new Set(),

//   // create another interval
//   make(...args) {
//     var newEvent = args;
//     this.events.add(newEvent);
//     return newEvent;
//   },

//   // clear a single interval
//   clear(id) {
//     this.events.delete(id);
//   },

//   // clear all intervals
//   clearAll() {
//     for (var id of this.events) {
//       this.clear(id);
//     }
//   }
// };

// let $store.state.$store.state.msgServer;

function ValidateIPaddress(ipaddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  alert("You have entered an invalid IP address!");
  return false;
}

export default {
  directives: {
    // mask
  },
  components: {
    Plotly
  },
  data: () => ({
    server_message: null,
    mask: "###.###.###.###",
    y_values: [],
    myWindow: {
      width: 0,
      height: 0
    },
    options1: {
      autosizable: true,
      responsive: true,
      displayModeBar: true
      // fillFrame: true,
    },
    layout1: {
      autosize: true,
      paper_bgcolor: "#EEE",
      plot_bgcolor: "#F8F3",
      title: {
        text: "PLC streaming data",
        font: {
          size: 32
        }
      }
    },
    options2: {
      autosizable: true,
      responsive: true,
      displayModeBar: true
      // fillFrame: true,
    },
    layout2: {
      // range: [0, 256],
      autosize: true,
      paper_bgcolor: "#DDD",
      plot_bgcolor: "#FF83",
      title: {
        text: "Values range live map",
        font: {
          size: 32
        }
      },
      xaxis: {
        // range: [0, 256],
        autorange: true
        // showgrid: true,
        // zeroline: false,
        // linecolor: "black",
        // showticklabels: false,
        // ticks: ""
      },
      yaxis: {
        // range: [0, 256],
        autorange: true
        // showgrid: true,
        // zeroline: false,
        // linecolor: "black",
        // showticklabels: false,
        // ticks: ""
      }
    },

    fetchedData: null,
    response_data: null,
    getData: true,
    // cycle: null,
    slotNr: 2,
    period: 250
  }),
  beforeDestroy() {
    // clearInterval(this.timer);
    // interval.clearAll();
    // this.$store.state.connected = false;
  },
  methods: {
    handleResize() {
      this.myWindow.width = window.innerWidth;
      this.myWindow.height = window.innerHeight;
      // this.layout.height = this.myWindow.height * 0.7;
      // this.layout.width = document.getElementById("karta").width

      // // eslint-disable-next-line
      // console.log(
      //   "window resize: " + this.window.width + " x " + this.window.height
      // );
    },
    disconnect() {
      // clearInterval(this.cycle);
      // event.clearAll();
      this.$store.state.connected = false;
      if (this.$store.state.msgServer != null) {
        this.$store.state.msgServer.close();
      }
      // eslint-disable-next-line
      // console.log("event.clearAll() of " + event);
      // eslint-disable-next-line
      console.log("disconnect() of " + this.$store.state.plcAddress);
    },
    connect() {
      if (ValidateIPaddress(this.$store.state.plcAddress)) {
        // eslint-disable-next-line
        console.log("connect() to " + this.$store.state.plcAddress);

        // clearInterval(this.cycle);
        // this.cycle = setInterval(this.fetchData, this.period);

        // interval.clearAll();
        // interval.make(this.fetchData, Number(this.period));
        // this.fetchData();
        this.subscribe_event();
        this.$store.state.z_values.length = 0;
        this.$store.state.connected = true;
      } else {
        // eslint-disable-next-line
        console.log(
          "Invalid IP address '" + this.$store.state.plcAddress + "'"
        );
      }
    },
    write_stats(data) {
      var stringData = JSON.parse(data);

      // eslint-disable-next-line
      // console.log("Received stats:", stringData.content);

      // var z_values = [];
      // var index
      // for (index = 0; index < 256; index) {
      //   var byteArray = base64js.toByteArray(stringData.content[index]);
      //   this.$store.state.z_values.push(byteArray);

      // }

      if (this.getData) {
        this.$store.state.tab2[0].z = stringData.content;
      }
    },
    write_data(data) {
      var stringData = JSON.parse(data);

      // var byteArray = Convert.FromBase64String(stringData);

      var byteArray = base64js.toByteArray(stringData.content);

      if (this.getData) {
        if (this.$store.state.z_values.length == CYCLES) {
          this.$store.state.z_values.shift();
          // this.y_values.shift();
        }

        this.$store.state.z_values.push(byteArray);
        // this.y_values.push(stringData.time);

        this.$store.state.tab1[0].z = this.$store.state.z_values;
        // this.$store.state.tab1[0].y = this.y_values;
        // this.$store.state.tab1[0].y 2 this.y_values;
        // eslint-disable-next-line
        // console.log(byteArray);
      }
    },
    subscribe_event() {
      if (typeof EventSource !== "undefined") {
        this.$sse(
          // "http://localhost/api/v1/events",
          "http://localhost/api/v1/s7" +
            "?plc_address=" +
            this.$store.state.plcAddress +
            "&slot_nr=" +
            this.slotNr +
            "&period=" +
            this.period,
          { format: "plain" }
        ) // or { format: 'json' }
          .then(sse => {
            // Store SSE object at a higher scope
            this.$store.state.msgServer = sse;

            // Catch any errors (ie. lost connections, etc.)
            sse.onError(e => {
              // eslint-disable-next-line
              console.error("lost connection; giving up!", e);

              // This is purely for example; EventSource will automatically
              // attempt to reconnect indefinitely, with no action needed
              // on your part to resubscribe to events once (if) re$store.state.connected
              sse.close();
              this.disconnect();
            });

            // Listen for messages without a specified event
            sse.subscribe("", data => {
              // eslint-disable-next-line
              console.log("Received a message w/o an event!", data);
            });

            // Listen for messages based on their event (in this case, "chat")
            sse.subscribe("data", message => {
              // eslint-disable-next-line
              // console.log("Received data: ", message);
              this.write_data(message);
              // this.messages.push(message);

              this.$store.state.dummy++;
              // // Unsubscribes from chat messages after 7 seconds
              // setTimeout(() => {
              //   sse.unsubscribe("data");

              //   // eslint-disable-next-line
              //   console.log("Stopped listening to data messages!");
              // }, 2000);
            });

            // Listen for messages based on their event (in this case, "chat")
            sse.subscribe("stats", message => {
              this.write_stats(message);

              // eslint-disable-next-line
              // console.log("Received data: ", message);
              // this.messages.push(message);

              // this.$store.state.dummy++;
              // // Unsubscribes from chat messages after 7 seconds
              // setTimeout(() => {
              //   sse.unsubscribe("data");

              //   // eslint-disable-next-line
              //   console.log("Stopped listening to data messages!");
              // }, 2000);
            });

            // // Unsubscribes from event-less messages after 7 seconds
            // setTimeout(() => {
            //   sse.unsubscribe("");

            //   // eslint-disable-next-line
            //   console.log("Stopped listening to event-less messages!");
            // }, 7000);

            // // Unsubscribes from chat messages after 7 seconds
            // setTimeout(() => {
            //   sse.unsubscribe("data");

            //   // eslint-disable-next-line
            //   console.log("Stopped listening to data messages!");
            // }, 5000);
          })
          .catch(err => {
            // When this error is caught, it means the initial connection to the
            // events server failed.  No automatic attempts to reconnect will be made.
            // eslint-disable-next-line
            console.error("Failed to connect to server", err);
            this.disconnect();
          });
      } else {
        alert(
          "Your browser does not support Server-sent events! Please upgrade it!"
        );
        // eslint-disable-next-line
        console.error("Connection aborted");
      }
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created(plc)....");

    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    var dx, dy;
    for (dx = 0; dx < 256; dx++) {
      var arr = new Array(256);
      for (dy = 0; dy < 256; dy++) {
        arr[dy] = Math.random() * 256;
        // arr[dy] = dy*dx/2;
      }
      this.$store.state.tab2[0].z.push(arr);
    }

    // var dx, dy;
    // for (dx = 0; dx < 16; dx++) {
    //   this.$store.state.tab1[0].y.push(dx);
    //   this.$store.state.tab1[0].y.pu2h(dx);
    // }
    //   this.$store.state.tab1[0].x.push(dx);
    //   this.$store.state.tab1[0].x.pu2h(dx);
    // }
    // for (dx = 0; dx < 16; dx++) {
    //   var arr = new Array(128);
    //   for (dy = 0; dy < 128; dy++) {
    //     arr[dy] = Math.random() * 256
    //   }
    //   $store.state.z_values.push(arr);
    // }

    // this.cycle = setInterval(this.fetchData, 100);

    // this.$mqtt.subscribe('iotgateway')
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>
