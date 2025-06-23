import { getIdClient } from './gestion_entreprise.js'
import { getDatasDesignations, verifDesignations, getTotalPrixDesignation } from './designations.js'
import { datasDevis as datasDevisMat, devisLoaded } from './getDevisWithId.js'

// *************************************** Définition des variables
let datasMatieres = []
let datasDegressif = []
let datasFrais = []
let datasDecoupe = []
let datasLamination = []
let fraisLancement
let globalPrixDecoupe
let idData
let session
const spanFraisFixe = document.querySelector('.fraix_fixe')
const spanPrixDecoupe = document.querySelector('.prix_decoupe_span')
let resultats = []
//Modif ou duplicat de devis
let idDevis
let action
//Appel de la bse de données
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    idDevis = params.get('id')
    action = params.get('modif')
    Promise.all([fetch('../api/matieres.php').then((res) => res.json()), fetch('../api/session_id.php').then((res) => res.json())])
        .then(([datasMatieresFetch, datasSessionFetch]) => {
            // ---- Données matières.php ----
            console.log(datasMatieresFetch)
            datasMatieres = datasMatieresFetch.matieres
            datasDegressif = datasMatieresFetch.degressif
            datasFrais = datasMatieresFetch.frais
            datasLamination = datasMatieresFetch.laminations
            console.log('datasLamination : ', datasLamination)
            datasDecoupe = datasMatieresFetch.decoupe

            globalPrixDecoupe = parseFloat(datasDecoupe[0].prix_decoupe)
            spanPrixDecoupe.innerHTML = globalPrixDecoupe

            fraisLancement = parseFloat(datasFrais[0].prix_frais)
            spanFraisFixe.innerHTML = `${fraisLancement}€`

            datasDegressif.sort((a, b) => a.min - b.min)
            datasMatieres.sort((a, b) => a.nom_matiere.localeCompare(b.nom_matiere))
            datasLamination.sort((a, b) => a.description.localeCompare(b.description))

            addSelectMatiereType(datasMatieres)
            addSelectLamination(datasLamination)

            // ---- Données session_id.php ----
            session = datasSessionFetch.user
            console.log('user : ', session)

            idData = datasSessionFetch.new_id
            console.log('idData : ', idData)

            devisLoaded.then(() => {
                // Traitement du devis si duplication ou modification
                if (idDevis) {
                    console.log('datas devis : ', datasDevisMat)
                    remplirCalculDevis()
                }
            })
        })
        .catch((error) => {
            console.error('Erreur lors du chargement des données :', error)
        })
})

//Query Selector pour tous les inputs
const spanCoutTotal = document.querySelector('.total_cout_matiere')

const btnCalcul = document.querySelector('.button-calcul-matieres')
btnCalcul.addEventListener('click', () => {
    console.log('designations : ', getDatasDesignations())
    inputNom.disabled = true
    spanCoutTotal.innerHTML = ''
    if (!verifDesignations(getDatasDesignations())) return
    resultats = updateCalcul(
        fraisLancement,
        datasMatieres,
        datasDegressif,
        largeur.value,
        longueur.value,
        quantite.value,
        selectMatiere.value,
        checkDecoupe_value,
        espacePose.value,
        selectLamination.value,
        getTotalPrixDesignation()
    )
    console.log('inversion : ', resultats[0])
    spanCoutTotal.innerHTML = resultats[1]
})

const largeur = document.querySelector('.input-largeur')
largeur.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
})

const longueur = document.querySelector('.input-longueur')
longueur.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
})

const quantite = document.querySelector('.input-qte')
quantite.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
})

const selectMatiere = document.querySelector('.select-matiere')
selectMatiere.addEventListener('change', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
})

const selectLamination = document.querySelector('.select-lamination')
selectLamination.addEventListener('change', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
})

const espacePose = document.querySelector('.input-espace')
espacePose.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    if (espacePose.value === '') {
        espacePose.value = 0
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
        idData,
        resultats[0],
        nom_value,
        longueur.value,
        largeur.value,
        quantite.value,
        selectMatiere.value,
        espacePose.value,
        checkDecoupe_value,
        selectLamination.value,
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
        option.innerHTML = `${matiere.nom_matiere} - ${matiere.laizes}cm (${matiere.prix_mcarre}€/m²)`
        select_type.appendChild(option)
    })
}

