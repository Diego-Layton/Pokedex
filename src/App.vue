<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="text-black" height-hint="98" >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar class="logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/800px-International_Pok%C3%A9mon_logo.svg.png" alt=""  >
          </q-avatar>
        </q-toolbar-title>
        <input type="text" placeholder="BUSCAR POKEMON" id="buscador" v-model="buscador" @keydown.enter="traer()">
      </q-toolbar>

      <q-tabs align="right">
        <button class="juegox" @click="irAJuego()">Cual es ese pokemon?</button>

      </q-tabs>
    </q-header>

  

    <q-page-container>


        <div class="contenedor">

            <!-- ________________________________________________________________ -->
              
            <div class="card" v-if="busqueda">
              
                  <div class="imagenes"> 
                    <div class="nombre">{{ pokemon.name }}</div>
                <img id="imgdetras" :src="pokemon.sprites?.other['official-artwork'].front_default" alt="" v-if="pokemon.sprites">
                <img id="imgdetras" :src="pokemon.sprites.other.dream_world.front_default" alt="" v-if="pokemon.sprites">
              </div>
              <div class="divicion">
              <div  class="datos" v-if="showcard">
                
                <div class="tipo" v-for="(e, i) in pokemon.types" :key="i">Tipo: {{ e.type.name }} </div>
                    <div class="peso">Peso: {{ pokemon.weight }}</div>
                  </div>
                <section class="linear-progress-section">
                  <div class="linear-progress" v-for="(e, i) in pokemon.stats" :key="i" >
                    <label :for="'ID' + i" rounded size="13px" color="purple" class="stat-name text-xs font-semibold text-white" >{{ e.stat.name }}</label>
                    <q-linear-progress :id="'ID' + i" :value="progressValue(e.base_stat)" :buffer="bufferValue(e.base_stat + 10)" rounded size="15px" color="purple" track-color="white">
                      <div class="absolute-full flex flex-center">
                        <q-badge color="grey" text-color="black" :label="e.base_stat" />
                      </div>
                    </q-linear-progress>
                  </div>
                </section>
              </div>
            </div>
          
          
              <!-- ________________________________________________________________ -->
            </div>

            <div class="juego" v-if="jugar">
              <div class="container-1">
                <div class="container-2">
                  <div class="nameId">
                    <label>
                      <p class="parrafo">Nombre del Pokémon</p>
                      <input type="text" v-model="nombrePokemon" :disabled="adivinado">
                    </label>

                    <button class="juegox" @click="fverificar()">verificar</button>

                    
                  </div>
                  <!-- <div class="contador">
                    <button class="enviar" @click="enviar()">Enviar</button>
                  </div> -->
                  <ul class="type" v-if="pokemonData && nombrePokemon === pokemonData.name">
                    <h3>Tipo:</h3>
                    <li v-for="(type, index) in pokemonData.types" :key="index" :class="type.type.name">
                      <span>{{ type.type.name }}</span>
                    </li>
                  </ul>
                  <div class="alert" v-if="verificar">
                    <h5>{{ alerta }}</h5>
                  </div>
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
              
              </div>
            </div>

    </q-page-container>

   
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios"


const pokemon = ref([])
const buscador = ref("")
const showcard = ref(false)
const busqueda=ref(true)
const jugar=ref(false)

async function traer() {
  jugar.value=false
busqueda.value=true
  clearInterval(intervalId);
  try {
    let r = await axios.get("https://pokeapi.co/api/v2/pokemon/" + buscador.value.trim())
    pokemon.value = r.data
    console.log(r.data)
    showcard.value = true;
  } catch (error) {
    console.log(error);
  } 
}
const irAJuego = () => {
 busqueda.value=false
 jugar.value=true
}

async function traerx(pokemonId) {
  try {
    let r = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokemonId);
    pokemon.value = r.data;
    showcard.value = true;
  } catch (error) {
    console.log(error);
  } 
}


const progressValue = (baseStat) => `0.${baseStat}`
const bufferValue = (baseStat) => `0.${baseStat + 10}`


function cargarCartaAleatoria() {
  const randomPokemonId = Math.floor(Math.random() * 898) + 1; 
  traerx(randomPokemonId); 
}



function iniciarCambioAutomatico() {
  intervalId = setInterval(cargarCartaAleatoria, 5000); 
}



let intervalId

iniciarCambioAutomatico()




// Juego de cual es ese pokemon !!!!!!______________________________________________________________________________________________________

