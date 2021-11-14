<template>
  <b-container>
    <b-row align-h="center">
      <b-col lg="8">
        <h1 align="center" class="mb-4">Mon profil</h1>
        <b-row>
          <b-col cols="12" offset-sm="1" sm="10" offset-md="2" md="8" offset-lg="2" lg="8">
            <b-card class="card">
              <!--Gestion de l'image-->
              <div align="center" class="mb-3">
                <div
                  class="base-image-input"
                  v-b-tooltip.hover
                  title="Modifier la photo de profil"
                  :style="{ 'background-image': `url(${imageData})` }"
                  @click="chooseImage"
                  alt="User image"
                >
                  <span v-if="!imageData" class="placeholder"></span>
                  <input class="file-input" ref="fileInput" type="file" @input="onSelectFile" />
                </div>
              </div>

              <!--Formulaire-->
              <div align="center">
                <label for="pseudo">Pseudo</label>
                <b-form-input
                  id="input-1"
                  class="mb-3 input"
                  v-model="user.pseudo"
                  placeholder="Mon pseudo"
                  maxlength="10"
                  @input="lenghtCheck(10, user.pseudo, 'pseudo')"
                ></b-form-input>
                <label for="email-adress">Adresse email</label>
                <b-form-input
                  id="input-2"
                  class="mb-3 input"
                  v-model="user.email"
                  type="email"
                  placeholder="Mon adresse email"
                  maxlength="30"
                  @input="lenghtCheck(30, user.email, 'email')"
                ></b-form-input>
              </div>
              <div align="center">
                <b-button
                  v-show="displayModifyPassword"
                  @click="switchDisplayModifyPassword"
                  pill
                  size="sm"
                  class="modify-password mt-2"
                >Modifier mon mot de passe</b-button>
              </div>
              <div align="center" v-show="!displayModifyPassword">
                <label for="password">Mot de passe</label>
                <b-form-input
                  class="input"
                  id="input-3"
                  v-model="password"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  maxlength="16"
                  @input="lenghtCheck(16, password, 'mot de passe')"
                ></b-form-input>
              </div>
            </b-card>
            <p class="error-message font-weight-bold text-center mt-2">{{ error }}</p>
          </b-col>
        </b-row>
        <b-row class="mt-4" align="center">
          <b-col offset="1" cols="5" offset-sm="3" sm="3" offset-md="3" md="3" offset-lg="3" lg="3">
            <div>
              <b-button pill @click="cancelModification" class="ml-3 reset-button">Annuler</b-button>
            </div>
          </b-col>
          <b-col cols="5" sm="3" md="3" lg="3">
            <div>
              <b-button pill @click="modifyUser" class="send-button">Modifier</b-button>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col offset="3" cols="6">
            <div class="mt-4" align="center">
              <b-button
                pill
                size="sm"
                class="mb-3 delete-button"
                @click="deleteUser"
              >Supprimer mon profil</b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
 
<script>
import Axios from 'axios';
import { url } from "../main";

