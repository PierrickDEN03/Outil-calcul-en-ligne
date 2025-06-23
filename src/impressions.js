import { getIdClient } from './gestion_entreprise.js'
import { getDatasDesignations, verifDesignations, getTotalPrixDesignation } from './designations.js'
import { datasDevis as datasDevisImpr, devisLoaded } from './getDevisWithId.js'

//Définition des variables
let datasImpressions = []
let dictNbOnPaper = []
let datasDegressif = []
let datasPliage = []
let fraisPliage
let prixQtePliage
var coutTotal = 0
let idData
let session
let fraisFixe
const spanFraisFixe = document.querySelector('.fraix_fixe')
const spanPrixPliage = document.querySelector('.prix_pliage')
const spanFraisPliage = document.querySelector('.frais_pliage')
const selectEntreprise = document.querySelector('.selectEntreprise')
const selectClient = document.querySelector('.selectClient')
selectEntreprise.disabled = false
selectClient.disabled = true
//Action en fonction de copy ou modif
let action
let idDevis
//Appel de la base de données
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    idDevis = params.get('id')
    action = params.get('modif')

    // Charger toutes les données nécessaires
    const fetchImpressions = fetch('../api/impressions.php').then((res) => res.json())
    const fetchSession = fetch('../api/session_id.php').then((res) => res.json())

    Promise.all([fetchImpressions, fetchSession])
        .then(([impressionsData, sessionData]) => {
            // Traitement des impressions
            datasImpressions = impressionsData.impressions
            dictNbOnPaper = impressionsData.nbOnPaper
            datasDegressif = impressionsData.degressif
            datasPliage = impressionsData.pliage[0]
            fraisPliage = datasPliage.frais_fixe
            prixQtePliage = datasPliage.prix_pliage
            fraisFixe = impressionsData.frais[0].prix_frais

            datasDegressif.sort((a, b) => a.min - b.min)
            datasImpressions.sort((a, b) => a.nom_papier.localeCompare(b.nom_papier))
            dictNbOnPaper.sort((a, b) => {
                const aFormat = a.format_impression
                const bFormat = b.format_impression
                if (aFormat === '10-21 (DL)') return -1
                if (bFormat === '10-21 (DL)') return 1
                const aMatch = aFormat.match(/^A(\d)$/)
                const bMatch = bFormat.match(/^A(\d)$/)
                if (aMatch && bMatch) return parseInt(bMatch[1]) - parseInt(aMatch[1])
                return aFormat.localeCompare(bFormat)
            })

            spanFraisFixe.innerHTML = `${fraisFixe}€`
            spanFraisPliage.innerHTML = fraisPliage
            spanPrixPliage.innerHTML = prixQtePliage
            addSelectPaperType(datasImpressions)
            addSelectFormatType(dictNbOnPaper)

            // Traitement de session
            session = sessionData.user
            idData = sessionData.new_id
            devisLoaded.then(() => {
                // Traitement du devis si duplication ou modification
                if (idDevis) {
                    console.log('datas devis : ', datasDevisImpr)
                    remplirCalculDevis()
                }
            })
        })
        .catch((error) => {
            console.error('Erreur lors du chargement des données :', error)
        })
})

//Query Selector pour tous les inputs
const btnCalcul = document.querySelector('.button-calcul-impressions')
btnCalcul.addEventListener('click', () => {
    inputNom.disabled = true
    spanCoutTotal.innerHTML = ''
    if (!verifDesignations(getDatasDesignations())) return
    coutTotal = updateCalcul(
        datasImpressions,
        format.value,
        nbImpression.value,
        typePapier.value,
        selectRecto_value,
        checkPliage_value,
        getTotalPrixDesignation()
    )
    spanCoutTotal.innerHTML = coutTotal
})
const spanCoutTotal = document.querySelector('.total_cout_impressions')

const format = document.querySelector('.format')
format.addEventListener('change', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    selectEntreprise.disabled = true
    selectClient.disabled = true
})

