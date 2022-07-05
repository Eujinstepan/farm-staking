<template>
  <get-civ></get-civ>
</template>

<script>
import GetCiv from "../components/GetCiv";

export default {
  name: "GetCivEmbedded",
  components: {
    GetCiv
  },
}
</script>

<style>
#header {
  display: none;
}

html {
 background-color: #ffffff !important;
}

body {
  line-height: 1;
}

.mt-6 {
  margin-top: 0 !important;
}

.column {
  padding: 0;
}

.card {
  box-shadow: none;
  border-radius: 0;
}
</style>