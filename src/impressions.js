import { getIdClient } from './gestion_entreprise.js'

//Définition des variables
let datasImpressions = []
let dictNbOnPaper = []
let datasDegressif = []
const formatStandard = [45, 32]
const formatUtile = [43, 30] //Laisse des marges
var coutTotal = 0
let idData
let session
const selectEntreprise = document.querySelector('.selectEntreprise')
const selectClient = document.querySelector('.selectClient')
selectEntreprise.disabled = false
selectClient.disabled = true

//Appel de la base de données
window.addEventListener('DOMContentLoaded', () => {
    fetch('../api/impressions.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            //console.log(datasFetch)
            datasImpressions = datasFetch.impressions
            dictNbOnPaper = datasFetch.nbOnPaper
            datasDegressif = datasFetch.degressif
            datasDegressif.sort((a, b) => a.min - b.min)
            //console.log('degressif : ', datasDegressif)
            //Trie alphabétique par nom_papier
            datasImpressions.sort((a, b) => {
                return a.nom_papier.localeCompare(b.nom_papier)
            })
            dictNbOnPaper.sort((a, b) => {
                const aFormat = a.format_impression
                const bFormat = b.format_impression

                // 1. "10-21 (DL)" doit être tout en haut
                if (aFormat === '10-21 (DL)') return -1
                if (bFormat === '10-21 (DL)') return 1

                // 2. Extraire les formats type "A5", "A4", etc.
                const aMatch = aFormat.match(/^A(\d)$/)
                const bMatch = bFormat.match(/^A(\d)$/)

                // Si les deux sont des formats "A", on les trie en ordre décroissant
                if (aMatch && bMatch) {
                    const aNum = parseInt(aMatch[1])
                    const bNum = parseInt(bMatch[1])
                    return bNum - aNum // ordre décroissant
                }

                // 3. Sinon, trie alphabétique par défaut
                return aFormat.localeCompare(bFormat)
            })
            //console.log('Impressions : ', datasImpressions)
            //Appels de fonction
            addSelectPaperType(datasImpressions)
            addSelectFormatType(dictNbOnPaper)
        })
        .catch((error) => console.error('Erreur lors du chargement des données : ', error))

    //Récupération d'un ID généré
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
const btnCalcul = document.querySelector('.button-calcul-impressions')
btnCalcul.addEventListener('click', () => {
    inputNom.value = ''
    coutTotal = updateCalcul(datasImpressions, format_value, nbImpression_value, typePapier_value, selectRecto_value)
    spanCoutTotal.innerHTML = coutTotal
})
const spanCoutTotal = document.querySelector('.total_cout_impressions')

const format = document.querySelector('.format')
var format_value = format.value
format.addEventListener('change', () => {
    format_value = format.value
    btnValidation.disabled = true
    inputNom.disabled = true
    selectEntreprise.disabled = true
    selectClient.disabled = true
})

const nbImpression = document.querySelector('.number')
var nbImpression_value = nbImpression.value
nbImpression.addEventListener('input', () => {
    nbImpression_value = nbImpression.value
    btnValidation.disabled = true
    inputNom.disabled = true
    selectEntreprise.disabled = true
    selectClient.disabled = true
})

const typePapier = document.querySelector('.select_type_papier')
var typePapier_value = typePapier.value
typePapier.addEventListener('change', () => {
    typePapier_value = typePapier.value
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

const btnValidation = document.querySelector('.btnValiderDevis')
btnValidation.disabled = true
btnValidation.addEventListener('click', () => {
    PopupValiderEnregistrement(
        datasImpressions,
        idData,
        nom_value,
        format_value,
        nbImpression_value,
        typePapier_value,
        selectRecto_value,
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
function updateCalcul(datasImpressions, format, nbImpression, typePapier, selectRecto) {
    console.log('--------------------------------------------------')
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
    if (nbOnPlanche != 0 && prixUnitaire != 0) {
        btnValidation.disabled = false
        inputNom.disabled = false
        selectEntreprise.disabled = false
        selectClient.disabled = false
        return calculPrix(datasImpressions, nbPlanches, typePapier, prixUnitaire, selectRecto)
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
        option.innerHTML =
            impression.nom_papier +
            ' ' +
            impression.grammage +
            'g ( Prix recto : ' +
            impression.prix_recto +
            '€ / Prix recto-verso : ' +
            impression.prix_recto_verso +
            '€ )'
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
function calculPrix(datasImpressions, nbPlanches, id, prixUnitaire, selectRecto) {
    const impression = datasImpressions.find((impr) => impr.Id_papier === parseInt(id))
    var prixRectoVerso = 0

    //Définition du prix selon le choix du recto / recto-verso
    prixRectoVerso = selectRecto === 'recto' ? impression.prix_recto : impression.prix_recto_verso

    //Calcul du cout total
    const coutTotal = (nbPlanches * prixUnitaire * prixRectoVerso).toFixed(2)
    console.log(`${nbPlanches} * ${prixUnitaire} * ${prixRectoVerso}`)
    console.log('Nb Planches : ', nbPlanches)
    console.log('Prix unitaire planche selon dégressivité: ', prixUnitaire)
    console.log('Prix recto ou verso : ', prixRectoVerso)
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

function PopupValiderEnregistrement(datasImpressions, id, nom, format, nbImpression, typePapier, selectRecto, prix, idClient) {
    if (session !== null) {
        const nomPapier = datasImpressions.find((impr) => impr.Id_papier === parseInt(typePapier))?.nom_papier
        const grammage = datasImpressions.find((impr) => impr.Id_papier === parseInt(typePapier))?.grammage
        const item = `${nomPapier} ${grammage}g`
        const recto = selectRecto === 'recto' ? 'Recto' : 'Recto/Verso'
        console.log(nbImpression)
        console.log(recto)
        console.log(format)
        console.log(item)
        console.log(idClient)
        const confirmation = confirm('Voulez-vous enregistrer ce devis ? ')
        if (confirmation) {
            if (parseInt(idClient) === -1) {
                id = id.replace('ID', 'Simulation_')
            }
            const params = new URLSearchParams({
                nom: nom === '' ? id : nom,
                format: format,
                nbImpression: nbImpression,
                item: item,
                recto: recto,
                prix: prix,
                idClient: idClient,
            })

            const url = `../app/app.php?action=add_impr_data&${params.toString()}`
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
