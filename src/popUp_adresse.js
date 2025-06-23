//Variables pour adresses
let maxPrioriteAdresse
let datasAdresses = []
let idEntreprise

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    idEntreprise = params.get('id')

    if (!idEntreprise) {
        console.error('Aucun identifiant fourni')
        return
    }

    // Récupération des éléments des tables adresses et entreprises
    fetch(`../api/details_entreprise.php?id=${idEntreprise}`)
        .then((response) => response.json())
        .then((datasFetch) => {
            datasAdresses = datasFetch.adressesSecondaires

            if (datasAdresses.length > 0) {
                maxPrioriteAdresse = Math.max(...datasAdresses.map((a) => parseInt(a.priorite_adresse)))
            } else {
                maxPrioriteAdresse = 0 // Valeur par défaut si le tableau est vide
            }

            inputPrioriteAdresse.max = maxPrioriteAdresse
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

// RegExp de validation pour code postal (5 chiffres)
const codePostalRegex = /^\d{5}$/

// Sélecteurs pour popup adresse
const popupAdresse = document.querySelector('.popupAdresse')
const btnFermerAdresse = document.querySelector('.popup-ajout-adresse .fermer-popup')
const btnAjouterAdresse = document.querySelector('.ajouter-adresse')

const inputRueAdresse = document.querySelector('#rueAdresse')
const inputCodePostalAdresse = document.querySelector('#codePostalAdresse')
const inputVilleAdresse = document.querySelector('#villeAdresse')
const inputPrioriteAdresse = document.querySelector('#prioriteAdresse')

// Ferme la popup adresse
btnFermerAdresse.addEventListener('click', () => {
    popupAdresse.classList.add('hidden')
    popupAdresse.style.display = 'none'
    clearPopupAdresseInputs()
})

// Nettoie la popup adresse
function clearPopupAdresseInputs() {
    inputRueAdresse.value = ''
    inputCodePostalAdresse.value = ''
    inputVilleAdresse.value = ''
    inputPrioriteAdresse.value = ''
}

// Ajout adresse secondaire (via URL)
btnAjouterAdresse.addEventListener('click', () => {
    const rueVal = inputRueAdresse.value.trim()
    const codePostalVal = inputCodePostalAdresse.value.trim()
    const villeVal = inputVilleAdresse.value.trim()
    let prioriteVal = inputPrioriteAdresse.value.trim()

    // Si le champ priorité est vide => on attribue "0"
    if (prioriteVal === '') {
        prioriteVal = '0'
    } else {
        // Si ce n'est pas un nombre valide
        if (isNaN(prioriteVal)) {
            alert('La priorité doit être un nombre')
            return
        }

        const intPriorite = parseInt(prioriteVal)
        if (intPriorite < 1 || intPriorite > maxPrioriteAdresse) {
            alert(`Veuillez saisir une priorité entre 1 et ${maxPrioriteAdresse}`)
            return
        }

        prioriteVal = intPriorite.toString() // Nettoie bien
    }

    const urlParams = new URLSearchParams(window.location.search)
    const idEntrepriseParam = urlParams.get('id')

    // Vérification des champs obligatoires
    if (!rueVal || !codePostalVal || !villeVal) {
        alert('Veuillez remplir tous les champs (rue, code postal, ville).')
        return
    }

    // Validation du code postal
    if (!codePostalRegex.test(codePostalVal)) {
        alert('Le code postal doit comporter exactement 5 chiffres.')
        return
    }

    // Construction de l'URL
    const url = `../app/app.php?action=ajouter_adresseS&rue=${encodeURIComponent(rueVal)}&codePostal=${encodeURIComponent(
        codePostalVal
    )}&ville=${encodeURIComponent(villeVal)}&priorite=${encodeURIComponent(prioriteVal)}&id=${encodeURIComponent(idEntrepriseParam)}`

    console.log(url)
    window.location.href = url
})
