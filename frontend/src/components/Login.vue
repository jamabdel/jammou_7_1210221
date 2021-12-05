<template>

  <div class="card">
   
    <h1 class="card__title">Connexion</h1>
    <p class="card__subtitle">
      Tu n'as pas encore de compte ?
      <router-link to="/Signup"><i class="fas fa-sign-in-alt p-2"></i>S'inscrire</router-link>
    </p>
    <label for="email-adress">Adresse email *</label>
    <div class="form-row">
      <input
        v-model="email"
        class="form-row__input"
        
        type="email"
        required
        @keyup.enter="login"
        placeholder="Adresse mail"
      />
    </div>
    <label for="password">Mot de passe *</label>
    <div class="form-row">
      <input
       
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
        <span><i class="fas fa-sign-in-alt p-4"></i>Connexion</span>
      </button>
    </div>
  </div>
</template>

<script>
import Axios from "axios";


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

      Axios.post("http://localhost:3000/api/users/login", user)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("userLogin", JSON.stringify(res.data));
            console.log(res);
            this.$router.push("/");
          }
        })
        .catch((err) => {
          localStorage.clear();
          if (err.response.status === 401) {
            this.error =
              "Connexion au serveur impossible.";
          } else {
            this.error = "Vérifiez vos identifiants. ";
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
  background-color: #3b2cc2;
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
  background-color: #3b2cc2;
  color: black;
  border: solid 1px black1;
}
.submit-button:hover {
  background: #3b2cc2;
}
.messageError {
  color: black1;
}
.input {
  width: 20em;
}
.input:hover {
  outline: none !important;
  border: solid 1px black1;
  box-shadow: 0 0 10px #3b2cc2;
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