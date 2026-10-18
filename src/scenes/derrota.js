export function derrota () {

    scene("derrota", () => {
        
        let escenaderrota = add([
            sprite("perdiste"),
            scale(1),
            pos(width()/2, height()/2),
            anchor("center"),
            "escenaderrota"
        ])
        
        onKeyPress("space",() => {
            go("inicio");
        });
    
    })

}