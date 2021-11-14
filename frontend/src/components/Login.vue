<template>
  <div class="card">
    <h1 class="card__title">Connexion</h1>
    <p class="card__subtitle">
      Tu n'as pas encore de compte ?
      <router-link to="/Signup">S'inscrire</router-link>
    </p>
    <label for="email-adress">Adresse email *</label>
    <div class="form-row">
      <input
        v-model="email"
        class="form-row__input"
        id="input-1"
        type="email"
        required
        @keyup.enter="login"
        placeholder="Adresse mail"
      />
    </div>
    <label for="password">Mot de passe *</label>
    <div class="form-row">
      <input
        id="input-2"
        v-model="password"
        type="password"
        required
        @keyup.enter="login"
        class="form-row__input"
        placeholder="Mot de passe"
      />
    </div>

    <div class="form-row">
      <button pill class="button" type="submit" @click="login">
        <span>Connexion</span>
      </button>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { url } from "../main";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    //Fonction de connexion
    login() {
      const user = {
        email: this.email,
        password: this.password,
      };

      Axios.post(url + "users/login", user)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            this.$router.push("/");
          }
        })
        .catch((err) => {
          localStorage.clear();
          if (err.response.status === 401) {
            this.error =
              "Nous ne pouvons pas vous connecter. Vérifiez vos identifiants.";
          } else {
            this.error = "Un problème est survenu, veuillez réessayer";
          }
        });
    },
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
}

.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}

.form-row__input::placeholder {
  color: #aaaaaa;
}
.identification-box {
  background-color: #ffd7d7;
}
.icon-name {
  height: 250px;
}
h1 {
  font-size: 1.5em;
}
h2 {
  font-size: 1.4em;
}
.submit-button {
  background-color: #ffd7d7;
  color: black;
  border: solid 1px #fd2d01;
}
.submit-button:hover {
  background: #ffb3b3;
}
.error-message {
  color: #fd2d01;
}
.input {
  width: 20em;
}
.input:hover {
  outline: none !important;
  border: solid 1px #fd2d01;
  box-shadow: 0 0 10px #ffd7d7;
}
.switch-page {
  line-height: 50px;
}
@media screen and (max-width: 870px) {
  .icon-name {
    height: 200px;
  }
  h1 {
    font-size: 1.2em;
  }
  h2 {
    font-size: 1.3em;
  }
  .input {
    width: 18em;
  }
}
@media screen and (max-width: 560px) {
  .icon-name {
    height: 150px;
  }
  h1 {
    display: 1em;
  }
  h2 {
    font-size: 1.2em;
  }
  .input {
    width: 17em;
  }
  .switch-page {
    line-height: 30px;
  }
}
@media screen and (max-width: 440px) {
  h1 {
    display: none;
  }
  .input {
    width: 15em;
  }
}
</style>