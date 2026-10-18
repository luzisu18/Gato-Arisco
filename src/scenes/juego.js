import { barraTiempo } from "../comps/barra"
import { derrota } from "./derrota"
import { ganar } from "./victoria"

export function cargarJuego () {

    scene("juegoPrincipal", () => {

        // Array de objetos con los tres estados de ánimo del gato.
        // 0 => Comun
        // 1 => Enojado
        // 2 => Furioso
        // Contienen un sprite y una función al mimarlo

        let estadosidle = ["gatocomun", "gatoraro", "gatomasraro", "gatomuyfeliz"]
        let idlenum = 0
        const estadosDeAnimo = [
            {
                sprite: estadosidle[idlenum],
                almimar: () => {if (estaMimando) {barraSinMimos.cancel(); timerSinMimos?.cancel(); barraEsperandoMimos.iniciar(); timerEsperandoMimos?.cancel(); timerEsperandoMimos = wait(1, () => aranazos());} else {empezarMimos()}}
            },
            {
                sprite: "gatoenojado",
                almimar: () => aranazos()
            },
            {
                sprite: "gatofurioso",
                almimar: () => {}
            },

        ]


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
        let loopEmociones = null;

        const baseYParaRebote = height()/2
        
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
            pos(width()/2, height()/2),
            anchor("center"),
            scale(0.8),
            "gato",
        ]);

        let barraEsperandoMimos = barraTiempo(1);
        let barraSinMimos = barraTiempo(2);

        // Función básica que actualiza el estado del gato

        onUpdate(() => gato.use(sprite(estadoActual.sprite)))
        
        // Esta variable te setea un número entre 2 y 4, que se usa después para ver cuánto tarda el gato en enojarse.

        const aleatEnojoTimer = () => Math.floor(Math.random() * 2 + 1);

        function estadoidlerandom () {
            let nuevoIdle;
            do {
                nuevoIdle = Math.floor(Math.random() * estadosidle.length)
            } while (idlenum === nuevoIdle)
            return nuevoIdle
        }

        // Cuando mimás al gato, se borran dos TIMERS:
        // 1. Tiempo sin mimos (porque está siendo mimado)
        // 2. Tiempo esperando mimos (si te pasás de 1 segundo sin mimar mientras mimás, te araña. Función más adelante)
        // Sumado un rebote mínimo al mimar
        // Y después, ejecuta una función vinculada al estado emocional del gato que define cómo va a reaccionar.
        
        function mimar (accionAlMimar) {
            if (estaMimando) {reboteDeMimos()}
            accionAlMimar()
        }

    // función que ejecuta los enojos, se llama a sí misma
    // Cada cierto tiempo aleatorio entre 1 y 3s, el gato cambia su animo a enojo
    // Anula el timer esperando mimos, porque ya recibe mimos
    // Y un segundo después, si no se lo mimó, el gato se calma y su animo vuelve a común
    // PERO si después de otro segundo de que se calmó no se lo mima, te araña.
        
        function emocionAleatoria() {
            timerEsperandoMimos?.cancel();
            gatoCambiaAnimo(0)
            timerEsperandoMimos = wait(1, () => aranazos())
            barraEsperandoMimos.iniciar()
        }


        function loopDeJuego() {
            timerEnojos = wait(aleatEnojoTimer(), () => {
                loopEmociones?.cancel()
                timerEsperandoMimos.cancel();
                gatoCambiaAnimo(1);
                timerGatoSeCalma = wait (1, () => {loopEmociones = loop(1, () => emocionAleatoria()); loopDeJuego();

                })
                
            })
        }

        // inicia la sesión de mimos
        // cancela los timers de enojos y de ganar si es que hay
        // inicia un timer de 10 segundos con posibilidad para ganar
        // inicia un posible enojo

        function empezarMimos() {
            timerGatoSeCalma?.cancel();  
            timerSinMimos?.cancel();

            timerParaGanar?.cancel();
            timerEnojos?.cancel();

            estaMimando = true
            timerParaGanar = wait (10, () => go("victoria"))

            loopDeJuego();
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

            loopEmociones?.cancel()
            timerGatoSeCalma?.cancel();
            timerSinMimos?.cancel();
            timerEsperandoMimos?.cancel();
            timerParaGanar?.cancel();
            timerEnojos?.cancel();

            barraEsperandoMimos.cancel()
            barraSinMimos.cancel()

            
            
            // El gato te araña
            
            gatoCambiaAnimo(2)
            
            // Rebote estético cada vez que el gato araña

            
            timerGatoSeCalma = wait(1, () => {

                if (vidas <= 0) {
                go("derrota")
                return;
                }

                barraSinMimos.iniciar();
                gatoCambiaAnimo(0);
                timerSinMimos = wait (2, () => aranazos())
            });

            // Timer de aguante del gato sin mimos

        }

        loop(1, () => {
            if (estadoActual === estadosDeAnimo[0]) {
                idlenum = estadoidlerandom()
                estadosDeAnimo[0].sprite = estadosidle[idlenum]
            }
        })
        
        derrota();
        ganar();
        // Controlador del juego, con barra espaciadora mimás en base al estado del gato
        onKeyPress("space", () => {mimar(estadoActual.almimar)
})

    })
}