//Ajoute dynamiquement les types de lamination dans le select
function addSelectLamination(datasLamination) {
    //On récupère les types de matiere
    const select_type = document.querySelector('.select-lamination')
    datasLamination.forEach((lamination) => {
        //On les insère dans la balise select
        //Selecteur pour le type de lamination
        const option = document.createElement('option')
        option.value = lamination.Id_lamination
        option.innerHTML = lamination.description + ' ( Prix m² : ' + lamination.prix_lamination + ')'
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

function updateCalcul(
    fraisLancement,
    datasMatieres,
    datasDegressif,
    largeur,
    longueur,
    quantite,
    id_matiere,
    selectDecoupe,
    espacePose,
    lamination,
    prix_designations
) {
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
        espacePose,
        lamination,
        prix_designations
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
        espacePose,
        lamination,
        prix_designations
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

function calculFrais(
    fraisLancement,
    datasMatieres,
    datasDegressif,
    largeur,
    longueur,
    quantite,
    id_matiere,
    selectDecoupe,
    espacePose,
    laminationId,
    prix_designations
) {
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

    // Prix lamination (selon la surface totale utilisée, pertes comprises)
    let prix_lamination = 0
    if (parseInt(laminationId) !== -1) {
        const lamination = datasLamination.find((l) => l.Id_lamination === parseInt(laminationId))
        if (!lamination) return 'Lamination introuvable.'
        prix_lamination = surfaceTotale * lamination.prix_lamination
    }
    console.log('Montant lamination : ', prix_lamination)

    // Coût matière
    console.log('Cout Matiere = prixDegressif * surfaceTotale * prixMcarre')
    console.log(`Calcul cout matiere : ${prixDegressif} * ${surfaceTotale} * ${prixMcarre}`)
    const coutMatiere = prixDegressif * surfaceTotale * prixMcarre

    const coutTotal = (fraisLancement + coutMatiere + prixDecoupe + prix_lamination + prix_designations).toFixed(2)

    console.log(
        `${fraisLancement} + ${coutMatiere.toFixed(2)} + ${prixDecoupe.toFixed(2)} + ${prix_lamination.toFixed(2)} + ${prix_designations}`
    )
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
    id,
    verification,
    nom,
    longueur,
    largeur,
    quantite,
    idMatiere,
    espace_pose,
    selectDecoupe,
    lamination,
    prix,
    idClient
) {
    if (session !== null) {
        const decoupe = selectDecoupe === true ? 'Oui' : 'Non'
        const params = new URLSearchParams({
            nom: nom === '' ? id : nom,
            longueur: verification === 'normal' ? longueur : largeur,
            largeur: verification === 'normal' ? largeur : longueur,
            quantite,
            item: idMatiere,
            espace_pose,
            decoupe,
            prix,
            idClient,
            designations: JSON.stringify(getDatasDesignations()),
            lamination,
        })

        if (action === 'modif') {
            // *********************** Modif d'un devis
            params.append('idD', idDevis)
            console.log('URL:', '../app/app.php?action=modif_devis_mat')
            console.log('Body:', params.toString())
            fetch('../app/app.php?action=modif_devis_mat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.status === 'success') {
                        const demandeVoirDevisModif = confirm('Votre devis a été modifié. Voulez-vous le visualiser ?')
                        if (demandeVoirDevisModif) {
                            const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(idDevis)}`
                            window.open(url, '_blank')
                        } else {
                            window.location.href = '../app/app.php?action=calcul_impression'
                        }
                    } else {
                        alert(data.message)
                    }
                })
                .catch((e) => {
                    alert("Une erreur s'est produite, veuillez réessayer.")
                    console.log(e)
                })
        } else if (action === 'copy') {
            // ********************** Copy d'un devis
            fetch('../app/app.php?action=copy_devis_mat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        const newIdDevis = parseInt(data.idDevis)
                        const demandeVoirDevisModif = confirm('Votre devis a été copié. Voulez-vous le visualiser ?')
                        if (demandeVoirDevisModif) {
                            const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(newIdDevis)}`
                            window.open(url, '_blank')
                        } else {
                            window.location.href = '../app/app.php?action=calcul_impression'
                        }
                    } else {
                        alert(data.message)
                    }
                })
                .catch((e) => {
                    alert("Une erreur s'est produite, veuillez réessayer.")
                    console.log(e)
                })
        } else {
            // ****************** Cas d'ajout normal
            const confirmation = confirm('Voulez-vous enregistrer ce devis ?')
            if (parseInt(idClient) === -1) {
                id = 'Simulation_' + id
            }
            if (confirmation) {
                fetch('../app/app.php?action=add_matiere_data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString(),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === 'success') {
                            const idDevis = parseInt(data.idDevis)
                            console.log(data)
                            const demandeVoirDevis = confirm('Votre devis a été enregistré. Voulez-vous le visualiser ?')
                            if (demandeVoirDevis) {
                                const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(idDevis)}`
                                window.open(url, '_blank')
                            } else {
                                window.location.href = '../app/app.php?action=calcul_matiere'
                            }
                        } else {
                            alert(data.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        alert("Une erreur s'est produite, veuillez réessayer.")
                    })
            }
        }
    } else {
        const confirmation = confirm(
            'Vous devez être connecté pour pouvoir bénéficier de cette fonctionnalité. Appuyez sur "OK" pour afficher le formulaire de connexion.'
        )
        if (confirmation) {
            window.location.href = '../app/login.php'
        }
    }
}

//Si l'utilisateur modifie son devis ou le duplique, on recharge les infos en fonction
function remplirCalculDevis() {
    largeur.value = datasDevisMat.largeur ?? ''
    longueur.value = datasDevisMat.longueur ?? ''
    quantite.value = datasDevisMat.quantite
    selectLamination.value = datasDevisMat.Id_lamination
    selectMatiere.value = datasDevisMat.Id_matiere
    selectMatiere.selected = selectMatiere.value
    espacePose.value = datasDevisMat.espace_pose
    if (datasDevisMat.decoupe === 'Oui') {
        checkDecoupe.checked = true
        checkDecoupe.value = true
        checkDecoupe_value = true
    } else {
        checkDecoupe.checked = false
        checkDecoupe.value = false
        checkDecoupe_value = false
    }
    if (action === 'modif') {
        btnCalcul.value = 'Refaire le calcul'
        inputNom.value = datasDevisMat.enregistrement_nom
        btnValidation.innerHTML = 'Modifier le devis'
    }

    spanCoutTotal.innerHTML = `${datasDevisMat.prix}€`
    resultats[1] = datasDevisMat.prix
    inputNom.disabled = false
    btnValidation.disabled = false
}
