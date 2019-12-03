<template>
  <v-app>
    <v-app-bar app hide-on-scroll>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title class="headline text-uppercase">
        <span>DTP</span>
        <span class="font-weight-light">VISU</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="$vuetify.theme.dark" label="Dark theme" style="margin-top: 25px"></v-switch>
      <v-spacer></v-spacer>
      <v-btn text href="https://github.com/dkt64/visu" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
      <template v-slot:extension>
        <v-tabs align-with-title background-color="transparent">
          <v-tab to="/">
            <router-link to="/" style="text-decoration: none">Plc</router-link>
          </v-tab>
          <v-tab to="/data">
            <router-link to="/data" style="text-decoration: none">Data</router-link>
          </v-tab>
          <v-tab to="/trans">
            <router-link to="/trans" style="text-decoration: none">Transitions</router-link>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
      <!-- <Plc />
      <Data />-->
    </v-content>
  </v-app>
</template>

<script>
// import Plc from "./components/plc";
// import Data from "./components/data";

export default {
  name: "App",
  components: {
    // Plc,
    // Data
  },
  data: () => ({
    //
  }),
  methods: {}
};
</script>
