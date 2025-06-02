let nom, contrasenya;
let scriptURL = "https://script.google.com/macros/s/AKfycbzT0p6yEch_2Lccu1-clZQ9CzvwXqMrmholne9ItR_fzE1BY6YKD3XIM_ukqn268kwP/exec"   
window.addEventListener("load", session_iniciada);
function session_iniciada() {
    const validat = localStorage.getItem("validat");
    if (validat === "true") {
        if (window.location.href.includes("index.html")) {
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
        .then((resposta) => {
            return resposta.json();
        })
        .then((resposta) => {
            if (resposta.length == 0) {
                window.alert("El nom d'usuari o la contrasenya no són correctes.");
            }
            else {
                const usuari = resposta[0];
                
                if (usuari.admin === 1 || usuari.admin === "1") {
                    localStorage.setItem("validat", "true");
                    localStorage.setItem("admin", "true");
                    window.location.replace("principalADM.html");
                }
                else {
                    window.alert("S'ha iniciat correctament la sessió.");
                    inicia_sessio();
                }
            }
        });
}
function inicia_sessio() {
    localStorage.setItem("validat", "true");
    localStorage.setItem("admin", "false");
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
    let consulta_1 = scriptURL + "?query=select&where=nom_usuari&is=" + nom;
    fetch(consulta_1)
        .then((resposta) => {
            return resposta.json();
        })
        .then((resposta) => {
            if(resposta.length == 0) {    // No hi ha cap altres usuari amb el mateix nom
                let consulta_2 = scriptURL + "?query=insert&values=" + nom + "$$" + contrasenya + "$$" + 0; 
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