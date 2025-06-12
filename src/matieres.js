import { getIdClient } from './gestion_entreprise.js'

// *************************************** Définition des variables
let datasMatieres = []
let datasDegressif = []
let datasFrais = []
let datasDecoupe = []
let fraisLancement
let globalPrixDecoupe
let idData
let session
const spanFraisFixe = document.querySelector('.fraix_fixe')
const spanPrixDecoupe = document.querySelector('.prix_decoupe_span')
let resultats = []

//Appel de la bse de données
window.addEventListener('DOMContentLoaded', () => {
    fetch('../api/matieres.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            console.log(datasFetch)
            datasMatieres = datasFetch.matieres
            datasDegressif = datasFetch.degressif
            datasFrais = datasFetch.frais
            datasDecoupe = datasFetch.decoupe
            globalPrixDecoupe = parseFloat(datasDecoupe[0].prix_decoupe)
            spanPrixDecoupe.innerHTML = globalPrixDecoupe
            fraisLancement = parseFloat(datasFrais[0].prix_frais)
            spanFraisFixe.innerHTML = `${fraisLancement}€`
            datasDegressif.sort((a, b) => a.min - b.min)
            // Trie alphabétique par nom_matiere
            datasMatieres.sort((a, b) => {
                return a.nom_matiere.localeCompare(b.nom_matiere)
            })
            //Appel de fonction
            addSelectMatiereType(datasMatieres)
        })
        .catch((error) => console.error('Erreur lors du chargement des données : ', error))

    //Récupération d'un ID généré et des infos de session
    fetch('../api/session_id.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            session = datasFetch.user
            console.log('user : ', session)
            idData = datasFetch.new_id
            console.log('idData : ', idData)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

//Query Selector pour tous les inputs
const spanCoutTotal = document.querySelector('.total_cout_matiere')

const btnCalcul = document.querySelector('.button-calcul-matieres')
btnCalcul.addEventListener('click', () => {
    inputNom.value = ''
    resultats = updateCalcul(
        fraisLancement,
        datasMatieres,
        datasDegressif,
        largeur_value,
        longueur_value,
        quantite_value,
        selectMatiere_value,
        checkDecoupe_value,
        espacePose_value
    )
    console.log('inversion : ', resultats[0])
    spanCoutTotal.innerHTML = resultats[1]
})

const largeur = document.querySelector('.input-largeur')
var largeur_value = largeur.value
largeur.addEventListener('input', () => {
    largeur_value = largeur.value
    btnValidation.disabled = true
    inputNom.disabled = true
})

const longueur = document.querySelector('.input-longueur')
var longueur_value = longueur.value
longueur.addEventListener('input', () => {
    longueur_value = longueur.value
    btnValidation.disabled = true
    inputNom.disabled = true
})

const quantite = document.querySelector('.input-qte')
var quantite_value = quantite.value
quantite.addEventListener('input', () => {
    quantite_value = quantite.value
    btnValidation.disabled = true
    inputNom.disabled = true
})

const selectMatiere = document.querySelector('.select-matiere')
var selectMatiere_value = selectMatiere.value
selectMatiere.addEventListener('change', () => {
    selectMatiere_value = selectMatiere.value
    btnValidation.disabled = true
    inputNom.disabled = true
})

const espacePose = document.querySelector('.input-espace')
var espacePose_value = espacePose.value
espacePose.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    if (espacePose.value === '') {
        espacePose.value = 0
        espacePose_value = 0
    } else {
        espacePose_value = espacePose.value
    }
})

const checkDecoupe = document.querySelector('.check-decoupe')
var checkDecoupe_value = checkDecoupe.value
checkDecoupe.addEventListener('change', (e) => {
    console.log('change')
    btnValidation.disabled = true
    inputNom.disabled = true
    if (e.target.checked === true) {
        checkDecoupe_value = true
    } else {
        checkDecoupe_value = false
    }
})
// Ajout de l'écoute sur le clavier
checkDecoupe.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault() // Empêche le scroll, etc.
        checkDecoupe.checked = !checkDecoupe.checked
        checkDecoupe_value = checkDecoupe.checked

        // Déclenche l'événement 'change' si nécessaire
        const changeEvent = new Event('change')
        checkDecoupe.dispatchEvent(changeEvent)
    }
})

const btnValidation = document.querySelector('.btnValiderDevis')
btnValidation.disabled = true
btnValidation.addEventListener('click', () => {
    PopupValiderEnregistrement(
        datasMatieres,
        idData,
        resultats[0],
        nom_value,
        longueur_value,
        largeur_value,
        quantite_value,
        selectMatiere_value,
        espacePose_value,
        checkDecoupe_value,
        resultats[1],
        getIdClient()
    )
})

const inputNom = document.querySelector('.nom_devis')
var nom_value = inputNom.value
inputNom.disabled = true
inputNom.addEventListener('change', () => {
    nom_value = inputNom.value
})
// FIN QUERY SELECTOR //

