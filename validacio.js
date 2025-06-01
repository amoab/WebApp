let nom, contrasenya;
let scriptURL = "https://script.google.com/macros/s/AKfycbzT0p6yEch_2Lccu1-clZQ9CzvwXqMrmholne9ItR_fzE1BY6YKD3XIM_ukqn268kwP/exec"    // s'ha de substituir la cadena de text per la URL del script
window.addEventListener("load", session_iniciada);
function session_iniciada() {
    const validat = localStorage.getItem("validat");
    if (validat === "true") {
        if (!window.location.href.includes("principal.html")) {
            window.location.replace("principal.html");
        }
    } else {
        if (!window.location.href.includes("index.html")) {
            window.location.replace("index.html");
        }
    }
}   
function inici_sessio() {
   
    nom = document.getElementById("nom_usuari").value;  
    contrasenya = document.getElementById("contrasenya").value;
    if (!nom || !contrasenya) {
        window.alert("Has d'omplir tots els camps abans d'iniciar sessió.");
        return;
    }
    let consulta = scriptURL + "?query=select&where=nom_usuari&is=" + nom + "&and=contrasenya&equal=" + contrasenya;
    fetch(consulta)
        .then((resposta) => {   // registres que contenen el nom d'usuari i contrasenya escrits per l'usuari
            return resposta.json();    // conversió a llista
        })
        .then((resposta) => {
            if(resposta.length == 0) {    // llista buida
                window.alert("El nom d'usuari o la contrasenya no són correctes.");
            }
            else {    // llista amb (almenys) un registre
                window.alert("S'ha iniciat correctament la sessió.");
                inicia_sessio();
            }
        });
}
function inicia_sessio() {
    localStorage.setItem("validat", "true");
    window.location.replace("principal.html")
}

function cerrar_session() {
    localStorage.removeItem("validat");
    window.location.replace("index.html")
}
function nou_usuari() {
    nom = document.getElementById("nom_usuari").value;
    contrasenya = document.getElementById("contrasenya").value;
    if (nom.length < 3 || contrasenya.length < 3) {
            window.alert("L'usuari i la contrasenya necesiten un minim de tres caràcters.");
        return;
    }
    let consulta_1 = scriptURL + "?query=select&where=nom_usuari&is=" + nom;    // primera consulta per saber si ja existeix algun usuari amb el nom escrit per l'usuari que es vol registrar
    fetch(consulta_1)
        .then((resposta) => {
            return resposta.json();
        })
        .then((resposta) => {
            if(resposta.length == 0) {    // No hi ha cap altres usuari amb el mateix nom
                let consulta_2 = scriptURL + "?query=insert&values=" + nom + "$$" + contrasenya;    // segona consulta per registrar l'usuari nou
                fetch(consulta_2)
                    .then((resposta) => {
                        if (resposta.ok) {    // s'ha pogut afegir una registre en la base de dades
                            window.alert("S'ha completat el registre d'usuari.")
                            inicia_sessio();
                        }
                        else {    // no s'ha pogut afegir un registre en la base de dades
                            alert("S'ha produït un error en el registre d'usuari.")
                        }
                    })
            }
            else {    // l'usuari ha de tornar-ho a intentar amb un nom diferent
                alert("Ja existeix un usuari amb aquest nom.");
            }
        });
    }