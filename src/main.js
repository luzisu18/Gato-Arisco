// Importaciones de Kaplay, no se pueden eliminar

import kaplay from "kaplay";
import "kaplay/global";

// Importación de la escena del juego

import { cargarJuego } from "./scenes/juego";

// Configuración de la pantalla y el fondo inicial

kaplay({width: screen.width,
    height: screen.height,
    canvas: document.querySelector("#mycanvas"),
    background: ["#FFBF00"]});

// Configuración, para no poner la "k" de kaplay

loadRoot("./");

// Sprites e imágenes cargadas

loadSprite("gatocomun", "recursos/imagenes/gato_feliz.PNG");
loadSprite("cuerpa", "recursos/imagenes/cuerpa.PNG");
loadSprite("gatoenojado", "recursos/imagenes/gato_enojado.PNG")
loadSprite("gatofurioso", "recursos/imagenes/gato_furioso.PNG")
loadSprite("escenainicio", "recursos/ui/inicio.PNG")
loadSprite("gatoraro", "recursos/imagenes/gato raro.PNG")
loadSprite("gatomasraro", "recursos/imagenes/gato_mas_raro.PNG")
loadSprite("gatomuyfeliz", "recursos/imagenes/gato_muy_feliz.PNG")
loadSprite("perdiste", "recursos/ui/perdiste.PNG")
loadSprite("ganaste", "recursos/ui/ganaste.PNG")

// ESCENA DE INICIO

scene("inicio", () => {

    // Boton de inicio

    let escenainicio = add([
        sprite("escenainicio"),
        pos(width()/2, height()/2-50),
        anchor("center"),
        "escenainicio"
    ])

    // Tecla espacio inicia el juego

    onKeyPress("space",() => {
        go("juegoPrincipal");
    });

})

cargarJuego();
go("inicio")