let pokemonData = ref(null)
let nombrePokemon = ref("")
let error = ref("")
let adivinado = ref(false)
let verificar= ref(false)
let alerta=ref("")

buscarPokemonAleatorio()

async function buscarPokemonAleatorio() {
try{

    const idAleatorio = Math.floor(Math.random() * 1024) + 1;
    const resultado = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`)
    pokemonData.value = resultado.data
    console.log(pokemonData.value.name)
    nombrePokemon.value = ""
    adivinado.value = false
    error.value = ""
 

}

 catch (error) {
    console.log(error)
    error.value = "Se produjo un error al cargar el Pokémon."
  }
}

function fverificar(){

  if (nombrePokemon.value != pokemonData.value.name) { 
    alerta.value="Estas frio viejo"
      verificar.value = true;

      setTimeout(function() {
        verificar.value = false;
    }, 4000);
  }
 

      else if (nombrePokemon.value == pokemonData.value.name) {
        alerta.value="Pos por fin le pegas a una"
        verificar.value = true;
        setTimeout(function() {
        verificar.value = false;
    }, 4000);
    
  }}


</script>


<style scoped>
footer{
  text-align: center;
}

.logo{
  width:15vmax;
  height: fit-content;
  border-radius: 0;
}

.q-header{
  display: flex;
  flex-direction: row;
  background-color: rgba(206, 21, 21, 0);
justify-content: space-between;
}

.q-toolbar{
width: 75%;

}
.q-tabs{
  display: flex;
  

}


* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}


.q-page-container{
 background-image: url("https://img.freepik.com/vector-gratis/fondo-efecto-zoom-degradado_23-2149722799.jpg?w=1380&t=st=1713227547~exp=1713228147~hmac=24eb6300102013d3f787e37d180e3181ddfa4a446fb0e06d9286fe87f0687fd5");
  display: flex;
  justify-content: center;
  height: 100%;
  height: 100vh;
  margin: 0;

  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
background-position-y: 60%;
} 

.contenedor{
  display: flex;
  flex-direction: column;
  top:2vmax;
align-items: center;
align-content: center;
max-height: 48vmax;
}

.nombre{
font-size:5vmax;
}
.card{
  box-shadow: 1px 4px 4px 3px rgba(77, 76, 76, 0.76);
  display: flex;
justify-content: space-between;
align-items: center;
align-content: center;
flex-direction: column;
width: 80vmax;
max-height: 48vmax;
gap: 1vmax;

}
.divicion{
  display: flex;
  gap: 10vmax;
}
#imgdetras{
  width: 10vmax;
}
.linear-progress-section{
  width: 40vmax;
  display: flex;
  flex-direction: column;
  gap:0.2vmax;
}


.datos{
  display: flex;
flex-direction: column;
  font-family:'Courier New', Courier, monospace;
  font-style: italic;
  font-size:xx-large;
  justify-content: center;
}

.imagenes{
  gap: 3vmax;
}
#imgdetras{
  max-height: 16vmax;
  width: auto;
}

.encabezado{  
position:absolute;
  position: fixed;
  top: 10;
  left: 0;
  justify-content:space-around;
  display:flex;

width: 100%;
align-items: center;
}
#buscador{
  display: flex;
  gap: 2vmin;
  height: 3vmax;
 border-radius: 1vmax;
  width: 45vmax;
}

.lupa{
  background-color: burlywood;
  border-radius: 1vmin;
  width: 5vmin;
  height: auto;
  transition: transform .2s;
}
.lupa:hover{
  background-color: rgb(230, 175, 47);
  transform: scale(1.2);
}

.imagenesEncabezado{
display:flex;
flex-direction: column;
margin-top: 3vmax;
}

.juegox {
  background-color: rgb(230, 175, 47);
  height: auto; 
  padding: 0,15px; 
  border-radius: 20px; 
  margin-top: 8px; 
  line-height: 2; 
  cursor: pointer; 
  color: rgb(13, 25, 197); 
  font-weight: bold; 
  margin-right: 2vmin;
  font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif
}





/* Juego de cual es ese pokemon !!!!!!______________________________________________________________________________________________________*/

.alert {
  text-align: center;
  width: 36%;
  box-shadow: 7px 7px 14px #807c7c,
    -7px -7px 14px #807c7c;
  z-index: 1200;
 left: 5%;
 top: 70%;
  position: fixed;
  border-radius: 10px;
}

h5 {
 font-size: 300%;
  height: 100px;
  padding: 2%;
  padding-top: 5%;
  text-align: center;
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
 display: flex;
 flex-direction: column;
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


