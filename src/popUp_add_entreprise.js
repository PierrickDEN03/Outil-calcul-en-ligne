// RegExp de validation
const codePostalRegex = /^\d{5}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telRegex = /^\d{10}$/
const siretRegex = /^\d{14}$/
let datasPaiement = []

//A l'initialisation de la fenetre, on rajoute tous les masques
window.addEventListener('DOMContentLoaded', () => {
    fetch('../api/paiement.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            const selectPaiement = document.getElementById('selectPaiement')
            datasPaiement = datasFetch.infos
            console.log(datasPaiement)
            datasPaiement.forEach((item) => {
                const option = document.createElement('option')
                option.value = item.Id_paiement
                option.innerHTML = item.label_paiement
                selectPaiement.appendChild(option)
            })
        })
        .catch((error) => console.error('Erreur lors du chargement des données : ', error))
    // Application du masque téléphone sur les champs concernés
    if (inputTelephoneEntreprise) applyPhoneMask(inputTelephoneEntreprise)
    if (inputTelephoneClient) applyPhoneMask(inputTelephoneClient)
    if (inputFixeClient) applyPhoneMask(inputFixeClient)
    if (inputSiretEntreprise) applySiretMask(inputSiretEntreprise)
    if (inputCodePostalEntreprise) applyPostalCodeMask(inputCodePostalEntreprise)
})

// Sélecteurs pour popup entreprise-client
const popupEntrepriseClient = document.querySelector('.popupEntreprise')
const btnFermerEntrepriseClient = document.querySelector('.popup-ajout-entreprise-client .fermer-popup')
const btnAjouterEntrepriseClient = document.querySelector('.ajouter-entreprise-client')

// Inputs Entreprise - Informations générales
const inputNomEntreprise = document.querySelector('#nomEntreprise')
const inputSiretEntreprise = document.querySelector('#siretEntreprise')
const inputMailEntreprise = document.querySelector('#mailEntreprise')
const inputTelephoneEntreprise = document.querySelector('#telephoneEntreprise')

// Inputs Entreprise - Adresse
const inputRueEntreprise = document.querySelector('#rueEntreprise')
const inputCodePostalEntreprise = document.querySelector('#codePostalEntreprise')
const inputVilleEntreprise = document.querySelector('#villeEntreprise')

// Inputs Client
const inputNomPrenomClient = document.querySelector('#nomPrenomClient')
const inputMailClient = document.querySelector('#mailClient')
const inputTelephoneClient = document.querySelector('#telephoneClient')
const inputFixeClient = document.querySelector('#fixeClient')

// Ferme la popup entreprise-client
btnFermerEntrepriseClient.addEventListener('click', () => {
    popupEntrepriseClient.classList.add('hidden')
    popupEntrepriseClient.style.display = 'none'
    clearPopupEntrepriseClientInputs()
})

// Nettoie la popup entreprise-client
function clearPopupEntrepriseClientInputs() {
    // Entreprise - Informations générales
    inputNomEntreprise.value = ''
    inputSiretEntreprise.value = ''
    inputMailEntreprise.value = ''
    inputTelephoneEntreprise.value = ''

    // Entreprise - Adresse
    inputRueEntreprise.value = ''
    inputCodePostalEntreprise.value = ''
    inputVilleEntreprise.value = ''

    // Client
    inputNomPrenomClient.value = ''
    inputMailClient.value = ''
    inputTelephoneClient.value = ''
    inputFixeClient.value = ''
}

