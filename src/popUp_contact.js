import { refreshApi, createAlertError, createAlertInfos, fetchAdresses, fetchContacts } from './voir_details_entreprise.js'

// Variables
let maxPriorite
let datasClients = []
let id
let datasAdresses = []
const PopUpContact = document.querySelector('.popupClient')

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    id = params.get('id')

    if (!id) {
        console.error('Aucun identifiant fourni')
        return
    }

    // Récupération des éléments des tables clients et entreprises
    fetch(`../api/details_entreprise.php?id=${id}`)
        .then((response) => response.json())
        .then((datasFetch) => {
            datasClients = datasFetch.clients
            datasAdresses = [...datasFetch.adressePrincipale, ...datasFetch.adressesSecondaires]
            if (datasClients.length > 0) {
                maxPriorite = Math.max(...datasClients.map((c) => parseInt(c.priorite + 1)))
            } else {
                maxPriorite = 0 // Valeur par défaut si le tableau est vide
            }
            const selectAdresse = document.getElementById('adresse')
            datasAdresses.forEach((item) => {
                const option = document.createElement('option')
                option.innerHTML = `${item.rue}, ${item.code_postal} ${item.ville}`
                option.value = item.Id_adresse
                selectAdresse.appendChild(option)
            })
            inputPriorite.max = maxPriorite
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

// RegExp de validation
const emailRegex = /.+@.+/
const telRegex = /^\d{10}$/

// Appliquer le masque tel/fixe
function applyPhoneMask(input) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '') // Supprime tout sauf chiffres

        if (value.length > 10) value = value.slice(0, 10)

        let formatted = ''
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 2 === 0) formatted += ' '
            formatted += value[i]
        }

        e.target.value = formatted
    })
}

// Sélecteurs
const popup = document.querySelector('.popupClient')
const btnFermer = document.querySelector('.fermer-popup')
const btnAjouter = document.querySelector('.ajouter-client')

const inputNomPrenom = document.querySelector('#nomPrenomClient')
const inputMail = document.querySelector('#mailClient')
const inputFixe = document.querySelector('#fixeClient')
const inputTel = document.querySelector('#telClient')
const inputPriorite = document.querySelector('#priorite')

// Appliquer le masque
applyPhoneMask(inputTel)
applyPhoneMask(inputFixe)

// Ferme la popup
btnFermer.addEventListener('click', () => {
    popup.classList.add('hidden')
    popup.style.display = 'none'
    clearPopupInputs()
})

// Nettoie la popup
function clearPopupInputs() {
    inputNomPrenom.value = ''
    inputMail.value = ''
    inputFixe.value = ''
    inputTel.value = ''
    inputPriorite.value = ''
}

// Ajout client secondaire (via URL)
btnAjouter.addEventListener('click', async () => {
    const nomVal = inputNomPrenom.value.trim()
    const mailVal = inputMail.value.trim()
    const telVal = inputTel.value.trim().replace(/\s/g, '')
    const fixeVal = inputFixe.value.trim().replace(/\s/g, '')
    let prioriteVal = inputPriorite.value.trim()

    // Si le champ est vide => on attribue "0"
    if (prioriteVal === '') {
        prioriteVal = '0'
    } else {
        // Si ce n'est pas un nombre valide
        if (isNaN(prioriteVal)) {
            alert('La priorité doit être un nombre')
            return
        }

        const intPriorite = parseInt(prioriteVal)
        if (intPriorite < 1 || intPriorite > maxPriorite) {
            alert(`Veuillez saisir une priorité entre 1 et ${maxPriorite}`)
            return
        }

        prioriteVal = intPriorite.toString() // Nettoie bien
    }

    const urlParams = new URLSearchParams(window.location.search)
    const idEntreprise = urlParams.get('id')

    // Vérif champs
    if (!nomVal || !mailVal) {
        alert('Veuillez renseigner un nom et une adresse mail.')
        return
    }

    if (!emailRegex.test(mailVal)) {
        alert('Veuillez entrer une adresse e-mail valide.')
        return
    }

    if (telVal && !telRegex.test(telVal)) {
        alert('Le numéro de téléphone portable doit comporter exactement 10 chiffres.')
        return
    }

    if (fixeVal && !telRegex.test(fixeVal)) {
        alert('Le numéro de téléphone fixe doit comporter exactement 10 chiffres.')
        return
    }

    const params = new URLSearchParams({
        nom: nomVal,
        mail: mailVal,
        tel: telVal,
        fixe: fixeVal,
        adresseC: document.getElementById('adresse').value,
        priorite: prioriteVal,
        id: idEntreprise,
    })

    try {
        const response = await fetch('../app/app.php?action=ajouter_clientS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const data = await response.json()
        console.log(data)

        if (data.status === 'success') {
            createAlertInfos('Contact ajouté avec succès ! ')
            await refreshApi()
            fetchAdresses()
            fetchContacts()
            PopUpContact.style.display = 'none'
            clearPopupInputs()
        } else {
            createAlertError(data.message)
        }
    } catch (error) {
        console.log(error)
        createAlertError(error)
        PopUpContact.style.display = 'none'
        clearPopupInputs()
    }
})
