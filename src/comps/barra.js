export function barraTiempo(tiempoTotal) {
    let barra = null; 
    let tiempoPasado = 0;
    let activo = false;

    onUpdate(() => {
        if (!activo || !barra) return;
        tiempoPasado += dt();
        barra.width = 100 * (1 - tiempoPasado / tiempoTotal);
        
        if (tiempoPasado >= tiempoTotal) { 
            activo = false;
            barra.destroy()
        }

    });

    return {
        iniciar: () => { 
            if (barra) barra.destroy() 
            barra = add([rect(150, 30), pos(200, 100), color("#ffffff"), fixed()]);
            tiempoPasado = 0;
            activo = true;
        },

        cancel: () => {
            activo = false;
            if (barra) barra.destroy() 
        }
    };
}