// Ajout entreprise et client (via URL)
btnAjouterEntrepriseClient.addEventListener('click', () => {
    // Récupération des valeurs entreprise
    const nomEntrepriseVal = inputNomEntreprise.value.trim()
    var siretEntrepriseVal = inputSiretEntreprise.value.trim().replace(/\s/g, '')
    var mailEntrepriseVal = inputMailEntreprise.value.trim()
    var telephoneEntrepriseVal = inputTelephoneEntreprise.value.trim().replace(/\s/g, '')

    var rueEntrepriseVal = inputRueEntreprise.value.trim()
    var codePostalEntrepriseVal = inputCodePostalEntreprise.value.trim()
    var villeEntrepriseVal = inputVilleEntreprise.value.trim()

    // Récupération des valeurs client
    var nomPrenomClientVal = inputNomPrenomClient.value.trim()
    var mailClientVal = inputMailClient.value.trim()
    var telephoneClientVal = inputTelephoneClient.value.trim().replace(/\s/g, '')
    var fixeClientVal = inputFixeClient.value.trim().replace(/\s/g, '')

    // Validation des champs obligatoires entreprise
    if (!nomEntrepriseVal) {
        alert("Veuillez renseigner un nom d'entreprise.")
        return
    }

    // Validation du SIRET
    if (siretEntrepriseVal && !siretRegex.test(siretEntrepriseVal)) {
        alert('Le numéro de SIRET doit comporter exactement 14 chiffres.')
        return
    }

    // Validation des emails
    if (mailEntrepriseVal && !emailRegex.test(mailEntrepriseVal)) {
        alert("Veuillez saisir un e-mail valide pour l'entreprise.")
        return
    }

    if (mailClientVal && !emailRegex.test(mailClientVal)) {
        alert('Veuillez saisir un e-mail valide pour le client.')
        return
    }

    // Validation du code postal
    if (codePostalEntrepriseVal && !codePostalRegex.test(codePostalEntrepriseVal)) {
        alert('Le code postal doit comporter exactement 5 chiffres.')
        return
    }

    // Validation des numéros de téléphone
    if (telephoneEntrepriseVal && !telRegex.test(telephoneEntrepriseVal)) {
        alert("Le numéro de téléphone de l'entreprise doit comporter exactement 10 chiffres.")
        return
    }

    if (telephoneClientVal && !telRegex.test(telephoneClientVal)) {
        alert('Le numéro de téléphone du client doit comporter exactement 10 chiffres.')
        return
    }

    if (fixeClientVal && !telRegex.test(fixeClientVal)) {
        alert('Le numéro fixe du client doit comporter exactement 10 chiffres.')
        return
    }

    //On remplace les champs vides par des espaces
    siretEntrepriseVal = siretEntrepriseVal === '' ? '' : siretEntrepriseVal
    mailEntrepriseVal = mailEntrepriseVal === '' ? '' : mailEntrepriseVal
    telephoneEntrepriseVal = telephoneEntrepriseVal === '' ? '' : telephoneEntrepriseVal
    rueEntrepriseVal = rueEntrepriseVal === '' ? '' : rueEntrepriseVal
    codePostalEntrepriseVal = codePostalEntrepriseVal === '' ? '' : codePostalEntrepriseVal
    villeEntrepriseVal = villeEntrepriseVal === '' ? '' : villeEntrepriseVal

    nomPrenomClientVal = nomPrenomClientVal === '' ? '' : nomPrenomClientVal
    mailClientVal = mailClientVal === '' ? '' : mailClientVal
    telephoneClientVal = telephoneClientVal === '' ? '' : telephoneClientVal
    fixeClientVal = fixeClientVal === '' ? '' : fixeClientVal

    // Construction de l'URL avec tous les paramètres
    const url =
        `../app/app.php?action=ajouter_entreprise_client` +
        `&nomEntreprise=${encodeURIComponent(nomEntrepriseVal)}` +
        `&siretEntreprise=${encodeURIComponent(siretEntrepriseVal)}` +
        `&mailEntreprise=${encodeURIComponent(mailEntrepriseVal)}` +
        `&telephoneEntreprise=${encodeURIComponent(telephoneEntrepriseVal)}` +
        `&mpaiement=${encodeURIComponent(document.getElementById('selectPaiement').value)}` +
        `&rueEntreprise=${encodeURIComponent(rueEntrepriseVal)}` +
        `&codePostalEntreprise=${encodeURIComponent(codePostalEntrepriseVal)}` +
        `&villeEntreprise=${encodeURIComponent(villeEntrepriseVal)}` +
        `&nomPrenomClient=${encodeURIComponent(nomPrenomClientVal)}` +
        `&mailClient=${encodeURIComponent(mailClientVal)}` +
        `&telephoneClient=${encodeURIComponent(telephoneClientVal)}` +
        `&fixeClient=${encodeURIComponent(fixeClientVal)}`

    console.log('URL ajout entreprise-client:', url)
    window.location.href = url
})

// Fonction pour appliquer un masque de téléphone (XX XX XX XX XX)
function applyPhoneMask(input) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '') // Supprime tout ce qui n'est pas un chiffre

        // Limite à 10 chiffres
        if (value.length > 10) {
            value = value.substring(0, 10)
        }

        // Applique le format XX XX XX XX XX
        let formattedValue = ''
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 2 === 0) {
                formattedValue += ' '
            }
            formattedValue += value[i]
        }

        e.target.value = formattedValue
    })
}

// Fonction pour appliquer un masque de SIRET (XXX XXX XXX XXXXX)
function applySiretMask(input) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '') // Supprime tout ce qui n'est pas un chiffre

        // Limite à 14 chiffres
        if (value.length > 14) {
            value = value.substring(0, 14)
        }

        // Applique le format XXX XXX XXX XXXXX
        let formattedValue = ''
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6 || i === 9) {
                formattedValue += ' '
            }
            formattedValue += value[i]
        }

        e.target.value = formattedValue
    })
}

// Fonction pour appliquer un masque de code postal (XXXXX)
function applyPostalCodeMask(input) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '') // Supprime tout ce qui n'est pas un chiffre

        // Limite à 5 chiffres
        if (value.length > 5) {
            value = value.substring(0, 5)
        }

        e.target.value = value
    })
}