const nbImpression = document.querySelector('.number')
nbImpression.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    selectEntreprise.disabled = true
    selectClient.disabled = true
})

const typePapier = document.querySelector('.select_type_papier')
typePapier.addEventListener('change', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    selectEntreprise.disabled = true
    selectClient.disabled = true
})

const selectRecto = document.querySelector('.select_recto_verso')
var selectRecto_value = selectRecto.value
selectRecto.addEventListener('change', () => {
    selectRecto_value = selectRecto.value
    btnValidation.disabled = true
    inputNom.disabled = true
    selectEntreprise.disabled = true
    selectClient.disabled = true
})

const checkPliage = document.querySelector('.check-pliage')
var checkPliage_value = checkPliage.value
checkPliage.addEventListener('change', (e) => {
    btnValidation.disabled = true
    inputNom.disabled = true
    if (e.target.checked === true) {
        checkPliage_value = true
    } else {
        checkPliage_value = false
    }
})

const btnValidation = document.querySelector('.btnValiderDevis')
btnValidation.disabled = true
btnValidation.addEventListener('click', () => {
    PopupValiderEnregistrement(
        datasImpressions,
        idData,
        nom_value,
        format.value,
        nbImpression.value,
        typePapier.value,
        selectRecto_value,
        checkPliage_value,
        spanCoutTotal.innerHTML,
        getIdClient()
    )
})

const inputNom = document.querySelector('.nom_devis')
var nom_value = inputNom.value
inputNom.disabled = true
inputNom.addEventListener('change', () => {
    nom_value = inputNom.value
})
// FIN QUERY SELECTOR

//Fonction qui regroupe tous les calculs
function updateCalcul(datasImpressions, format, nbImpression, typePapier, selectRecto, check_pliage, prix_designation) {
    console.log('--------------------------------------------------')
    //console.log(format)
    //console.log(nbImpression)
    //console.log(typePapier)
    console.log('recto : ', selectRecto)
    console.log('check pliage : ', check_pliage)
    var nbOnPlanche = 0
    var prixUnitaire = 0
    var nbPlanches = 0
    //Le nombre d'éléments sur un côté d'une page
    if (nbImpression && format !== 'null') {
        nbOnPlanche = calculOnPlanche(dictNbOnPaper, format)
    } else {
        return 'Veuillez renseigner des informations correctes'
    }
    //Le prix unitaire en fonction de la quantité renseignée
    if (nbImpression && typePapier != 'null') {
        console.log('Calcul Prix unitaire ')
        console.log('nbImpression: ', nbImpression, ' et typePapier : ', typePapier)
        nbPlanches = Math.ceil(nbImpression / nbOnPlanche)
        prixUnitaire = getPrixDegressif(datasDegressif, nbImpression)
    }

    //Prix pliage (comprenant le prix de lancement)
    const prixPliage = check_pliage === true ? nbImpression * prixQtePliage + fraisPliage : 0

    if (nbOnPlanche != 0 && prixUnitaire != 0) {
        btnValidation.disabled = false
        inputNom.disabled = false
        selectEntreprise.disabled = false
        selectClient.disabled = false
        return calculPrix(datasImpressions, nbPlanches, typePapier, prixUnitaire, selectRecto, prixPliage, prix_designation)
    } else {
        console.log('nb sur une planche : ', nbOnPlanche)
        console.log('prixUnitaire : ', prixUnitaire)
        console.warn('Tous les champs doivent être renseignés')
        return 'Veuillez renseigner tous les champs'
    }
}

function addSelectFormatType(dictNbOnPaper) {
    const select = document.querySelector('select.format')

    // Pour chaque élément du tableau, on crée une option
    dictNbOnPaper.forEach((item) => {
        const option = document.createElement('option')
        option.value = item.format_impression
        option.textContent = item.format_impression
        select.appendChild(option)
    })
}

