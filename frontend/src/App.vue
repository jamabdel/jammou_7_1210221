<template>
  <div id="app">
    <router-view/>
        
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  margin:0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  max-width: 100%;
}

body {
  background-image: linear-gradient(62deg, #2e0bac 0%, #ec4f28 100%);
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding:32px;
}