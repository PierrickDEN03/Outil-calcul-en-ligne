let datasClients = []
let datasEntreprises = []
let datasAdressesPrincipales = []
let datasAdressesSecondaires = []
let datasDevis = []
let datasPaiements = []
let datasAdresses = []
let id
export let dontAsk = false
let manualClickContact = false
let manualClickAdresse = false
let manualClickInfosGenerales = false
let programmedClickInfosGenerales = false

export function createAlertInfos(message) {
    // Vérifie si l'utilisateur ne veut plus voir l'alerte
    if (dontAsk) return

    Swal.fire({
        title: 'Informations',
        text: message,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Ne plus afficher',
    }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            dontAsk = true
            console.log('Ne plus demander')
        }
    })
}

export function createAlertError(message) {
    // Vérifie si l'utilisateur ne veut plus voir l'alerte
    if (dontAsk) return
    Swal.fire({
        title: 'Erreur',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
        cancelButtonText: 'Ne plus afficher',
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('OK cliqué')
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            dontAsk = true
            console.log('Ne plus demander')
        }
    })
}

//RegExp simple pour mail (*@*) et téléphone
const emailRegex = /.+@.+/
const telRegex = /^\d{10}$/
const siretRegex = /^\d{14}$/
const cpRegex = /^\d{5}$/

//Selecteurs
//Tableau devis et recherche
let tabDatas = document.querySelector('.table_enregistrements')
const inputRecherche = document.querySelector('.searchInput')
const btnRecherche = document.querySelector('.searchBtn')
const btnSupprRecherche = document.querySelector('.delSearch')
const selectTrie = document.querySelector('.select_trie')
//Au changement de condition de trie, on appelle la fonction
selectTrie.addEventListener('change', () => {
    const critere = selectTrie.value
    const datasTrie = trieDatas(critere, datasDevis)
    createPagination(datasTrie, tabDatas, divPagination)
    addTabDatas(datasTrie, datasClients, tabDatas)
})

const nomEntreprise = document.getElementById('nomE')
const mailInput = document.getElementById('email')
const telInput = document.getElementById('telephone')
const siretInput = document.getElementById('siret')
const rueInput = document.getElementById('rue')
const cpInput = document.getElementById('cp')
const villeInput = document.getElementById('ville')
const nomClientPInput = document.getElementById('nom_clientP')
const mailClientPInput = document.getElementById('mail_clientP')
const telClientPInput = document.getElementById('tel_clientP')
const fixeClientPInput = document.getElementById('fixe_clientP')
const selectAdresseClientP = document.getElementById('selectAdresseClientP')
const divAdressesSecondaires = document.querySelector('.adresses_secondaires')
const divContacts = document.querySelector('.contacts_secondaires')