//Ajoute dynamiquement les types de papier dans le select
function addSelectPaperType(datasImpressions) {
    //On récupère les types de papier
    const select_type = document.querySelector('.select_type_papier')
    datasImpressions.forEach((impression) => {
        //On les insère dans la balise select
        //Selecteur pour le type de papier
        const option = document.createElement('option')
        option.value = impression.Id_papier
        option.innerHTML = `${impression.nom_papier} (Prix - Recto  : ${impression.prix_recto}€ / Recto Verso : ${impression.prix_recto_verso}€)`
        select_type.appendChild(option)
    })
}

function calculOnPlanche(dictNbOnPaper, format) {
    let nbOnPlanche = 0
    const item = dictNbOnPaper.find((element) => element.format_impression === format)
    if (item) {
        nbOnPlanche = item.nb_par_page
    } else {
        console.warn('Format non trouvé dans la base : ', format)
    }

    console.log('nbOnPlanches pour le format ', format, ' : ', nbOnPlanche)
    return nbOnPlanche
}

//Calcul des résultats
function calculPrix(datasImpressions, nbPlanches, id, prixUnitaire, selectRecto, prixPliage, prix_designation) {
    const impression = datasImpressions.find((impr) => impr.Id_papier === parseInt(id))
    var prixRectoVerso = 0

    //Définition du prix selon le choix du recto / recto-verso
    prixRectoVerso = selectRecto === 'recto' ? impression.prix_recto : impression.prix_recto_verso

    //Calcul du cout total
    const coutTotal = (nbPlanches * prixUnitaire * prixRectoVerso + prix_designation + fraisFixe + prixPliage).toFixed(2)
    console.log(`${nbPlanches} * ${prixUnitaire} * ${prixRectoVerso} + ${prix_designation} + ${fraisFixe} + ${prixPliage}`)
    console.log('Nb Planches : ', nbPlanches)
    console.log('Prix unitaire planche selon dégressivité: ', prixUnitaire)
    console.log('Prix recto ou verso : ', prixRectoVerso)
    console.log('prix désignation : ', prix_designation)
    console.log('prix pliage : ', prixPliage)
    console.log('cout total : ', coutTotal)

    return `${coutTotal}€`
}

function getPrixDegressif(datasDegressif, quantite) {
    if (!Array.isArray(datasDegressif) || datasDegressif.length === 0) {
        console.warn('Données dégressives invalides ou vides.')
        return null
    }
    let trancheMax = null
    for (const tranche of datasDegressif) {
        const min = tranche.min
        const max = tranche.max
        // Si la quantité est dans la tranche
        if (quantite >= min && quantite <= max) {
            console.log('✅ Tranche exacte trouvée :', `${min}-${max}`)
            return tranche.prix
        }
        // On garde la tranche la plus haute pour fallback
        if (!trancheMax || max > trancheMax.max) {
            trancheMax = tranche
        }
    }
    // Si aucune tranche ne correspond, on renvoie la plus grande connue
    if (trancheMax) {
        console.log('➡️ Tranche dépassée, on retourne la plus haute :', `${trancheMax.min}-${trancheMax.max}`)
        return trancheMax.prix
    }
    console.warn('⚠️ Aucune tranche applicable trouvée pour quantité =', quantite)
    return null
}