export default {
  name: "Profile",
  data() {
    return {
      displayModifyPassword: true,
      imageData: "",
      password: "",
      user: {},
      uri: "users/" + this.userId,
      file: "",
      error: "",
      pseudoRegex: /^[a-zA-Z0-9]{3,}$/,
      emailRegex: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
    };
  },
  props: {
    userId: {
      type: String,
    },
    displayProfile: {
      type: Boolean,
    },
    token: {
      type: String,
    },
  },
  created() {
    this.getUser();
  },
  watch: {
    error() {
      setTimeout(() => {
          this.error = "";
        }, 3000);
    }
  },
  computed: {
    body() {
      if (this.password === "" || this.password === null) {
        return {
          pseudo: this.user.pseudo,
          email: this.user.email,
        };
      } else {
        return {
          pseudo: this.user.pseudo,
          email: this.user.email,
          password: this.password,
        };
      }
    },
  },
  
  methods: {
    lenghtCheck(length, object, message) {
      if (object.length === length) {
        this.error = "Votre " + message + " est trop long";
      } else {
        this.error = "";
      }
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imageData = event.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.file = this.$refs.fileInput.files[0];
      }
    },
    switchDisplayProfile() {
      //dès que clic sur modifier ou anuler retour au forum
      let emitDisplayProfile = !this.displayProfile;
      this.$emit("display-profile", emitDisplayProfile);
    },
    switchDisplayModifyPassword() {
      this.displayModifyPassword = !this.displayModifyPassword;
    },
    getUser() {
      this.$http.get(url + "users/" + this.userId, this.headers).then((res) => {
        this.user = res.data;
        this.imageData = res.data.profilePicture;
      });
    },
    modifyUser() {
      if (!this.emailRegex.test(this.body.email)) {
        return (this.error = "Vous devez renseigner une adresse email valide");
      } else if (!this.pseudoRegex.test(this.body.pseudo)) {
        return (this.error =
          "Votre pseudo doit contenir au moins 3 caractères");
      } else if (this.body.password) {
          if (!this.passwordRegex.test(this.password)){
            return (this.error =
          "Votre mot de passe doit contenir au moins 8 caractères et au moins 1 lettre et 1 chiffre");
        }
      }
        
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("pseudo", this.body.pseudo);
      formData.append("email", this.body.email);
      formData.append("user_id", this.userId);
      if (this.body.password) {
        formData.append("password", this.body.password);
      }
      Axios.put(url + this.uri, formData, this.headers)
        .then(() => {
          this.$parent.getPosts();
          this.switchDisplayProfile();
          this.$refs.fileInput.value = "";
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },
    cancelModification() {
      this.getUser();
      this.password = "";
      this.displayModifyPassword = true;
      this.imageData = this.user.profilePicture;
    },
    deleteUser() {
      let deleteConfirm = confirm(
        //apparition de la fenêtre
        "Attention. Toutes vos données seront supprimées. Cette action est irréversible."
      );
      if (deleteConfirm) {
        this.$http.delete(url + this.uri, this.headers)
          .then(() => {
            this.logout();
          })
          .catch(() => {
            this.error = "Un problème est survenu, veuillez réessayer";
          });
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.identification-box {
  background-color: #ffd7d7;
}
.modify-password {
  background-color: white;
  border: none;
  color: black;
}
.modify-password:hover {
  border: solid 1px #fd2d01;
}
.send-button {
  background-color: #ffd7d7;
  color: black;
  border: solid 1px #fd2d01;
}
.send-button:hover {
  background-color: #ffb3b3;
}
.reset-button {
  background-color: transparent;
  border: solid 1px #ffb3b3;
  color: #e42701;
}
.reset-button:hover {
  background: #ffe4e4;
  color: #fd2d01;
}
.delete-button {
  background-color: transparent;
  border: solid 1px #ffb3b3;
  color:  #e42701;
}
.delete-button:hover {
  background: #ffe4e4;
}
.error-message {
  color: #fd2d01;
}
.base-image-input {
  display: block;
  width: 10em;
  height: 10em;
  cursor: pointer;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 50%;
}
.base-image-input:hover {
  opacity: 0.5;
}
.placeholder {
  background: #ffd7d7;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 1em;
  text-align: center;
  border: solid 1px #fd2d01;
  border-radius: 50%;
}
.placeholder:hover {
  background: #ffb3b3;
}
.file-input {
  display: none;
}
.input {
  width: 20em;
}
.input:hover {
  outline: none !important;
  border: solid 1px #fd2d01;
  box-shadow: 0 0 10px #ffd7d7;
}
@media screen and (max-width: 870px) {
  h1 {
    font-size: 2em;
  }
  .base-image-input {
    width: 8em;
    height: 8em;
  }
  .input {
    width: 18em;
  }
}
@media screen and (max-width: 560px) {
  h1 {
    font-size: 1.5em;
  }
  .base-image-input {
    width: 5em;
    height: 5em;
  }
  .input {
    width: 16em;
  }
}
@media screen and (max-width: 440px) {
  .input {
    width: 12em;
  }
}
</style>