const hName = document.querySelector('.nameFiche')
// Bouton de modification pour route les infos générales (contact et adresse principale compris)
const btnModifInfos = document.querySelector('.modifInfosG')
//Listener pour le bouton principal
btnModifInfos.addEventListener('mousedown', () => {
    manualClickInfosGenerales = true
    programmedClickInfosGenerales = false
})
btnModifInfos.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        manualClickInfosGenerales = true
        programmedClickInfosGenerales = false
    }
})
btnModifInfos.addEventListener('click', async () => {
    console.log('click')
    manualClickInfosGenerales = true
    // ******************* Infos Première section
    const nomVal = nomEntreprise?.value.trim()
    const mailVal = mailInput?.value.trim()
    const telVal = telInput?.value.replace(/\s/g, '')
    const siretVal = siretInput?.value.replace(/\s/g, '')
    const paiement = document.getElementById('paiementE')

    if (nomVal && nomVal !== '') {
        if ((telVal && !telRegex.test(telVal)) || (siretVal && !siretRegex.test(siretVal)) || (mailVal && !emailRegex.test(mailVal))) {
            if (telVal !== '' && !telRegex.test(telVal)) {
                alert('Le numéro de téléphone doit contenir exactement 10 chiffres.')
                return
            }
            if (siretVal !== '' && !siretRegex.test(siretVal)) {
                alert('Le numéro de SIRET doit contenir exactement 14 chiffres.')
                return
            }
            if (mailVal !== '' && !emailRegex.test(mailVal)) {
                alert('Veuillez entrer une adresse e-mail valide.')
                return
            }
            return
        }
    } else {
        alert('Veuillez renseigner tous les champs concernant les informations générales.')
        console.log(nomVal, mailVal, telVal, siretVal, paiement?.value)
        return
    }

    // *********** Infos Adresse principale
    const rueVal = rueInput?.value.trim()
    const cpVal = cpInput?.value.trim()
    const villeVal = villeInput?.value.trim()
    const idAdresseVal = datasAdressesPrincipales.Id_adresse

    if (cpVal) {
        if (cpVal !== '' && !cpRegex.test(cpVal)) {
            alert('Le code postal doit comporter exactement 5 chiffres.')
            return
        }
    }

    // *********** Infos Contact principal
    const nomClientVal = nomClientPInput?.value.trim()
    const mailClientVal = mailClientPInput?.value.trim()
    const telClientVal = telClientPInput?.value.trim().replace(/\s/g, '')
    const fixeClientVal = fixeClientPInput?.value.trim().replace(/\s/g, '')
    const idClientAdresse = selectAdresseClientP?.value
    const idClientVal = datasClients[0].Id_client

    if (nomClientVal && nomClientVal !== '') {
        if (
            (mailClientVal !== '' && !emailRegex.test(mailClientVal)) ||
            (telClientVal !== '' && !telRegex.test(telClientVal)) ||
            (fixeClientVal !== '' && !telRegex.test(fixeClientVal))
        ) {
            if (!emailRegex.test(mailVal)) {
                alert('Client : Veuillez entrer une adresse e-mail valide.')
                return
            }
            if (!telRegex.test(telVal)) {
                alert('Le numéro de téléphone portable doit comporter exactement 10 chiffres.')
                return
            }
            if (!telRegex.test(fixeClientVal)) {
                alert('Le numéro de téléphone fixe doit comporter exactement 10 chiffres.')
                return
            }
            return
        }
    } else {
        alert('Veuillez renseigner le nom-prénom du contact principal.')
        return
    }

    const params = new URLSearchParams({
        id: id,
        nomEntreprise: nomVal,
        mailEntreprise: mailVal,
        telEntreprise: telVal,
        siret: siretVal,
        paiement: paiement.value,
        rue: rueVal,
        cp: cpVal,
        ville: villeVal,
        idAdresse: idAdresseVal,
        nomClient: nomClientVal,
        mailClient: mailClientVal,
        telClient: telClientVal,
        fixeClient: fixeClientVal,
        idClientAdresse: idClientAdresse,
        idClient: idClientVal,
    })

    for (const [key, value] of params.entries()) {
        console.log(`${key} = ${value}`)
    }

    try {
        const response = await fetch('../app/app.php?action=modif_infos_generales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const data = await response.json()
        console.log(data)

        if (data.status === 'success') {
            if (manualClickInfosGenerales && programmedClickInfosGenerales === false) {
                createAlertInfos('Informations générales modifiées avec succès !')
            }
            await refreshApi()
            addOptionAdresseClientP()
        } else {
            createAlertError(data.message)
        }
    } catch (error) {
        createAlertError(error)
    }
})

//Boutons ajout et popUp
const btnAddContact = document.querySelector('.add_contact')
const btnAddAdresse = document.querySelector('.add_adresse')
const PopUpContact = document.querySelector('.popupClient')
const PopUpAdresse = document.querySelector('.popupAdresse')
btnAddContact.addEventListener('click', () => {
    PopUpContact.style.display = 'flex'
    refreshApi()
})
btnAddAdresse.addEventListener('click', () => {
    PopUpAdresse.style.display = 'flex'
    refreshApi()
})

//Div Pagination
const divPagination = document.querySelector('.pagination')

//Boutons pour cacher
const btnCacheAdresse = document.querySelector('.cache_adresse')
const btnCacheContact = document.querySelector('.cache_contact')

btnCacheAdresse.addEventListener('click', () => {
    const isHidden = divAdressesSecondaires.classList.toggle('hidden') // toggle la classe "hidden"

    // Met à jour le texte ou la classe du bouton si besoin
    btnCacheAdresse.classList.toggle('active')
    btnCacheAdresse.textContent = isHidden ? 'Cacher les adresses' : 'Afficher les adresses'
    isHidden ? (divAdressesSecondaires.style.display = 'flex') : (divAdressesSecondaires.style.display = 'none')
})

btnCacheContact.addEventListener('click', () => {
    const isHidden = divContacts.classList.toggle('hidden') // toggle la classe "hidden"

    // Met à jour le texte ou la classe du bouton si besoin
    btnCacheContact.classList.toggle('active')
    btnCacheContact.textContent = isHidden ? 'Cacher les contacts' : 'Afficher les contacts'
    isHidden ? (divContacts.style.display = 'flex') : (divContacts.style.display = 'none')
})
// Application des masques dès le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    //Boutons qui cachent les sections secondaires
    // Affiche les adresses secondaires par défaut
    divAdressesSecondaires.classList.remove('hidden')
    divAdressesSecondaires.style.display = 'flex'
    btnCacheAdresse.classList.add('active')
    btnCacheAdresse.textContent = 'Cacher les adresses'
    // Affiche les contacts secondaires par défaut
    divContacts.classList.remove('hidden')
    divContacts.style.display = 'flex' // ou 'block' selon ton layout
    btnCacheContact.classList.add('active')
    btnCacheContact.textContent = 'Cacher les contacts'

    // Application des masques AVANT de récupérer les données pour les infos de l'entreprise, le client principal
    if (telInput) {
        applyPhoneMask(telInput)
    }
    if (siretInput) {
        applySiretMask(siretInput)
    }

    if (cpInput) {
        applyPostalCodeMask(cpInput)
    }
    if (telClientPInput) {
        applyPhoneMask(telClientPInput)
    }
    if (fixeClientPInput) {
        applyPhoneMask(fixeClientPInput)
    }
})
export async function refreshApi() {
    try {
        console.clear()
        const response = await fetch(`../api/details_entreprise.php?id=${id}`)
        const datasFetch = await response.json()

        datasClients = datasFetch.clients
        datasEntreprises = datasFetch.entreprise[0]
        datasAdressesPrincipales = datasFetch.adressePrincipale[0]
        datasAdressesSecondaires = datasFetch.adressesSecondaires
        datasDevis = datasFetch.devis
        datasAdresses = [...datasFetch.adressePrincipale, ...datasFetch.adressesSecondaires]
        datasPaiements = datasFetch.paiements
        console.log('clients : ', datasClients)
        console.log('entreprise : ', datasEntreprises)
        console.log('adresse p : ', datasAdressesPrincipales)
        console.log('adresse sec : ', datasAdressesSecondaires)
        console.log('devis : ', datasDevis)
    } catch (error) {
        console.error('Erreur lors du chargement des données :', error)
    }
}

