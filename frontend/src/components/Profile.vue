<template>
  <b-container>
     <div class="card">
    <b-row  align-h="center">
      <b-col lg="8">
        <h1 align="center" class="mb-4">Configurez votre profil<br>Votre profil permet aux autres de savoir qui vous êtes</h1>
        <b-row>
          <b-col cols="12" offset-sm="1" sm="10" offset-md="2" md="8" offset-lg="2" lg="8">

            <div class="card">
              <!--Gestion de l'image-->
              <div align="center" class="mb-3">
                <div
                  class="base-image-input"
                  v-b-tooltip.hover
                  title="Choisissez une image de profil"
                  :style="{ 'background-image': `url(${imageData})` }"
                  @click="getImage"
                  alt="User image"
                >
                  <span v-if="!imageData" class="placeholder"></span>
                  <input class="file-input" ref="fileInput" type="file" @input="selectImage" />
                </div>
              </div>

              <!--Formulaire-->
              <div align="center">
                <label for="pseudo"> Modifier mon Pseudo</label>
                <b-form-input
                  
                  class="mb-3 input"
                  v-model="user.pseudo"
                  placeholder="Mon pseudo"
                  maxlength="10"
                  
                ></b-form-input>
                <label for="email-adress">Modifier mon adresse email</label>
                <b-form-input
                  
                  class="mb-2 input"
                  v-model="user.email"
                  type="email"
                  placeholder="Mon adresse email"
                  maxlength="30"
                 
                ></b-form-input>
              </div>
              <div align="center">
              
              </div>
              <div align="center">
                <label for="password">Modifier mon mot de passe</label>
                <b-form-input
                  class="input"
                 
                  v-model="password"
                  type="password"
                  placeholder="Nouveau mot de passe"
                  maxlength="16"
                  
                ></b-form-input>
              </div>
            </div>


            <p class="messageError font-weight-bold text-center mt-2">{{ error }}</p>
          </b-col>
        </b-row>
        <b-row class="mt-4" align="center">
          <b-col offset="1" cols="5" offset-sm="3" sm="3" offset-md="3" md="3" offset-lg="3" lg="3">
            <div>



              <b-button pill @click="profile" class="send-button">forum</b-button>
              
            </div>
          </b-col>
          <b-col cols="5" sm="3" md="3" lg="3">
            <div>
              <b-button pill @click="updateUser" class="send-button">Modifier</b-button>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col offset="3" cols="6">
            <div class="mt-4" align="center">
              <b-button
                pill
                size="sm"
                class="send-button"
                @click="deleteUser"
              >Supprimer mon profil</b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    </div>
  </b-container>
  
</template>
 
<script>


export default {
  name: "Profile",
  data() {
    return {
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
      pseudoRegex: /^[a-zA-Z0-9]{3,}$/,
      emailRegex: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
      updatedPassword: true,
      imageData: "",
      password: "",
      user: {},
      uri: "users/" + this.userId,
      file: "",
      error: "",
    };
  },
  props: {
    userId: {
      type: String,
    },
    showProfile: {
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
  
  methods: {
  
    getUser() {
      this.$http.get('http://localhost:3000/api/users/' + this.userId, this.headers).then((res) => {
        this.user = res.data;
        this.imageData = res.data.profilePicture;
      });
    },
    getImage() {
      this.$refs.fileInput.click();
    },
    selectImage() {
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
    profile() {
      //dès que clic sur modifier ou anuler retour auforum
      let emitshowProfile = !this.showProfile;
      this.$emit("showProfile", emitshowProfile);
    },
    switchUpdatedPassword() {
      this.updatedPassword = !this.updatedPassword;
    },
    updateUser() {
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
      formData.append("pseudo", this.body.pseudo);
      formData.append("email", this.body.email);
      formData.append("user_id", this.userId);
      formData.append("image", this.file);
      if (this.body.password) {
        formData.append("password", this.body.password);
      }
      this.$http.put('http://localhost:3000/api/' + this.uri, formData, this.headers)
        .then(() => {
          this.$parent.getPosts();
          this.profile();
          this.$refs.fileInput.value = "";
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },

    deleteChanges() {
      this.getUser();
      this.password = "";
      this.updatedPassword = true;
      this.imageData = this.user.profilePicture;
    },
    
    deleteUser() {
      let ConfirmBeforeDelete = confirm(
        //apparition de la fenêtre
        "Attention. Toutes vos données seront supprimées. Cette action est irréversible."
      );
      if (ConfirmBeforeDelete) {
        this.$http.delete('http://localhost:3000/api/' + this.uri, this.headers)
          .then(() => {
            this. Exit ();
          })
          .catch(() => {
            this.error = "Un problème est survenu, veuillez réessayer";
          });
      }
    },
     Exit () {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
  getPosts() {
      //utilisée pour charger les posts et pour recharger le composant
      this.$http.get('http://localhost:3000/api/posts', this.headers).then((res) => {
        this.posts = res.data;
      });
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
};
</script>

<style scoped>
.identification-box {
  background-color: #3b2cc2;
}
.modify-password {
  background-color: white;
  border: none;
  color: black;
}
.modify-password:hover {
  border: solid 1px black1;
}
.send-button {
  background-color: #3b2cc2;
  color: white;
  border: solid 1px black;
}
.send-button:hover {
  background-color: #3b2cc2;
}
.reset-button {
  background-color: transparent;
  border: solid 1px #3b2cc2;
  color: #e42701;
}
.reset-button:hover {
  background: #ffe4e4;
  color: black1;
}
.delete-button {
  background-color: transparent;
  border: solid 1px #3b2cc2;
  color:  #e42701;
}
.delete-button:hover {
  background: #ffe4e4;
}
.messageError {
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
  background: #3b2cc2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 1em;
  text-align: center;
  border: solid 1px #fd2d#28a74501;
  border-radius: 50%;
}
.placeholder:hover {
  background: #3b2cc2;
}
.file-input {
  display: none;
}
.input {
  width: 17em;
}
.input:hover {
  outline: none !important;
  border: solid 1px #28a745;
  box-shadow: 0 0 10px #17a2b8;
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