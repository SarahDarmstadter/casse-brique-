const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const affichageScore = document.querySelector('.score')

const rayonBalle = 10;
const barreHeight = 10;
const barreWidth = 75;

let x = canvas.width/2;
let y = canvas.height -30;
let barreX = (canvas.width - barreWidth)/2;
let fin = false;
let vitesseX = 3, vitesseY = -3, score =0;

const nbRow = 9 , nbCol = 9, largeurBrique = 63, hauteurBrique = 20

//la balle
function dessineBalle() {
    ctx.beginPath()
    ctx.arc(x, y, rayonBalle, 0, Math.PI*2)
    ctx.fillStyle = "#333"
    ctx.fill()
    ctx.closePath()
}
//dessineBalle()

//la barre
function dessineBarre() {
    ctx.beginPath()
    ctx.rect(barreX, canvas.height - barreHeight - 2, barreWidth, barreHeight)
    ctx.fillStyle = '#333'
    ctx.fill()
    ctx.closePath()
}
//dessineBarre()

//les briques 
//chaque ligne est tableau d'objets qui ont une position sur x et sur y et un statut 
let briques = [];
for (let i = 0; i < nbCol; i++) {

    briques[i] = [];

    for (let j=0; j< nbRow; j++){

        briques[i][j] = {x: 0, y:0, statut : 1}
    }
}
//console.log(briques)

function dessineBriques(){
    for (let i=0; i < nbRow; i++){
        for(let j=0; j< nbCol; j++){
            if(briques[i][j].statut === 1){
                // 8* (75 + 10) lageur de la brique et un espacement + 35px de chaque coté pour centrer = 750
                let briqueX = (j * (largeurBrique + 7) + 10)
                let briqueY = (i * (hauteurBrique + 7) + 10)

                briques[i][j].x = briqueX;
                briques[i][j].y = briqueY;

                
                ctx.beginPath()
                ctx.rect(briqueX, briqueY, largeurBrique, hauteurBrique)
                ctx.fillStyle = "black"
                ctx.fill()
                ctx.closePath()
            }           
        }
    }
   
}
//dessineBriques()

function dessine() {
    if(fin === false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        dessineBalle()
        dessineBarre()
        dessineBriques()
        collisionDetection()

// effet de rebond sur les bords         
    if(x + vitesseX > canvas.width - rayonBalle || x + vitesseX < rayonBalle){
        vitesseX = -vitesseX
    }

//effet de rebond sur le haut 
    if(y + vitesseY < rayonBalle ){
        vitesseY = - vitesseY
    }

// si on touche le sol. Soit on rebondi, soit on meurt
    if(y + vitesseY > canvas.height - rayonBalle) {
        //ca touche la barre
        if(x > barreX && x < barreX + barreWidth){
            vitesseX = vitesseX + 0.1
            vitesseY = vitesseY + 0.1
            vitesseY = - vitesseY
        }

        else {
            fin = true;
            affichageScore.innerHTML = `Perdu ! <br> Cliquez sur le casse brique pour recommencer.`

        }
    } 


//effet de deplacement
        x += vitesseX;
        y += vitesseY;
        requestAnimationFrame(dessine)
    }

}
dessine()

//Collision et detection 
function collisionDetection(){
    for(let i=0; i < nbRow; i++){
        for(let j=0; j< nbCol; j++){
            let b = briques[i][j]
            if(b.statut === 1) {
                if( x > b.x && x < b.x +largeurBrique && y > b.y && y < b.y + hauteurBrique) {
                    
                    vitesseY = -vitesseY;
                    b.statut = 0;
                    score++
                    affichageScore.innerHTML = `Score : ${score}`

                    if(score === nbCol * nbRow){
                        affichageScore.innerHTML = `Bravo ! <br> Cliquez sur le jeu pour recommencer`;
                        fin = true;
                    }
                }
            }
        }
    }
}
//pour recommencer 
canvas.addEventListener("click", ()=> {
    if(fin === true) {
        fin = false;
        document.location.reload()
    }
});


//bouger la barre 
document.addEventListener("mousemove", mouvementSouris);

function mouvementSouris(e){

    let positionXBarreCanvas = e.clientX - canvas.offsetLeft
    if(positionXBarreCanvas > 35  && positionXBarreCanvas < canvas.width - 35) {
        barreX = positionXBarreCanvas -barreWidth/2
    }

}