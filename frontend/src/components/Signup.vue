<template>
  <div class="card">
    
    <h1 class="card__title" v-if='login'>Connexion</h1>
    <h1 class="card__title" v-else>Inscription</h1>
    <p class="card__subtitle" v-if='Signup'>
      Tu n'as pas encore de compte ?
    </p>
    <p class="card__subtitle" v-else>
      Tu as déjà un compte ? <router-link to="/login">Se connecter</router-link>
    </p>
    <label align="center" for="password">Pseudo</label>
    <div class="form-row">
      <input
       
        class="form-row__input"
        v-model="pseudo"
        maxlength="10"
        
        required
        placeholder="Entrez votre pseudo"
        @keyup.enter="signup"
      />
    </div>
    <label align="center" for="password">Adresse mail</label>
    <div class="form-row">
      <input
        
        class="form-row__input"
        v-model="email"
        type="email"
        maxlength="30"
        
        required
        placeholder="Entrez votre adresse email"
        @keyup.enter="signup"
      />
    </div>
    <label align="center" for="password">Mot de passe </label>
    <div class="form-row">
      <input
       
        class="form-row__input"
        v-model="password"
        type="password"
        maxlength="16"
        
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
      emailRegex:/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
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
        profil_picture: "http://localhost:3000/api/".substring(0, "http://localhost:3000/api/".length - 4) + "images/avatar.png",
      };
      if (!this.emailRegex.test(this.email)) {
        return (this.error = "Vous devez renseigner une adresse email valide");
      } else if (!this.passwordRegex.test(this.password)) {
        return (this.error =
          "Votre mot de passe doit contenir au moins 8 caractères et au moins 1 lettre et 1 chiffre");
      }
      Axios.post("http://localhost:3000/api/users", newUser)
        .then((res) => {
          if (res.status === 200) {
            Axios.post("http://localhost:3000/api/users/login", newUser) //si inscription fonctionne = login
              .then((res) => {
                if (res.status === 200) {
                  localStorage.setItem("userLogin", JSON.stringify(res.data));
                  this.$router.push("/");
                }
              })
              .catch(() => {
                localStorage.clear();
                this.error = "Veuillez renseigner un email et un mot de passe";
              });
          }
        })
        //.catch((err) => {
          //if (err.response.status === 409) {
         //   this.error = "Adresse email déjà utilisée";
         // } else {
           // this.error = "Veuillez renseigner un nouvel email et un mot de passe";
         // }
        //});
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