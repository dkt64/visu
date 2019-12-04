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
      <Scene v-model="myScene">
        <!-- Kamera -->
        <Camera
          type="arcRotate"
          :alpha="Math.PI*5/4"
          :beta="Math.PI/3"
          :radius="100"
          :target="[0, 10, 0]"
          v-model="myCamera"
        ></Camera>
        <HemisphericLight diffuse="#888"></HemisphericLight>

        <!-- Światło punktowe z żarówką -->
        <PointLight :position="[0,200,0]" specular="#FFF" diffuse="#FFF" v-model="myLight"></PointLight>
        <Sphere :position="[0, 200, 0]" :scaling="[3, 3, 3]">
          <Material specular="#FFF" diffuse="#FFF"></Material>
        </Sphere>

        <!-- Podłoga -->
        <Plane
          :height="2"
          :width="1"
          :rotation="[Math.PI/2,0,0]"
          :position="[0, 0, 0]"
          :scaling="[100, 100, 100]"
        >
          <Material diffuse="#AAA">
            <Texture type="ambient" src="textura.png" v-model="myTexture"></Texture>
          </Material>
        </Plane>

        <!-- <IcoSphere :position="[-1, 0, 0]" :scaling="[2,2,2]"></IcoSphere> -->
      </Scene>
    </v-card>
  </v-container>
</template>

<script>
// import { Vector3 } from "@babylonjs/core/Maths/math";
import axios from "axios";
// import babylon from 'vue-babylonjs'

export default {
  components: {
  },
  data: () => ({
    myScene: null,
    myCamera: null,
    myLight: null,
    myTexture: null,
    myIcoSpheres: []
  }),
  beforeDestroy() {},
  methods: {
    clearData() {
      this.$store.state.transData = "";
    },
    DrawData() {

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
            // console.log("Response Stats: " + this.$store.state.objData.Stats);

            this.DrawData()
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
    console.log("created(trans)....");
  },
  beforeRender() {
    // eslint-disable-next-line
    console.log("beforeRender()....");
  },
  destroyed() {}
};
</script>