export async function fetchAdresses() {
    // Pour l'adresse si elle existe
    if (datasAdressesPrincipales) {
        rueInput.value = datasAdressesPrincipales.rue || ''
        villeInput.value = datasAdressesPrincipales.ville || ''

        // Pour le code postal : assigner la valeur puis déclencher l'événement input pour formater
        cpInput.value = datasAdressesPrincipales.code_postal || ''
        cpInput.dispatchEvent(new Event('input'))
    }
    generateAdressesSecondairesUI(datasAdressesSecondaires)
}

function addOptionAdresseClientP() {
    selectAdresseClientP.innerHTML = ''
    datasAdresses.forEach((item) => {
        let label = ''
        const rue = item.rue && item.rue.trim() !== '' ? item.rue.trim() : ''
        const codePostal = item.code_postal && item.code_postal.trim() !== '' ? item.code_postal.trim() : ''
        const ville = item.ville && item.ville.trim() !== '' ? item.ville.trim() : ''
        let suffixe = ''
        if (codePostal || ville) {
            suffixe = `${codePostal} ${ville}`.trim()
        }
        if (rue && suffixe) {
            label = `${rue}, ${suffixe}`
        } else if (rue) {
            label = rue
        } else if (suffixe) {
            label = suffixe
        } else {
            label = '(Adresse vide)'
        }
        const option = document.createElement('option')
        option.textContent = label
        option.value = item.Id_adresse
        selectAdresseClientP.appendChild(option)
    })
    selectAdresseClientP.value = datasClients.find((client) => parseInt(client.priorite) === 1)?.adresse_Id
}

function fetchInfosGenerales() {
    //Attribution du contenu aux sélecteurs concernant les infos générales
    hName.innerHTML += datasEntreprises.nom_entreprise
    nomEntreprise.value = datasEntreprises.nom_entreprise
    mailInput.value = datasEntreprises.mail
    // Pour le téléphone : assigner la valeur puis déclencher l'événement input pour formater
    telInput.value = datasEntreprises.telephone
    telInput.dispatchEvent(new Event('input'))

    // Pour le SIRET : assigner la valeur puis déclencher l'événement input pour formater
    siretInput.value = datasEntreprises.siret
    siretInput.dispatchEvent(new Event('input'))
    //Rajout dynamique dans select des modalités de paiement
    const selectPaiement = document.getElementById('paiementE')
    datasPaiements.forEach((item) => {
        const option = document.createElement('option')
        option.value = item.Id_paiement
        option.innerHTML = item.label_paiement
        selectPaiement.appendChild(option)
    })
    selectPaiement.value = datasEntreprises.Id_paiement
}

export async function fetchContacts() {
    //Récupération du client principal
    const clientPrincipal = datasClients.find((client) => {
        return client.priorite === 1
    })
    //Attribution du contenu aux sélecteurs concernant le contact principal
    nomClientPInput.value = clientPrincipal.nom_prenom
    mailClientPInput.value = clientPrincipal.mail
    telClientPInput.value = clientPrincipal.telephone
    fixeClientPInput.value = clientPrincipal.fixe
    // Pour le Tel du client : assigner la valeur puis déclencher l'événement input pour formater
    telClientPInput.dispatchEvent(new Event('input'))
    //Adresse pour le client principal
    addOptionAdresseClientP()

    // Pour le Fixe du client : assigner la valeur puis déclencher l'événement input pour formater
    fixeClientPInput.dispatchEvent(new Event('input'))
    generateAdressesSecondairesUI(datasAdressesSecondaires)
    generateContactsUI(datasClients)
}

async function fetchDevis() {
    addTabDatas(datasDevis, datasClients, tabDatas)
}
async function fetchDonnees() {
    console.log('fetch toute données')
    await refreshApi()
    fetchInfosGenerales()
    await fetchAdresses()
    fetchContacts()
    fetchDevis()
}

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    id = params.get('id')

    if (!id) {
        console.error('Aucun identifiant fourni')
        return
    }
    fetchDonnees()
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

