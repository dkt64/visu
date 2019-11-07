<template>
  <v-app>
    <v-app-bar app hide-on-scroll>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>DTP</span>
        <span class="font-weight-light">VISU</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="$vuetify.theme.dark" label="Dark theme" style="margin-top: 25px"></v-switch>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/dkt64/visu"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/visu';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  data: () => ({
    //
  }),
};
</script>
