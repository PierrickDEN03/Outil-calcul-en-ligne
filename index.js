import { feuilles } from './datas/impressions.js'
import { production } from './datas/productions.js'
import { nbOnPaperDict } from './datas/nbOnPaper.js'
import Inputmask from 'inputmask'

console.log(feuilles) // Affiche la liste des papiers

/*Définition des variables*/
const formatStandard = [45, 32]
const formatUtile = [43, 30] /*Laisse des marges*/
var coutTotal = 0

/*Query Selector pour tous les inputs*/
const input = document.querySelector('.custom_format')
Inputmask('99 x 99').mask(input)

const spanCoutTotal = document.querySelector('.total_cout')

const format = document.querySelector('.format')
var format_value = format.value
format.addEventListener('change', () => {
    format_value = format.value
    coutTotal = updateCalcul(feuilles, format_value, nbImpression_value, typePapier_value, selectRecto_value)
    spanCoutTotal.innerHTML = coutTotal
})

const nbImpression = document.querySelector('.number')
var nbImpression_value = nbImpression.value
nbImpression.addEventListener('input', () => {
    nbImpression_value = nbImpression.value
    coutTotal = updateCalcul(feuilles, format_value, nbImpression_value, typePapier_value, selectRecto_value)
    spanCoutTotal.innerHTML = coutTotal
})

const typePapier = document.querySelector('.select_type_papier')
var typePapier_value = typePapier.value
typePapier.addEventListener('change', () => {
    typePapier_value = typePapier.value
    coutTotal = updateCalcul(feuilles, format_value, nbImpression_value, typePapier_value, selectRecto_value)
    spanCoutTotal.innerHTML = coutTotal
})

const selectRecto = document.querySelector('.select_recto_verso')
var selectRecto_value = selectRecto.value
selectRecto.addEventListener('change', () => {
    selectRecto_value = selectRecto.value
    coutTotal = updateCalcul(feuilles, format_value, nbImpression_value, typePapier_value, selectRecto_value)
    spanCoutTotal.innerHTML = coutTotal
})
/* FIN QUERY SELECTOR */

//Fonction qui regroupe tous les calculs
function updateCalcul(feuilles, format, nbImpression, typePapier, selectRecto) {
    console.log('--------------------------------------------------')
    var nbOnPaper = 0
    var prixUnitaire = 0
    //Le nombre d'éléments sur un côté d'une page
    if (nbImpression) {
        nbOnPaper = calculOnPaper(format)
    }
    //Le prix unitaire en fonction de la quantité renseignée
    if (nbImpression && typePapier != 'null') {
        console.log('Calcul Prix unitaire ')
        console.log('nbImpression: ', nbImpression, ' et typePapier : ', typePapier)
        prixUnitaire = getPrixUnitaireFeuille(feuilles, nbImpression, typePapier)
    }
    if (nbOnPaper != 0 && prixUnitaire != 0) {
        /*console.log(
            'ça calclule le prix final avec nb sur un papier : ',
            nbOnPaper,
            ' et prixUnitaire : ',
            prixUnitaire
        )*/
        return calculPrix(feuilles, nbOnPaper, nbImpression, typePapier, prixUnitaire, selectRecto)
    } else {
        console.log('nb sur un papier : ', nbOnPaper)
        console.log('prixUnitaire : ', prixUnitaire)
        console.warn('Tous les champs doivent être renseignés')
    }
}

//Ajoute dynamiquement les types de papier dans le select
function addSelectPaperType(feuilles) {
    /*On récupère les types de papier*/
    const tab_type_feuille = []
    feuilles.forEach((feuille) => {
        if (!tab_type_feuille.includes(feuille.papier)) {
            tab_type_feuille.push(feuille.papier)
        }
    })
    console.log('Tab type feuille : ', tab_type_feuille)

    /*On les insère dans la balise select*/
    /*Selecteur pour le type de papier */
    const select_type = document.querySelector('.select_type_papier')
    tab_type_feuille.forEach((feuille) => {
        const option = document.createElement('option')
        option.value = feuille
        option.innerHTML = feuille
        select_type.appendChild(option)
    })
}

/*Calcul d'exemplaires sur la feuille*/
function calculOnPaper(format) {
    var nbOnPaper = 0
    if (format == 'A6' || format == 'A5' || format == 'A4') {
        nbOnPaper = nbOnPaperDict[format]
    } else {
        //Faire le calcul pour des dimensions personnalisées
    }
    console.log('nbOnPaper pour le format ', format, ' : ', nbOnPaper)
    return nbOnPaper
}

/*Calcul des résultats*/
function calculPrix(feuilles, nbOnPaper, nbImpression, typePapier, prixUnitaire, selectRecto) {
    var nbPlanches = Math.ceil(nbImpression / nbOnPaper)
    const feuille = feuilles.find((f) => f.papier === typePapier)
    var prixRectoVerso = 0

    //Définition du prix selon le choix du recto / recto-verso
    if (selectRecto == 'recto') {
        console.log('prix verso pour la feuille de type ', feuille.papier, ' : ', feuille.prix_recto)
        prixRectoVerso = feuille.prix_recto
    } else {
        if (selectRecto == 'recto-verso') {
            console.log('prix verso pour la feuille de type ', feuille.papier, ' : ', feuille.prix_verso)
            prixRectoVerso = feuille.prix_recto
            nbPlanches = Math.ceil(nbPlanches / 2)
        }
    }
    console.log(`${nbPlanches} * ${prixUnitaire} * ${prixRectoVerso} = ${(nbPlanches * prixUnitaire * prixRectoVerso).toFixed(2)}`)
    return (nbPlanches * prixUnitaire * prixRectoVerso).toFixed(2)
}

/*Calcul du prix en fonction du type de feuille*/
function getPrixUnitaireFeuille(feuilles, quantite, type) {
    //Cherche dans les données le type de feuille
    const feuille = feuilles.find((f) => f.papier === type)
    if (!feuille) {
        console.warn('Type de papier non trouvé :', type)
        return null
    }
    const tranches = feuille.prix_unitaire
    let meilleurTranche = null
    let meilleurMin = -1
    for (const tranche in tranches) {
        const [min, max] = tranche.split('-').map(Number)
        if (quantite >= min && quantite <= max) {
            console.log('Tranche exacte trouvée :', tranche)
            return tranches[tranche]
        }
        if (quantite > max && min > meilleurMin) {
            meilleurMin = min
            meilleurTranche = tranche
        }
    }
    if (meilleurTranche) {
        console.log('Tranche dépassée sélectionnée :', meilleurTranche)
        return tranches[meilleurTranche]
    }
    console.warn('Aucune tranche correspondante trouvée')
    return null
}

/*Appels de fonction */
addSelectPaperType(feuilles)