//Ajoute dynamiquement les types de matiere dans le select
function addSelectMatiereType(datasMatieres) {
    //On récupère les types de matiere
    const select_type = document.querySelector('.select-matiere')
    datasMatieres.forEach((matiere) => {
        //On les insère dans la balise select
        //Selecteur pour le type de matiere
        const option = document.createElement('option')
        option.value = matiere.Id_matiere
        option.innerHTML =
            matiere.nom_matiere +
            ' ' +
            matiere.code_matiere +
            ' ( Prix m² : ' +
            matiere.prix_mcarre +
            '€ / Type : ' +
            matiere.type_matiere +
            ', Laize : ' +
            matiere.laizes +
            ')'
        select_type.appendChild(option)
    })
}

function getCoefDegressif(datasDegressif, surface) {
    if (!Array.isArray(datasDegressif) || datasDegressif.length === 0) {
        console.warn('Données dégressives invalides ou vides.')
        return null
    }
    let trancheMax = null
    for (const tranche of datasDegressif) {
        const min = tranche.min
        const max = tranche.max
        // Si la quantité est dans la tranche
        if (surface >= min && surface <= max) {
            console.log('✅ Tranche exacte trouvée :', `${min}-${max}`)
            return parseFloat(tranche.prix_surface)
        }
        // On garde la tranche la plus haute pour fallback
        if (!trancheMax || max > trancheMax.max) {
            trancheMax = tranche
        }
    }
    // Si aucune tranche ne correspond, on renvoie la plus grande connue
    if (trancheMax) {
        console.log('➡️ Tranche dépassée, on retourne la plus haute :', `${trancheMax.min}-${trancheMax.max}`)
        console.log('surface fonction : ', surface)
        console.log('Tranche prix :', trancheMax.prix_surface)
        return parseFloat(trancheMax.prix_surface)
    }
    console.warn('⚠️ Aucune tranche applicable trouvée pour  surface =', surface)
    return null
}

function updateCalcul(fraisLancement, datasMatieres, datasDegressif, largeur, longueur, quantite, id_matiere, selectDecoupe, espacePose) {
    console.log('------------------- CALCUL NORMAL -------------------------------')
    const cout1 = calculFrais(
        fraisLancement,
        datasMatieres,
        datasDegressif,
        largeur,
        longueur,
        quantite,
        id_matiere,
        selectDecoupe,
        espacePose
    )
    console.log('------------------- CALCUL INVERSE LONGUEUR LARGEUR-------------------------------')
    const cout2 = calculFrais(
        fraisLancement,
        datasMatieres,
        datasDegressif,
        longueur,
        largeur,
        quantite,
        id_matiere,
        selectDecoupe,
        espacePose
    )
    if (cout1 === null && cout2 === null) {
        console.log('DIMENSIONS INCORRECTES POUR LES DEUX')
        return ['undefined', 'Veuillez renseigner tous les champs']
    }
    if (cout1 === null && !isNaN(cout2)) {
        console.log(['inversé', `${cout2}€`])
        btnValidation.disabled = false
        inputNom.disabled = false
        return ['inversé', `${cout2}€`]
    }
    if (!isNaN(cout1) && cout2 === null) {
        console.log(['normal', `${cout1}€`])
        btnValidation.disabled = false
        inputNom.disabled = false
        return ['normal', `${cout1}€`]
    }
    //Ou sinon on compare et conserve le minimum des deux calculs
    console.log('Cout 1 : ', cout1)
    console.log('Cout 2 : ', cout2)
    btnValidation.disabled = false
    inputNom.disabled = false
    return cout1 <= cout2 ? ['normal', `${cout1}€`] : ['inversé', `${cout2}€`]
}

