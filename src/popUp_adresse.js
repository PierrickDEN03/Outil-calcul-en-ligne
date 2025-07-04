import { refreshApi, createAlertError, createAlertInfos, fetchAdresses, fetchContacts } from './voir_details_entreprise.js'
//Variables pour adresses
const PopUpAdresse = document.querySelector('.popupAdresse')
let maxPrioriteAdresse
let datasAdresses = []
let idEntreprise

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    idEntreprise = params.get('id')
    datasAdresses
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
                maxPrioriteAdresse = Math.max(...datasAdresses.map((a) => parseInt(a.priorite_adresse + 1)))
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
inputPrioriteAdresse.addEventListener('keydown', function (e) {
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control']
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault()
    }
})

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
btnAjouterAdresse.addEventListener('click', async () => {
    const rueVal = inputRueAdresse.value.trim()
    const codePostalVal = inputCodePostalAdresse.value.trim()
    const villeVal = inputVilleAdresse.value.trim()
    let prioriteVal = inputPrioriteAdresse.value.trim()

    if (prioriteVal === '') {
        prioriteVal = '0'
    } else {
        if (isNaN(prioriteVal)) {
            alert('La priorité doit être un nombre')
            return
        }

        const intPriorite = parseInt(prioriteVal)
        if (intPriorite < 1 || intPriorite > maxPrioriteAdresse) {
            alert(`Veuillez saisir une priorité entre 1 et ${maxPrioriteAdresse}`)
            return
        }

        prioriteVal = intPriorite.toString()
    }

    const urlParams = new URLSearchParams(window.location.search)
    const idEntrepriseParam = urlParams.get('id')

    if (!rueVal || !codePostalVal || !villeVal) {
        alert('Veuillez remplir tous les champs (rue, code postal, ville).')
        return
    }

    if (!codePostalRegex.test(codePostalVal)) {
        alert('Le code postal doit comporter exactement 5 chiffres.')
        return
    }

    const params = new URLSearchParams({
        rue: rueVal,
        codePostal: codePostalVal,
        ville: villeVal,
        priorite: prioriteVal,
        id: idEntrepriseParam,
    })

    try {
        const response = await fetch('../app/app.php?action=ajouter_adresseS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const data = await response.json()
        console.log(data)

        if (data.status === 'success') {
            createAlertInfos('Adresse ajoutée avec succès !')
            await refreshApi()
            fetchAdresses()
            fetchContacts()
            PopUpAdresse.style.display = 'none'
            clearPopupAdresseInputs()
        } else {
            createAlertError(data.message)
        }
    } catch (error) {
        console.log(error)
        createAlertError(error)
        PopUpAdresse.style.display = 'none'
        clearPopupAdresseInputs()
    }
})
