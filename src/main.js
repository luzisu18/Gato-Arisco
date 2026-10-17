// Importaciones de Kaplay, no se pueden eliminar

import kaplay from "kaplay";
import "kaplay/global";

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

// Escena de juego

scene("juegoPrincipal", () => {

    // Array de objetos con los tres estados de ánimo del gato.
    // 0 => Comun
    // 1 => Enojado
    // 2 => Furioso
    // Contienen un sprite y una función al mimarlo

    const estadosDeAnimo = [
        {
            sprite: "gatocomun",
            almimar: () => timerEsperandoMimos = wait(1, () => aranazos())
        },
        {
            sprite: "gatoenojado",
            almimar: () => aranazos()
        },
        {
            sprite: "gatofurioso",
            almimar: () => {}
        }
    ]

    // Objeto gato, con un sprite que debería ser dependiente del estado del juego
    // Si no funciona, se carga con sprite(estadoActual.sprite) y un use afuera que actualiza.
    // Escalado, posicionado y con tag "gato"

    let gato = add([
        pos(width()/2 -60, height()/2 - 30),
        anchor("center"),
        scale(0.8),
        use(sprite(estadoActual.sprite)),
        "gato",
    ]);

    // Objeto cuerpo, de momento no cumple ninguna función

    let cuerpo = add([
        pos(width()/2, height()),
        sprite("cuerpa"),
        scale(1),
        anchor("bot"),
        "cuerpo"
    ])

    // VARIABLES AUXILIARES, estoy buscando cómo quitarlas

    let estadoActual = estadosDeAnimo[0];
    let vidas = 3;

    let mimando = false;
    let timerEsperandoMimos = null;
    let timerSinMimos = null;
    let timerParaGanar = null;

    // Esta variable te setea un número entre 2 y 4, que se usa después para ver cuánto tarda el gato en enojarse.

    const aleatEnojoTimer = () => Math.floor(Math.random() * 4) + 2;


    // Cuando mimás al gato, se borran dos TIMERS:
    // 1. Tiempo sin mimos (porque está siendo mimado)
    // 2. Tiempo esperando mimos (si te pasás de 1 segundo sin mimar mientras mimás, te araña. Función más adelante)
    // Y después, ejecuta una función vinculada al estado emocional del gato que define cómo va a reaccionar.
    
    function mimar (accionAlMimar) {
        timerEsperandoMimos?.cancel()
        timerSinMimos?.cancel()
        accionAlMimar()
    }

    // Esta función se debería ejecutar cuando empezás a mimar al gato
    // Activa un timer de 10 segundos. Si termina y seguís mimándolo, ganás
    // También activa un loop de enojos, donde de vez en cuando el gato se enoja, y después de 1 segundo se calma.
    // De momento no está ejecutándose, hice unos cambios y colgué en pushear
    
    function empezarMimos() {
        mimando = true;
            timerParaGanar = wait (10, () => ganar())
            loop(aleatEnojoTimer(), () => {
                gatoCambiaAnimo(1);
                wait(1, () => gatoCambiaAnimo(0))
            })
    }

    // Función básica que recibe un índice y cambia el estado anímico del gato al índice elegido
    // 1 => Comun
    // 2 => Enojado
    // 3 => Furioso (o arañando)
    
    function gatoCambiaAnimo(index) {
        estadoActual = estadosDeAnimo[index];
    }

    // Función de arañazos. Cuando te arañan, perdés 1 vida, dejás de mimar y se cancela el timer que te haría ganar.
    // Además, se inicia un timer de tiempo que aguanta el gato sin recibir ningun mimo (4 segundos)
    
    function aranazos() {
        mimando = false
        vidas -= 1;
        timerParaGanar.cancel();
        timerSinMimos = wait (4, () => aranazos())
    }

    // Controlador del juego, con barra espaciadora mimás en base al estado del gato
    
    onKeyPress("space", () => mimar(estadoActual.almimar))

})













//

//const perder = () => cuerpo.destroy(); mimando = false