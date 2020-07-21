<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-1>
        <h1 class="display-2 font-weight-bold mb-3">MACHINE TRANSFORMATIONS</h1>
      </v-flex>
    </v-layout>
    <v-card elevation="10" class="mx-auto" max-width="1440" tile>
      <v-list-item>
        <v-list-item-title class="headline mb-1">Machine Graph:</v-list-item-title>
        <v-spacer />
        <v-btn @click="fetchData" color="primary" max-width="300px">Read data...</v-btn>
        <v-btn
          @click="clearData"
          color="warning"
          max-width="300px"
          style="margin-left: 10px"
        >Clear data...</v-btn>
      </v-list-item>
      <!-- SCENA -->
      <Scene @before-render$="beforeRender" ref="myScene">
        <!-- Kamera -->
        <Camera
          type="arcRotate"
          :alpha="Math.PI/2"
          :beta="Math.PI/2"
          :radius="150"
          :target="[0, 0, 10]"
        ></Camera>
        <!-- <HemisphericLight diffuse="#888"></HemisphericLight> -->

        <!-- Światło punktowe z żarówką -->
        <PointLight :position="[0,0,500]" specular="#AAF" diffuse="#AAF"></PointLight>
        <!-- <Sphere :position="[0, 200, 0]" :scaling="[3, 3, 3]">
          <Material specular="#FFF" diffuse="#FFF"></Material>
        </Sphere>-->

        <!-- Podłoga -->
        <Plane :rotation="[Math.PI,0,0]" :position="[0, 0, 0]" :scaling="[300, 300, 300]">
          <Material diffuse="#F88">
            <Texture type="ambient" src="textura.png"></Texture>
          </Material>
        </Plane>

        <Entity
          v-for="(_, i) in Array($store.state.quantity).fill()"
          :key="i"
          :position="$store.state.positions[i]"
          :scaling="$store.state.scales[i]"
        >
          <IcoSphere></IcoSphere>
        </Entity>

        <!-- <Asset
          src="engineer_v2_sliced.stl"
          :rotation="[Math.PI, 0, Math.PI]"
          :scaling="[10, 10, 10]"
          :position="[0, 0, 50]"
        >
          <Material diffuse="#F88">
          </Material>
        </Asset>-->
        <!-- <Asset src="https://www.babylonjs-playground.com/scenes/skull.babylon" :rotation="[Math.PI, 0, Math.PI]" :scaling="[1, 1, 1]" :position="[0, 0, 50]"></Asset> -->
        <!-- <Asset src="https://rawgit.com/saswata26/misc/master/base.stl" :scaling="[1,1,1]" :position="[0,0,50]"></Asset> -->
      </Scene>
    </v-card>
  </v-container>
</template>

<script>
// import { Vector3 } from "@babylonjs/core/Maths/math";
import axios from "axios";
// import babylon from 'vue-babylonjs'
// import babylon from '@babylonjs/core';
// import { babylon } from 'vue-babylonjs'

export default {
  components: {
    // IcoSphere,
  },
  data: () => ({
    myScene: null,
  }),
  beforeDestroy() {},
  methods: {
    clearData() {
      // eslint-disable-next-line
      // console.log(this.$refs.myScene);
      // this.$refs.myScene.$children[5].$props.scaling = 100.0
      // eslint-disable-next-line
      // console.log(this.$refs.myScene.childElementCount);
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
            console.log("Response Stats: " + this.$store.state.objData.Stats);

            this.DrawData();
          }
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    beforeRender() {
      // eslint-disable-next-line
      // console.log("beforeRender()....");

      this.time = performance.now();

      var angle_add;
      var i;
      angle_add = (Math.PI * 2) / this.$store.state.quantity;
      for (i = 0; i < this.$store.state.quantity; i++) {
        this.$store.state.positions[i][0] =
          5 * this.$store.state.quantity * Math.sin(i * angle_add + this.$store.state.rotation);
        this.$store.state.positions[i][1] =
          5 * this.$store.state.quantity * Math.cos(i * angle_add + this.$store.state.rotation);
        this.$store.state.positions[i][2] = 20;
      }

      this.$store.state.rotation += Math.PI / 25;
    },
    DrawData() {
      // eslint-disable-next-line
      console.log("DrawData()");

      var j = this.$store.state.objData.Stats.length;

      // eslint-disable-next-line
      console.log("length = " + j);

      var i;
      for (i = this.$store.state.quantity; i < j; i++) {
        this.$store.state.positions.push([0, 0, 0]);
        this.$store.state.scales.push([
          this.$store.state.objData.Stats[i] / 5,
          this.$store.state.objData.Stats[i] / 5,
          this.$store.state.objData.Stats[i] / 5
        ]);

        this.$store.state.quantity++;
      }
    }
  },
  created() {
    // eslint-disable-next-line
    console.log("created(trans)....");

    // this.positions.push([0, 0, 0]);
    // this.scales.push([5, 5, 5]);
    // this.quantity = 1;
  },
  destroyed() {}
};
</script>
