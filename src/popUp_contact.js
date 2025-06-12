// Variables
let maxPriorite
let datasClients = []
let id

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

            if (datasClients.length > 0) {
                maxPriorite = Math.max(...datasClients.map((c) => parseInt(c.priorite)))
            } else {
                maxPriorite = 0 // Valeur par défaut si le tableau est vide
            }

            console.log('popUP priorite : ', maxPriorite)
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
btnAjouter.addEventListener('click', () => {
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
    if (!nomVal || !mailVal || !telVal || !fixeVal) {
        alert('Veuillez remplir tous les champs (nom, e-mail, téléphone, fixe).')
        return
    }

    if (!emailRegex.test(mailVal)) {
        alert('Veuillez entrer une adresse e-mail valide.')
        return
    }

    if (!telRegex.test(telVal)) {
        alert('Le numéro de téléphone portable doit comporter exactement 10 chiffres.')
        return
    }

    if (!telRegex.test(fixeVal)) {
        alert('Le numéro de téléphone fixe doit comporter exactement 10 chiffres.')
        return
    }

    const url = `../app/app.php?action=ajouter_clientS&nom=${encodeURIComponent(nomVal)}&mail=${encodeURIComponent(
        mailVal
    )}&tel=${encodeURIComponent(telVal)}&fixe=${encodeURIComponent(fixeVal)}&priorite=${encodeURIComponent(
        prioriteVal
    )}&id=${encodeURIComponent(idEntreprise)}`

    console.log(url)
    window.location.href = url
})
