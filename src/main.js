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
loadSprite("botoninicio", "recursos/ui/boton_inicio_test.png")

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
            almimar: () => estaMimando ? timerEsperandoMimos = wait(1, () => aranazos()) : empezarMimos()
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

    // El estado del gato empieza normal, empezás con 3 vidas

    let estadoActual = estadosDeAnimo[0];
    let vidas = 3;

    // Inicializa en false el estado mimando del jugador (empieza sin mimar al gato)

    let estaMimando = false;

    // VARIABLES AUXILIARES, estoy buscando cómo quitarlas

    let timerEsperandoMimos = null;
    let timerSinMimos = null;
    let timerParaGanar = null;
    let timerGatoSeCalma = null;
    let timerEnojos = null;

    const baseYParaRebote = height()/2 - 30
    // Objeto cuerpo, de momento no cumple ninguna función

    let cuerpo = add([
        pos(width()/2, height()),
        sprite("cuerpa"),
        scale(1),
        anchor("bot"),
        "cuerpo"
    ])

    // Objeto gato, con un sprite que debería ser dependiente del estado del juego
    // Si no funciona, se carga con sprite(estadoActual.sprite) y un use afuera que actualiza.
    // Escalado, posicionado y con tag "gato"

    let gato = add([
        pos(width()/2 -60, height()/2 - 30),
        anchor("center"),
        scale(0.8),
        "gato",
    ]);

    // Función básica que actualiza el estado del gato

    onUpdate(() => gato.use(sprite(estadoActual.sprite))
)
    // Esta variable te setea un número entre 2 y 4, que se usa después para ver cuánto tarda el gato en enojarse.

    const aleatEnojoTimer = () => Math.random() * 3 + 1;

    // Cuando mimás al gato, se borran dos TIMERS:
    // 1. Tiempo sin mimos (porque está siendo mimado)
    // 2. Tiempo esperando mimos (si te pasás de 1 segundo sin mimar mientras mimás, te araña. Función más adelante)
    // Sumado un rebote mínimo al mimar
    // Y después, ejecuta una función vinculada al estado emocional del gato que define cómo va a reaccionar.
    
    function mimar (accionAlMimar) {
        timerEsperandoMimos?.cancel()
        timerSinMimos?.cancel()
        if (estaMimando) {reboteDeMimos()}
        accionAlMimar()
    }

   // función que ejecuta los enojos, se llama a sí misma
   // Cada cierto tiempo aleatorio entre 1 y 3s, el gato cambia su animo a enojo
   // Anula el timer esperando mimos, porque ya recibe mimos
   // Y un segundo después, si no se lo mimó, el gato se calma y su animo vuelve a común
   // PERO si después de otro segundo de que se calmó no se lo mima, te araña.
    
    function enojarse() {
        timerEnojos = wait(aleatEnojoTimer(), () => {
            gatoCambiaAnimo(1);
            timerEsperandoMimos?.cancel()
            timerGatoSeCalma = wait(1, () => {
                gatoCambiaAnimo(0);
                timerEsperandoMimos = wait(1, () => aranazos())
            })
            enojarse()
        })
    }

    // inicia la sesión de mimos
    // cancela los timers de enojos y de ganar si es que hay
    // inicia un timer de 10 segundos con posibilidad para ganar
    // inicia un posible enojo

    function empezarMimos() {

        timerParaGanar?.cancel();
        timerEnojos?.cancel();

        estaMimando = true
        timerParaGanar = wait (10, () => ganar())
        enojarse()
    }

    // función estética que se aplica cada vez que hay un mimo. hace un saltito corto con rebote.

    function reboteDeMimos() {
        let copiaY = baseYParaRebote
        tween(
            copiaY,
            copiaY -= 20,
            0.05,
            (val) => gato.pos.y = val,
            easings.easeOutQuad
        ) .then (() => {tween(
            copiaY,
            copiaY += 20,
            0.05,
            (val) => gato.pos.y = val,
            easings.easeInQuad
    )
    })}

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

        // Dejás de mimar y perdés 1 vida
        
        estaMimando = false;
        vidas -= 1;

        // Se cancelan todos los timers, porque ya arañó

        timerGatoSeCalma?.cancel();
        timerSinMimos?.cancel();
        timerEsperandoMimos?.cancel();
        timerParaGanar?.cancel();
        timerEnojos?.cancel();
        
        // El gato te araña
        
        gatoCambiaAnimo(2)
        
        // Rebote estético cada vez que el gato araña

        
        timerGatoSeCalma = wait(1, () => {
            
            gatoCambiaAnimo(0);
        });

        // Timer de aguante del gato sin mimos

        timerSinMimos = wait (4, () => aranazos())
    }

    // Controlador del juego, con barra espaciadora mimás en base al estado del gato
    
    onKeyPress("space", () => {mimar(estadoActual.almimar)})

})

// ESCENA DE INICIO

scene("inicio", () => {

    // Boton de inicio

    let iniciobtn = add([
        sprite("botoninicio"),
        pos(width()/2, height()/2-50),
        anchor("center"),
        scale(0.3),
        area(),
        "iniciobtn"
    ])

    // Tecla espacio inicia el juego

    onKeyPress("space", () => {
        iniciobtn.scale = vec2(0.25);
    });

    // Efecto estético

    onKeyPress("space",() => {
        iniciobtn.scale = vec2(0.3);
        go("juegoPrincipal");
    });
})

go("inicio")