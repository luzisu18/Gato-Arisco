export function ganar () {

    scene("victoria", () => {
        
        let escenaganar = add([
            sprite("ganaste"),
            scale(1),
            pos(width()/2, height()/2),
            anchor("center"),
            "victoria"
        ])
        
        onKeyPress("space",() => {
            go("inicio");
        });
    
    })

}