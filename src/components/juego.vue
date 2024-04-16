<template>
  <div class="juego">
    <div class="nameId">
      <button @click="buscarPokemonAleatorio()">Mostrar Pokémon Aleatorio</button>
    </div>
    <div class="container-1">
      <div class="container-2">
        <div class="nameId">
          <label>
            <p class="parrafo">Nombre del Pokémon</p>
            <input type="text" v-model="nombrePokemon" :disabled="adivinado">
          </label>
        </div>
        <div class="contador" v-if="!adivinado">{{ contador }}</div>
        <ul class="type" v-if="pokemonData && nombrePokemon === pokemonData.name">
          <h3>Tipo:</h3>
          <li v-for="(type, index) in pokemonData.types" :key="index" :class="type.type.name">
            <span>{{ type.type.name }}</span>
          </li>
        </ul>
      </div>
      <div class="container-2">
        <div class="img">
          <section v-if="pokemonData"  class="imagen-1">
            <h2 class="namePokemon" v-if="nombrePokemon === pokemonData.name">{{ pokemonData.name }}</h2>
            <p>Numero: {{ pokemonData.id }}</p>
            <p>Peso: {{ pokemonData.weight }}</p>
            <div class="imagen-2">
              <img :src="pokemonData.sprites.other?.['official-artwork']?.front_default" :alt="pokemonData.name"
                   :class="{ 'pokemonImage': 1, 'coloredImage': (nombrePokemon === pokemonData.name) }">
            </div>
          </section>
        </div>
      </div>
      <div class="alert">
        <h5 :class="{ 'error': error === '¡Perdiste!', 'success': error === '¡Ganaste!' }" v-if="error !== ''">{{ error }}</h5>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"

let pokemonData = ref(null)
let nombrePokemon = ref("")
let error = ref("")
let contador = ref(0)
let adivinado = ref(false)
let interval = null

async function buscarPokemonAleatorio() {
  try {
    
    if (interval) clearInterval(interval);

    const idAleatorio = Math.floor(Math.random() * 1024) + 1;
    const resultado = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`)
    pokemonData.value = resultado.data
    console.log(pokemonData.value.name)
    nombrePokemon.value = ""
    contador.value = 30
    adivinado.value = false
    error.value = ""


    interval = setInterval(() => {
      contador.value--;
      if (contador.value === 0) {
        clearInterval(interval);
        error.value = "¡Perdiste!";
        setTimeout(() => {
          error.value = "";
        }, 3000);
      } else if (nombrePokemon.value === pokemonData.value.name) {
        adivinado.value = true;
        clearInterval(interval);
        error.value = "¡Ganaste!";
        setTimeout(() => {
          error.value = "";
        }, 3000);
      }
    }, 1000);

  } catch (error) {
    console.log(error)
    error.value = "Se produjo un error al cargar el Pokémon."
  }
}
</script>




<style scoped>

.alert {
  text-align: center;
  width: 36%;
  box-shadow: 7px 7px 14px #807c7c,
    -7px -7px 14px #807c7c;
  z-index: 1200;
  margin-left: 28%;
  position: fixed;
  border-radius: 10px;
}

h5 {
 font-size: 300%;
  height: 100px;
  padding: 2%;
  padding-top: 5%;
  text-align: center;
  
  /* background-color: red; */
  color: #ffffff;
  
}
.error {

  background-color: red;
}

.success {
  background-color: green;
}
.container-1 {
  display: grid;
  grid-template-columns: 40% 60%;
}

.container-2 {
   flex: 1;
  text-align: center;
}

.pokemonImage {
  filter: brightness(0%) grayscale(100%);
}

.coloredImage {
  filter: none;
}

.nameId {
  margin-bottom: 2%;
 
}

.contador {
  font-size: 300%;
  background-color: #fced1c;
  width: 20%;
  border-radius: 10px 0;
  margin-left: 40%;
}
input{
  width: 50%;
}
button{
  font-size: 200%;
}
.img{
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 1%;
  text-align: left;
  width: 90%;
 }

.parrafo{
  padding-top:25%;
}
.imagen-1 p{
font-size: 180%;
padding-left: 5%;
}
.imagen-2 {
  text-align: center;
  height: auto;
  display: block;
  transform: scale(1);
  margin-bottom: 0%;
  padding-left: 0%;
  
}

@media (max-width: 1000px){
  .imagen-2 {
  transform: scale(.7);  
  }
}

@media (max-width: 700px){
  .imagen-2 {
  transform: scale(.6);  
  }
  .contador {
  font-size: 200%;
  
}
}

</style>