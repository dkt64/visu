<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">DTP-VISU VUE PLOTLY</h1>
      </v-flex>
    </v-layout>

    <v-layout text-center wrap>
      <v-flex mb-4>
        <Plotly :data="tab"></Plotly>
        {{dummy}}
      </v-flex>
    </v-layout>

    <v-text-field
      v-on:keyup.enter="submitPlcAddress"
      v-model="plcAddress"
      label="Remote PLC IP Address"
    ></v-text-field>

    <v-btn class="mr-4" color="success" @click="submitPlcAddress">submit</v-btn>
    <v-btn @click="clearPlcAddress">clear</v-btn>

    <v-checkbox v-model="getData" :label="`Get Data:`"></v-checkbox>
    <v-flex mb-4>{{ fetchedData }}</v-flex>
  </v-container>
</template>

<script>
// import { Plotly } from "vue-plotly";
import Plotly from "@statnett/vue-plotly";
import axios from "axios";
import { mask } from "vue-the-mask";

const CYCLES = 128;

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
      title: "Siemens.PLC.Merkers",
      xaxis: xaxisTemplate,
      yaxis: yaxisTemplate
    },

    fetchedData: null,
    response_data: null,
    getData: false,
    cycle: null
  }),
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    clearPlcAddress() {
      this.plcAddress = "";
    },
    submitPlcAddress() {
      var query = "http://localhost/api/v1/s7?plc_address=" + this.plcAddress;

      // eslint-disable-next-line
      console.log("Query = " + query);

      axios.get(query).then(response => {
        this.response_data = response.data;

        // eslint-disable-next-line
        console.log("Response: " + this.response_data);

        if (this.response_data.length > 0) {
          if (this.z_values.length == CYCLES) {
            this.z_values.shift();
          }


          var buf = new Uint8Array(256)
          
          var index
          for (index = 0; index<256; index++){
            buf[index] = this.response_data[index]
          }

          this.z_values.push(buf.values);

          this.tab[0].z = this.z_values;

          this.dummy++;
        }

        // eslint-disable-next-line
        // console.log("Response: " + JSON.parse(this.response_data));
      });
    },
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

    this.cycle = setInterval(this.fetchData, 100);

    // this.$mqtt.subscribe('iotgateway')
  }
};
</script>
