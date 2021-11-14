<template>
  <div class="card">
    <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
    <h1 class="card__title" v-else>Inscription</h1>
    <p class="card__subtitle" v-if="mode == 'login'">
      Tu n'as pas encore de compte ?
    </p>
    <p class="card__subtitle" v-else>
      Tu as déjà un compte ? <router-link to="/login">Se connecter</router-link>
    </p>
    <label align="center" for="password">Pseudo</label>
    <div class="form-row">
      <input
        id="input-1"
        class="form-row__input"
        v-model="pseudo"
        maxlength="10"
        @input="lenghtCheck(10, pseudo, 'pseudo')"
        required
        placeholder="Entrez votre pseudo"
        @keyup.enter="signup"
      />
    </div>
    <label align="center" for="password">Adresse mail</label>
    <div class="form-row">
      <input
        id="input-2"
        class="form-row__input"
        v-model="email"
        type="email"
        maxlength="30"
        @input="lenghtCheck(30, email, 'email')"
        required
        placeholder="Entrez votre adresse email"
        @keyup.enter="signup"
      />
    </div>
    <label align="center" for="password">Mot de passe </label>
    <div class="form-row">
      <input
        id="input-3"
        class="form-row__input"
        v-model="password"
        type="password"
        maxlength="16"
        @input="lenghtCheck(16, password, 'mot de passe')"
        required
        placeholder="Entrez votre mot de passe"
        @keyup.enter="signup"
      />
    </div>

    <div class="form-row">
      <button @keyup.enter="signup" type="submit" @click="signup" class="button">
        <span>Créer mon compte</span>
      </button>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { url } from "../main";

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      pseudo: "",
      password: "",
      show: true,
      error: "",
      pseudoRegex: /^[a-zA-Z0-9]{3,}$/,
      emailRegex:
        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
    };
  },

  methods: {
    //Fonction d'inscription
    signup() {
      let newUser = {
        pseudo: this.pseudo,
        email: this.email,
        password: this.password,
        profil_picture: url.substring(0, url.length - 4) + "images/avatar.png",
      };
      if (!this.emailRegex.test(this.email)) {
        return (this.error = "Vous devez renseigner une adresse email valide");
      } else if (!this.passwordRegex.test(this.password)) {
        return (this.error =
          "Votre mot de passe doit contenir au moins 8 caractères et au moins 1 lettre et 1 chiffre");
      }
      Axios.post(url + "auth/users", newUser)
        .then((res) => {
          if (res.status === 200) {
            Axios.post(url + "users/login ", newUser) //si inscription fonctionne = login
              .then((res) => {
                if (res.status === 200) {
                  localStorage.setItem("currentUser", JSON.stringify(res.data));
                  this.$router.push("/");
                }
              })
              .catch(() => {
                localStorage.clear();
                this.error = "Un problème est survenu, veuillez réessayer";
              });
          }
        })
        .catch((err) => {
          if (err.response.status === 409) {
            this.error = "Adresse email déjà utilisée";
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
</style>