/* ====================================================== SECTION ADRESSES =====================================================*/
let adresseActive = null // Suivi de l'adresse actif

async function generateAdressesSecondairesUI(datasAdressesSecondaires) {
    manualClickAdresse = false
    divAdressesSecondaires.innerHTML = '' // Réinitialiser le contenu

    const maxPriorite = Math.max(...datasAdressesSecondaires.map((a) => parseInt(a.priorite_adresse)))

    datasAdressesSecondaires.forEach((adresse, index) => {
        const adresseDiv = document.createElement('div')
        adresseDiv.className = 'adresse-secondaire'
        adresseDiv.style.border = '1px solid #ccc'
        adresseDiv.style.padding = '10px'
        adresseDiv.style.marginBottom = '10px'

        // Titre du bloc
        const titre = document.createElement('h4')
        titre.textContent = `Adresse n°${adresse.priorite_adresse}`
        adresseDiv.appendChild(titre)

        // Fonctions utilitaires
        const createLabeledInput = (labelText, inputElement) => {
            const container = document.createElement('div')
            container.style.marginBottom = '8px'

            const label = document.createElement('label')
            label.textContent = labelText
            label.style.display = 'block'
            label.style.fontWeight = 'bold'

            container.appendChild(label)
            container.appendChild(inputElement)

            return container
        }

        // Rue
        const rueInput = document.createElement('input')
        rueInput.type = 'text'
        rueInput.value = adresse.rue
        rueInput.placeholder = 'Rue'
        rueInput.className = 'input-rue'

        // Code Postal
        const cpInput = document.createElement('input')
        cpInput.type = 'text'
        cpInput.value = adresse.code_postal
        cpInput.placeholder = 'Code Postal'
        cpInput.className = 'input-cp'
        applyPostalCodeMask(cpInput)

        // Ville
        const villeInput = document.createElement('input')
        villeInput.type = 'text'
        villeInput.value = adresse.ville
        villeInput.placeholder = 'Ville'
        villeInput.className = 'input-ville'

        // Priorité
        const prioriteInput = document.createElement('input')
        prioriteInput.type = 'number'
        prioriteInput.min = 1
        prioriteInput.max = maxPriorite
        prioriteInput.value = adresse.priorite_adresse
        prioriteInput.placeholder = 'Priorité'
        prioriteInput.className = 'input-priorite'
        prioriteInput.addEventListener('keydown', function (e) {
            const allowedKeys = ['ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control']
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault()
            }
        })

        // Bouton Modifier
        const btnModifier = document.createElement('button')
        btnModifier.textContent = 'Modifier'
        btnModifier.className = 'btn-modifier-adresse'

        //Au mouseDown (click avec souris) et toucher Entrer, ça affiche la popup
        btnModifier.addEventListener('mousedown', () => {
            manualClickAdresse = true
        })
        btnModifier.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                manualClickAdresse = true
            }
        })

        btnModifier.addEventListener('click', async (e) => {
            const rue = rueInput.value.trim()
            const cp = cpInput.value.trim()
            const ville = villeInput.value.trim()
            const priorite = prioriteInput.value.trim()

            if (!rue || !cp || !ville || !priorite) {
                alert('Tous les champs doivent être remplis.')
                return
            }

            if (!cpRegex.test(cp)) {
                alert('Le code postal doit contenir exactement 5 chiffres.')
                return
            }

            if (parseInt(priorite) > maxPriorite || parseInt(priorite) < 1) {
                alert(`Veuillez renseigner un ordre valide entre 1 et ${maxPriorite}`)
                return
            }

            const params = new URLSearchParams({
                idA: adresse.Id_adresse,
                rue: rue,
                cp: cp,
                ville: ville,
                priorite: priorite,
                id: id,
            })

            try {
                const response = await fetch('../app/app.php?action=modif_adresseS', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const data = await response.json()
                console.log(data)

                if (data.status === 'success') {
                    // Code en cas de succès
                    if (manualClickAdresse && e.isTrusted === true) {
                        createAlertInfos('Informations des adresses secondaires modifiées avec succès !')
                    }
                    await refreshApi()
                    programmedClickInfosGenerales = true
                    await fetchAdresses()
                    fetchContacts()
                } else {
                    // Code en cas d'erreur
                    if (manualClickAdresse && e.isTrusted === true) {
                        createAlertError(data.message)
                    }
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        // Bouton Supprimer
        const btnSupprimer = document.createElement('button')
        btnSupprimer.textContent = 'Supprimer'
        btnSupprimer.className = 'btn-supprimer-adresse'
        btnSupprimer.style.marginLeft = '10px'
        btnSupprimer.addEventListener('click', async () => {
            const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette adresse secondaire ?')
            if (!confirmDelete) return

            const params = new URLSearchParams({
                idA: adresse.Id_adresse,
                id: id,
            })

            try {
                const response = await fetch('../app/app.php?action=suppr_adresseS', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const data = await response.json()
                console.log(data)

                if (data.status === 'success') {
                    createAlertInfos('Nouvelle adresse créée avec succès !')
                    await refreshApi()
                    await fetchAdresses()
                    fetchContacts()
                } else {
                    createAlertError(data.message)
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        // Append inputs avec labels
        adresseDiv.appendChild(createLabeledInput('Rue :', rueInput))
        adresseDiv.appendChild(createLabeledInput('Code postal :', cpInput))
        adresseDiv.appendChild(createLabeledInput('Ville :', villeInput))
        adresseDiv.appendChild(createLabeledInput('Priorité :', prioriteInput))
        adresseDiv.appendChild(btnModifier)
        adresseDiv.appendChild(btnSupprimer)

        divAdressesSecondaires.appendChild(adresseDiv)
        // Lorsqu'on interagit avec la div, elle devient le contact actif
        adresseDiv.addEventListener('focusin', () => {
            adresseActive = { div: adresseDiv, btn: btnModifier }
        })
    })

    /*// Écouteur global (ajouté une seule fois)
    if (!document.outsideClickHandlerAdded) {
        document.addEventListener('click', function (e) {
            if (adresseActive && !adresseActive.div.contains(e.target)) {
                console.log('Clic en dehors du contact actif')
                manualClickAdresse = false
                adresseActive.btn.click()
                adresseActive = null
            }
        })
        document.outsideClickHandlerAdded = true // Flag pour éviter les doublons
    }*/
}

/* ====================================================== SECTION CONTACTS =================================================== */
let contactActif = null // Suivi du contact actif

async function generateContactsUI(datasClients) {
    manualClickContact = false
    divContacts.innerHTML = '' // Réinitialiser le contenu

    const maxPriorite = Math.max(...datasClients.map((c) => parseInt(c.priorite)))
    const datasClientsSecondaires = datasClients.filter((client) => client.priorite !== 1)

    datasClientsSecondaires.forEach((contact) => {
        const contactDiv = document.createElement('div')
        contactDiv.className = 'contact'
        contactDiv.style.border = '1px solid #ccc'
        contactDiv.style.padding = '10px'
        contactDiv.style.marginBottom = '10px'

        const titre = document.createElement('h4')
        titre.textContent = `Contact n°${contact.priorite}`
        contactDiv.appendChild(titre)

        // Fonction utilitaire pour créer un champ avec label
        const createLabeledInput = (labelText, inputElement) => {
            const container = document.createElement('div')
            container.style.marginBottom = '8px'

            const label = document.createElement('label')
            label.textContent = labelText
            label.style.display = 'block'
            label.style.fontWeight = 'bold'

            container.appendChild(label)
            container.appendChild(inputElement)
            return container
        }

        // Création des champs
        const nomInput = document.createElement('input')
        nomInput.type = 'text'
        nomInput.value = contact.nom_prenom
        nomInput.placeholder = 'Nom Prénom'
        nomInput.className = 'input-nom'

        const mailInput = document.createElement('input')
        mailInput.type = 'email'
        mailInput.value = contact.mail
        mailInput.placeholder = 'Adresse e-mail'
        mailInput.className = 'input-mail'

        const fixeInput = document.createElement('input')
        fixeInput.type = 'tel'
        fixeInput.value = contact.fixe
        fixeInput.placeholder = 'Téléphone fixe'
        fixeInput.className = 'input-fixe'
        applyPhoneMask(fixeInput)
        fixeInput.dispatchEvent(new Event('input'))

        const telInput = document.createElement('input')
        telInput.type = 'tel'
        telInput.value = contact.telephone
        telInput.placeholder = 'Téléphone mobile'
        telInput.className = 'input-telephone'
        applyPhoneMask(telInput)
        telInput.dispatchEvent(new Event('input'))

        const selectAdresse = document.createElement('select')
        selectAdresse.innerHTML = ''
        datasAdresses.forEach((item) => {
            const option = document.createElement('option')
            option.innerHTML = `${item.rue}, ${item.code_postal} ${item.ville}`
            option.value = item.Id_adresse
            selectAdresse.appendChild(option)
        })
        selectAdresse.value = contact.adresse_Id

        const prioriteInput = document.createElement('input')
        prioriteInput.type = 'number'
        prioriteInput.min = 1
        prioriteInput.max = maxPriorite
        prioriteInput.value = contact.priorite
        prioriteInput.className = 'input-priorite'
        //Empeche la saisie par clavier
        prioriteInput.addEventListener('keydown', function (e) {
            const allowedKeys = ['ArrowUp', 'ArrowDown', 'Tab', 'Shift', 'Control']
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault()
            }
        })

        // Bouton Modifier
        const btnModifier = document.createElement('button')
        btnModifier.textContent = 'Modifier'
        btnModifier.className = 'btn-modifier-contact'
        //Affiche la popup si appui sur Entrée ou au click souris
        btnModifier.addEventListener('mousedown', () => {
            manualClickContact = true
        })
        btnModifier.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                manualClickContact = true
            }
        })

        btnModifier.addEventListener('click', async (e) => {
            const nom = nomInput.value.trim()
            const mail = mailInput.value.trim()
            const fixe = fixeInput.value.trim().replace(/\s/g, '')
            const telephone = telInput.value.trim().replace(/\s/g, '')
            const priorite = prioriteInput.value.trim()

            if (telephone !== '' && !telRegex.test(telephone)) {
                alert('Le numéro de téléphone portable doit comporter exactement 10 chiffres.')
                return
            }
            if (fixe !== '' && !telRegex.test(fixe)) {
                alert('Le numéro de téléphone fixe doit comporter exactement 10 chiffres.')
                return
            }
            if (!emailRegex.test(mail)) {
                alert('Veuillez saisir un mail valide.')
                return
            }
            if (!nom && !priorite) {
                alert('Tous les champs doivent être remplis.')
                return
            }

            const params = new URLSearchParams({
                idC: contact.Id_client,
                nom: nom,
                mail: mail,
                fixe: fixe,
                tel: telephone,
                adresseC: selectAdresse.value,
                priorite: priorite,
                id: id,
            })

            try {
                const response = await fetch('../app/app.php?action=modif_clientS', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const data = await response.json()
                console.log(data)

                if (data.status === 'success') {
                    // Code en cas de succès
                    if (manualClickContact && e.isTrusted === true) {
                        createAlertInfos('Informations des clients secondaires modifiées.')
                    }
                    await refreshApi()
                    programmedClickInfosGenerales = true
                    await fetchAdresses()
                    fetchContacts()
                } else {
                    // Code en cas d'erreur
                    if (manualClickContact && e.isTrusted === true) {
                        createAlertError(data.message)
                    }
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        // Bouton Supprimer
        const btnSupprimer = document.createElement('button')
        btnSupprimer.textContent = 'Supprimer'
        btnSupprimer.className = 'btn-supprimer-contact'
        btnSupprimer.style.marginLeft = '10px'
        btnSupprimer.addEventListener('click', async () => {
            const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')
            if (!confirmDelete) return

            const params = new URLSearchParams({
                idC: contact.Id_client,
                id: id,
            })

            for (const [key, value] of params.entries()) {
                console.log(`${key} = ${value}`)
            }

            try {
                const response = await fetch('../app/app.php?action=suppr_clientS', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const data = await response.json()
                console.log(data)

                if (data.status === 'success') {
                    createAlertInfos('Contact supprimé avec succès.')
                    await refreshApi()
                    programmedClickInfosGenerales = true
                    await fetchAdresses()
                    fetchContacts()
                } else {
                    createAlertError(data.message)
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        // Ajout des champs dans la div
        contactDiv.appendChild(createLabeledInput('Nom et prénom :', nomInput))
        contactDiv.appendChild(createLabeledInput('E-mail :', mailInput))
        contactDiv.appendChild(createLabeledInput('Fixe :', fixeInput))
        contactDiv.appendChild(createLabeledInput('Téléphone :', telInput))
        contactDiv.appendChild(createLabeledInput('Adresse :', selectAdresse))
        contactDiv.appendChild(createLabeledInput('Priorité :', prioriteInput))
        contactDiv.appendChild(btnModifier)
        contactDiv.appendChild(btnSupprimer)
        divContacts.appendChild(contactDiv)

        // Lorsqu'on interagit avec la div, elle devient le contact actif
        contactDiv.addEventListener('focusin', () => {
            contactActif = { div: contactDiv, btn: btnModifier }
        })
    })

    /*
    // Écouteur global (ajouté une seule fois)
    if (!document.outsideClickHandlerAdded) {
        document.addEventListener('click', function (e) {
            if (contactActif && !contactActif.div.contains(e.target)) {
                console.log('Clic en dehors du contact actif')
                manualClickContact = false
                contactActif.btn.click()
                contactActif = null
            }
        })
        document.outsideClickHandlerAdded = true // Flag pour éviter les doublons
    }*/
}

/* ======================================= FONCTION TABLEAU DE DEVIS ============================================*/
// Fonction utilitaire pour créer une cellule en lecture seule
function createReadOnlyCell(value) {
    const td = document.createElement('td')
    td.textContent = value
    return td
}

// Fonction utilitaire pour remplacer 0 ou "" par "_" sauf si type = "Matière" et champ = "espace_pose"
function formatValue(val, type, champ) {
    if (type === 'Matière' && champ === 'espace_pose') {
        // On retourne la vraie valeur, même si c’est 0
        return val
    }
    return val === 0 || val === '' ? '_' : val
}

// Fonction modifiée pour générer les lignes dynamiquement
function addTabDatas(datas, datasClients, tabDatas, start = 0, limit = 20) {
    tabDatas.innerHTML = ''
    const paginatedData = datas.slice(start, start + 20)
    console.log(paginatedData)
    paginatedData.forEach((data) => {
        const tr = document.createElement('tr')

        // Cellule invisible pour Id_enregistrement
        const tdHiddenId = document.createElement('td')
        tdHiddenId.style.display = 'none'
        tdHiddenId.textContent = data.Id_enregistrement

        // Colonne modifiable : nom_enregistrement
        const tdNom = document.createElement('td')
        const inputNom = document.createElement('input')
        inputNom.type = 'text'
        inputNom.value = data.nom_enregistrement
        inputNom.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdNom.appendChild(inputNom)

        const idClientEntreprise = datasClients.find((client) => {
            return parseInt(client.Id_client) === parseInt(data.Id_client)
        })?.entreprise_Id

        const nomContact = datasClients.find((client) => {
            return parseInt(client.Id_client) === parseInt(data.Id_client)
        })?.nom_prenom

        const nomMatiere = data.type_enregistrement === 'Feuille' ? data.nom_papier : data.nom_matiere

        // Colonnes en lecture seule avec formatage
        const tdDate = createReadOnlyCell(formatValue(data.date, data.type_enregistrement, 'date'))
        const tdType = createReadOnlyCell(formatValue(data.type_enregistrement, data.type_enregistrement, 'type_enregistrement'))
        const tdQuantite = createReadOnlyCell(formatValue(data.quantite, data.type_enregistrement, 'quantite'))
        const tdPrix = createReadOnlyCell(formatValue(data.prix, data.type_enregistrement, 'prix'))
        const tdLongueur = createReadOnlyCell(formatValue(data.longueur, data.type_enregistrement, 'longueur'))
        const tdLargeur = createReadOnlyCell(formatValue(data.largeur, data.type_enregistrement, 'largeur'))
        const tdMatiere = createReadOnlyCell(formatValue(nomMatiere, data.type_enregistrement, 'matiere'))
        const tdFormat = createReadOnlyCell(formatValue(data.format, data.type_enregistrement, 'format'))
        const tdImpression = createReadOnlyCell(formatValue(data.type_impression, data.type_enregistrement, 'type_impression'))
        const tdContact = createReadOnlyCell(nomContact === undefined ? '_' : nomContact)

        // Actions : Modifier + Supprimer
        const tdActions = document.createElement('td')

        const btnModif = document.createElement('button')
        btnModif.textContent = 'Modification rapide'
        btnModif.style.display = 'none'
        btnModif.classList.add('btn-modif')
        btnModif.addEventListener('click', async () => {
            const newNom = inputNom.value.trim()
            if (newNom === '') {
                alert('Le nom du devis ne peut pas être vide.')
                return
            }

            // Vérification si newNom est déjà utilisé par un autre enregistrement (différent Id_enregistrement)
            const nomExiste = datas.some(
                (d) => d.nom_enregistrement.toLowerCase() === newNom.toLowerCase() && d.Id_enregistrement !== data.Id_enregistrement
            )

            if (nomExiste) {
                alert('Ce nom est déjà utilisé. Veuillez en choisir un autre.')
                return
            }

            const params = new URLSearchParams({
                id: id,
                idDevis: data.Id_enregistrement,
                nom: newNom,
            })

            for (const [key, value] of params.entries()) {
                console.log(`${key} = ${value}`)
            }

            try {
                const response = await fetch('../app/app.php?action=modif_nom_devis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const result = await response.json()
                console.log(result)

                if (result.status === 'success') {
                    createAlertInfos('Devis modifié avec succès !')
                    await refreshApi()
                    fetchDevis()
                } else {
                    createAlertError(result.message)
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', async () => {
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')
            if (!confirmation) return

            const params = new URLSearchParams({
                id: id,
                idDevis: data.Id_enregistrement,
            })

            for (const [key, value] of params.entries()) {
                console.log(`${key} = ${value}`)
            }

            try {
                const response = await fetch('../app/app.php?action=suppr_data_devis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const data = await response.json()
                console.log(data)

                if (data.status === 'success') {
                    createAlertInfos('Devis supprimé avec succès !')
                    await refreshApi()
                    fetchDevis()
                } else {
                    createAlertError(data.message)
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        //Bouton PDF
        const btnPDF = document.createElement('button')
        const img = document.createElement('img')
        img.src = '../img/eye.png'
        img.style.width = '20px'
        img.style.height = '20px'
        btnPDF.appendChild(img)
        btnPDF.addEventListener('click', () => {
            const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(data.Id_enregistrement)}`
            window.open(url, '_blank')
        })

        //Bouton Modifier
        const btnModifDevis = document.createElement('button')
        const imgModifDevis = document.createElement('img')
        imgModifDevis.src = '../img/edit.png'
        imgModifDevis.style.width = '20px'
        imgModifDevis.style.height = '20px'
        btnModifDevis.appendChild(imgModifDevis)
        btnModifDevis.addEventListener('click', () => {
            //En fonction du type de devis, on renvoie sur une page de calcul différent
            const direction = data.type_enregistrement === 'Feuille' ? 'calcul_impression' : 'calcul_matiere'
            const url = `../app/app.php?action=${direction}&modif=modif&id=${encodeURIComponent(data.Id_enregistrement)}`
            window.open(url, '_blank')
        })

        //Bouton Copier
        const btnMPasteDevis = document.createElement('button')
        const imgPasteDevis = document.createElement('img')
        imgPasteDevis.src = '../img/copy.png'
        imgPasteDevis.style.width = '20px'
        imgPasteDevis.style.height = '20px'
        btnMPasteDevis.appendChild(imgPasteDevis)
        btnMPasteDevis.addEventListener('click', async () => {
            const params = new URLSearchParams({
                id: data.Id_enregistrement,
                idE: id,
            })

            for (const [key, value] of params.entries()) {
                console.log(`${key} = ${value}`)
            }

            try {
                const response = await fetch('../app/app.php?action=copy_devis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                })

                const result = await response.json()
                console.log(result)

                if (result.status === 'success') {
                    createAlertInfos('Devis copié avec succès !')
                    await refreshApi()
                    fetchDevis()
                } else {
                    createAlertError(result.message)
                }
            } catch (error) {
                createAlertError(error)
            }
        })

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnModifDevis)
        tdActions.appendChild(btnMPasteDevis)
        tdActions.appendChild(btnPDF)
        tdActions.appendChild(btnSuppr)

        // Ajout des cellules à la ligne
        tr.appendChild(tdHiddenId)
        tr.appendChild(tdNom)
        tr.appendChild(tdType)
        tr.appendChild(tdContact)
        tr.appendChild(tdDate)
        tr.appendChild(tdFormat)
        tr.appendChild(tdImpression)
        tr.appendChild(tdMatiere)
        tr.appendChild(tdQuantite)
        tr.appendChild(tdPrix)
        tr.appendChild(tdLongueur)
        tr.appendChild(tdLargeur)

        tr.appendChild(tdActions)

        tabDatas.appendChild(tr)
    })
}

function trieDatas(trie, datas) {
    let datasTries = [...datas] // on fait une copie du tableau original
    console.log('datasTries : ', datasTries)
    switch (trie) {
        case 'type':
            datasTries.sort((a, b) => a.type_enregistrement.localeCompare(b.type_enregistrement))
            break
        case 'nom':
            console.log('nom')
            datasTries.sort((a, b) => a.nom_enregistrement.localeCompare(b.nom_enregistrement))
        case 'date':
            datasTries.sort((a, b) => new Date(a.date) - new Date(b.date))
            break
        case 'prix':
            datasTries.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix))
            break
        case 'quantite':
            datasTries.sort((a, b) => parseInt(a.quantite) - parseInt(b.quantite))
            break
        default:
            // Si aucun tri n'est sélectionné ou "--------"
            return datas
    }

    return datasTries
}

btnRecherche.addEventListener('click', () => recherche(inputRecherche.value.toLowerCase()))
btnSupprRecherche.addEventListener('click', () => {
    inputRecherche.value = ''
    createPagination(datasDevis, tabDatas, divPagination)
    addTabDatas(datasDevis, datasClients, tabDatas)
})

function recherche(texte) {
    if (texte === '') {
        alert('Veuillez saisir un ou plusieurs termes de recherche')
        return
    }

    console.log('recherche avec le terme :', texte)
    const mots = texte.toLowerCase().split(' ')

    const datasFiltre = datasDevis.filter((item) => {
        // Récupérer le client lié à l'enregistrement
        const client = datasClients.find((c) => c.Id_client === item.Id_client)

        // Construire une chaîne de recherche complète
        const champ = `
            ${item.nom_enregistrement}
            ${item.date}
            ${item.format}
            ${item.largeur.toString()}
            ${item.longueur.toString()}
            ${item.matiere}
            ${item.prix.toString()}
            ${item.quantite.toString()}
            ${item.type_enregistrement}
            ${item.type_impression}
            ${item.type_papier}
            ${client ? client.nom_prenom : ''}
        `.toLowerCase()

        return mots.some((mot) => champ.includes(mot))
    })

    if (datasFiltre.length === 0) {
        alert(`Aucun résultat trouvé avec la recherche "${texte}"`)
    } else {
        createPagination(datasFiltre, tabDatas, divPagination)
        addTabDatas(datasFiltre, datasClients, tabDatas)
        alert(`${datasFiltre.length} résultat(s) trouvé(s) avec la recherche "${texte}"`)
    }
}

function createPagination(datas, tabDatas, divPagination, limit = 20) {
    divPagination.innerHTML = ''
    const totalPages = Math.ceil(datas.length / limit)
    console.log('taille données devis : ', datas.length)
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button')
        btn.textContent = `Page ${i + 1}`
        btn.classList.add('pagination-btn')
        btn.addEventListener('click', () => {
            addTabDatas(datas, datasClients, tabDatas, i * limit, limit)
        })
        divPagination.appendChild(btn)
    }
}