function PopupValiderEnregistrement(
    datasImpressions,
    id,
    nom,
    format,
    nbImpression,
    typePapier,
    selectRecto,
    check_pliage,
    prix,
    idClient
) {
    if (session !== null) {
        console.log('action : ', action)
        const grammage = datasImpressions.find((impr) => impr.Id_papier === parseInt(typePapier))?.grammage
        const recto = selectRecto === 'recto' ? 'Recto' : 'Recto/Verso'
        const params = new URLSearchParams({
            nom: nom === '' ? id : nom,
            format: format,
            nbImpression: nbImpression,
            item: typePapier,
            recto: recto,
            pliage: check_pliage === true ? 'Oui' : 'Non',
            prix: prix,
            idClient: idClient,
            designations: JSON.stringify(getDatasDesignations()),
        })

        // ********************************************** Si on modifie un devis déjà existant
        if (action === 'modif') {
            // On ajoute l'id dans les paramètres
            //Envoie à la base de données, attend la réponse
            params.append('idD', idDevis)

            fetch('../app/app.php?action=modif_devis_impr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.status === 'success') {
                        //Code en cas de succès

                        const demandeVoirDevisModif = confirm('Votre devis a été modifié. Voulez-vous le visualiser ? ')
                        if (demandeVoirDevisModif) {
                            const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(idDevis)}`
                            window.open(url, '_blank')
                        } else {
                            const url = '../app/app.php?action=calcul_impression'
                            window.location.href = url
                        }
                    } else {
                        //Code en cas d'erreur
                        alert(data.message)
                    }
                })
                .catch((error) => {
                    alert("Une erreur s'est produite, veuillez reessayer.")
                })
        } else if (action === 'copy') {
            // ************************************************************** Si on duplique un devis déjà existant

            //Envoie à la base de données, attend la réponse
            fetch('../app/app.php?action=copy_devis_impr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === 'success') {
                        //Code en cas de succès
                        const newIdDevis = parseInt(data.idDevis)
                        const demandeVoirDevisModif = confirm('Votre devis a été copié. Voulez-vous le visualiser ? ')
                        if (demandeVoirDevisModif) {
                            const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(newIdDevis)}`
                            window.open(url, '_blank')
                        } else {
                            const url = '../app/app.php?action=calcul_impression'
                            window.location.href = url
                        }
                    } else {
                        //Code en cas d'erreur
                        alert(data.message)
                    }
                })
                .catch((error) => {
                    alert("Une erreur s'est produite, veuillez reessayer.")
                    console.log(error)
                })
        } else {
            // ***************************************************** Enregistrement normal
            const validation = confirm('Voulez-vous enregistrer ce devis ? ')
            if (validation) {
                if (parseInt(idClient) === -1) {
                    id = 'Simulation_' + id
                }

                //Envoie à la base de données, attend la réponse
                fetch(`../app/app.php?action=add_impr_data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Réponse du serveur :', data)
                        if (data.status === 'success') {
                            //Code en cas de succès
                            const idDevis = parseInt(data.idDevis)
                            console.log(data)
                            const demandeVoirDevis = confirm('Votre devis a été enregistré. Voulez-vous le visualiser ? ')
                            if (demandeVoirDevis) {
                                const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(idDevis)}`
                                window.open(url, '_blank')
                            } else {
                                const url = '../app/app.php?action=calcul_impression'
                                window.location.href = url
                            }
                        } else {
                            //Code en cas d'erreur
                            alert(data.message)
                        }
                    })
                    .catch((error) => {
                        //Code en cas d'erreur
                        alert("Une erreur s'est produite, veuillez reessayer.")
                        console.log(error)
                    })
            }
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

//Si l'utilisateur modifie son devis ou le duplique, on recharge les infos en fonction
function remplirCalculDevis() {
    format.value = datasDevisImpr.format ?? ''
    nbImpression.value = datasDevisImpr.quantite ?? ''
    typePapier.value = datasDevisImpr.Id_impr
    selectRecto.value = datasDevisImpr.type_impression === 'Recto' ? 'recto' : 'recto-verso'
    selectRecto_value = selectRecto.value
    selectRecto.selected = selectRecto_value
    if (datasDevisImpr.pliage === 'Oui') {
        checkPliage.checked = true
        checkPliage.value = true
        checkPliage_value = true
    } else {
        checkPliage.checked = false
        checkPliage.value = false
        checkPliage_value = false
    }
    if (action === 'modif') {
        btnCalcul.value = 'Refaire le calcul'
        inputNom.value = datasDevisImpr.enregistrement_nom
        btnValidation.innerHTML = 'Modifier le devis'
    }
    spanCoutTotal.innerHTML = `${datasDevisImpr.prix}€`
    inputNom.disabled = false
    btnValidation.disabled = false
}