function calculFrais(fraisLancement, datasMatieres, datasDegressif, largeur, longueur, quantite, id_matiere, selectDecoupe, espacePose) {
    if (!largeur || !longueur) {
        console.log('Veuillez renseigner les dimensions')
        return null
    }
    if (!quantite || isNaN(quantite) || quantite <= 0) {
        console.log('Veuillez renseigner une quantité')
        return null
    }
    if (id_matiere === 'null') {
        console.log('Veuillez renseigner une matière')
        return null
    }

    //Si découpe alors 4cm de chaque côté sinon 1cm de chaque côté
    const marge = selectDecoupe === true ? 4 : 1
    console.log('MARGES : ', marge)

    const matiere = datasMatieres.find((m) => m.Id_matiere === parseInt(id_matiere))
    if (!matiere) return 'Matière introuvable.'

    const laize = matiere.laizes
    const prixMcarre = matiere.prix_mcarre
    const espacePoseCM = espacePose / 10
    const largeurCM = parseFloat(largeur)
    const longueurCM = parseFloat(longueur)

    const format_utile = laize - 2 * marge
    console.log(`Laize utile : ${format_utile} cm`)
    const nbParLaize = Math.floor(format_utile / (largeurCM + espacePoseCM))
    console.log(`Calcul nbParLaize : ${format_utile} / (${largeurCM} + ${espacePoseCM}) = ${nbParLaize}`)
    const nbBandes = Math.ceil(quantite / nbParLaize)
    console.log(`Calcul nbBandes : ${quantite} / ${nbParLaize} = ${nbBandes}`)

    if (nbParLaize === 0) {
        console.log('Les dimensions sont trop grandes pour entrer dans la laize.')
        return null
    }

    // Surface d’une seule pièce avec espace (utile)
    const surfacePiece = (largeurCM * longueurCM) / 10000

    // Surface totale utile pour toute la quantité
    const surfacePieceTotale = surfacePiece * quantite

    // Longueur totale consommée : chaque bande a une longueur + espacePose (sauf la dernière)
    const longueurTotaleCM = (nbBandes * (longueurCM + espacePoseCM) - espacePoseCM).toFixed(4)
    console.log(`Calcul longueur totale (CM): ${nbBandes} * (${longueurCM} + ${espacePoseCM}) - ${espacePoseCM} = ${longueurTotaleCM}`)
    console.log('Longueur totale : ', longueurTotaleCM)

    // Surface totale consommée (avec perte) sur la laize
    const surfaceTotale = (laize * longueurTotaleCM) / 10000
    console.log(`Calcul surface totale : (${laize} * ${longueurTotaleCM}) / 10000 = ${surfaceTotale}`)
    console.log(`Surface totale (avec perte) : ${surfaceTotale.toFixed(4)} m²`)

    // Coefficient dégressif appliqué à la surface totale
    const prixDegressif = getCoefDegressif(datasDegressif, surfaceTotale)

    // Prix découpe (selon la surface utile réelle)
    selectDecoupe === true
        ? console.log(
              `Calcul découpe : surfacePieceTotale : ${surfacePieceTotale} * ${globalPrixDecoupe} =${
                  surfacePieceTotale * globalPrixDecoupe
              }`
          )
        : console.log('Pas de découpe')
    const prixDecoupe = selectDecoupe === true ? surfacePieceTotale * globalPrixDecoupe : 0

    // Coût matière
    console.log('Cout Matiere = prixDegressif * surfaceTotale * prixMcarre')
    console.log(`Calcul cout matiere : ${prixDegressif} * ${surfaceTotale} * ${prixMcarre}`)
    const coutMatiere = prixDegressif * surfaceTotale * prixMcarre

    const coutTotal = (fraisLancement + coutMatiere + prixDecoupe).toFixed(2)

    console.log(`${fraisLancement} + ${coutMatiere.toFixed(2)} + ${prixDecoupe.toFixed(2)}`)
    console.log('nb bandes : ', nbBandes)
    console.log('check Découpe : ', selectDecoupe)
    console.log(`Coef dégressif : ${prixDegressif}`)
    console.log(`Prix mcarré : ${prixMcarre}`)
    console.log(`Coût matière : ${coutMatiere.toFixed(2)} €`)
    console.log(`Prix découpe : ${prixDecoupe.toFixed(2)} €`)
    console.log(`Coût total : ${coutTotal} €`)
    return parseFloat(coutTotal)
}

function PopupValiderEnregistrement(
    datasMatieres,
    id,
    verification,
    nom,
    longueur,
    largeur,
    quantite,
    idMatiere,
    espace_pose,
    selectDecoupe,
    prix,
    idClient
) {
    if (session !== null) {
        const item = datasMatieres.find((mat) => mat.Id_matiere === parseInt(idMatiere))?.nom_matiere
        const decoupe = selectDecoupe === true ? 'Oui' : 'Non'
        console.log(id)
        console.log(longueur)
        console.log(largeur)
        console.log(quantite)
        console.log(item)
        console.log(espace_pose)
        console.log(decoupe)
        console.log(prix)
        console.log(idClient)
        const confirmation = confirm('Voulez-vous enregistrer ce devis ? ')
        if (parseInt(idClient) === -1) {
            id = id.replace('ID', 'Simulation_')
        }
        if (confirmation) {
            const params = new URLSearchParams({
                nom: nom === '' ? id : nom,
                longueur: verification === 'normal' ? longueur : largeur,
                largeur: verification === 'normal' ? largeur : longueur,
                quantite: quantite,
                item: item,
                espace_pose: espace_pose,
                decoupe: decoupe,
                prix: prix,
                idClient: idClient,
            })

            const url = `../app/app.php?action=add_matiere_data&${params.toString()}`
            window.location.href = url
        }
    } else {
        const confirmation = confirm(
            'Vous devez être connecté pour pouvoir bénéficier de cette fonctionnalité. Appuyer sur "OK" pour afficher le formulaire de connexion. '
        )
        if (confirmation) {
            window.location.href = '../app/login.php'
        }
    }
}
