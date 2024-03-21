<template>
  <div id="nav">
    <div class="logo">
      <img src="./assets/Kaizenlogo.jpeg" />
    </div>
    <div class="link-button-container">
      <div class="link">
        <router-link to="/"> About </router-link>

        <router-link to="/auth"> Authentication </router-link>
      </div>
      <div class="login-register-buttons">
        <button type="button">Login</button>
        <button type="button">Register</button>
      </div>
    </div>
  </div>
  <div class=router-view>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

#nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 10%;
  width: 100vw;
  background-color: #FDF8F6;
}

.logo {
  height: 100%;
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#nav img {
  height: 40px;
  width: 170px;
  padding-left: 30px;
}

.link-button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 90%;
}

.link {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  height: 100%;
  color: #F5793B;
  padding-left: 100px;
  font-size: 15px;
  ;
}

.login-register-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  gap: 30px;
  padding-right: 30px;
}

.login-register-buttons button {
  outline: none;
  border: none;
  background-color: #F5793B;
  height: 40px;
  width: 80px;
  font-size: 15px;
  color: #FDF8F6;
  border-radius: 3px;
}

.router-view {
  height: 90%;
  width: 100vw;
}
</style>
