let datasClients = []
let datasEntreprises = []
let datasAdressesPrincipales = []
let datasAdressesSecondaires = []
let id

//RegExp simple pour mail (*@*) et téléphone
const emailRegex = /.+@.+/
const telRegex = /^\d{10}$/
const siretRegex = /^\d{14}$/
const cpRegex = /^\d{5}$/

//Selecteurs
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
const divAdressesSecondaires = document.querySelector('.adresses_secondaires')
const divContacts = document.querySelector('.contacts_secondaires')

const hName = document.querySelector('.nameFiche')
// Boutons de modification
const btnModifierMail = document.querySelector('.modifier-mail')
const btnModifierTelephone = document.querySelector('.modifier-telephone')
const btnModifierSiret = document.querySelector('.modifier-siret')
const btnModifierAdresse = document.querySelector('.modifAdresseP')
const btnModifierClientP = document.querySelector('.modifClientP')

//Boutons ajout et popUp
const btnAddContact = document.querySelector('.add_contact')
const btnAddAdresse = document.querySelector('.add_adresse')
const PopUpContact = document.querySelector('.popupClient')
const PopUpAdresse = document.querySelector('.popupAdresse')
btnAddContact.addEventListener('click', () => {
    PopUpContact.style.display = 'flex'
})
btnAddAdresse.addEventListener('click', () => {
    PopUpAdresse.style.display = 'flex'
})

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

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    id = params.get('id')

    if (!id) {
        console.error('Aucun identifiant fourni')
        return
    }
    //Récupération des éléments des tables clients et entreprises
    fetch(`../api/details_entreprise.php?id=${id}`)
        .then((response) => response.json())
        .then((datasFetch) => {
            datasClients = datasFetch.clients
            datasEntreprises = datasFetch.entreprise
            datasAdressesPrincipales = datasFetch.adressePrincipale
            datasAdressesSecondaires = datasFetch.adressesSecondaires
            console.log('clients : ', datasClients)
            console.log('entreprise : ', datasEntreprises)
            console.log('adresse p : ', datasAdressesPrincipales)
            console.log('adresse sec : ', datasAdressesSecondaires)

            //Récupération du client principal
            const clientPrincipal = datasClients.find((client) => {
                return client.priorite === 1
            })

            //Attribution du contenu aux sélecteurs
            hName.innerHTML += datasEntreprises[0].nom_entreprise
            mailInput.value = datasEntreprises[0].mail
            nomClientPInput.value = clientPrincipal.nom_prenom
            mailClientPInput.value = clientPrincipal.mail
            telClientPInput.value = clientPrincipal.telephone
            fixeClientPInput.value = clientPrincipal.fixe

            // Pour le téléphone : assigner la valeur puis déclencher l'événement input pour formater
            telInput.value = datasEntreprises[0].telephone
            telInput.dispatchEvent(new Event('input'))

            // Pour le SIRET : assigner la valeur puis déclencher l'événement input pour formater
            siretInput.value = datasEntreprises[0].siret
            siretInput.dispatchEvent(new Event('input'))

            // Pour l'adresse si elle existe
            if (datasAdressesPrincipales && datasAdressesPrincipales.length > 0) {
                rueInput.value = datasAdressesPrincipales[0].rue || ''
                villeInput.value = datasAdressesPrincipales[0].ville || ''

                // Pour le code postal : assigner la valeur puis déclencher l'événement input pour formater
                cpInput.value = datasAdressesPrincipales[0].code_postal || ''
                cpInput.dispatchEvent(new Event('input'))
            }

            // Pour le Tel du client : assigner la valeur puis déclencher l'événement input pour formater
            telClientPInput.dispatchEvent(new Event('input'))

            // Pour le Fixe du client : assigner la valeur puis déclencher l'événement input pour formater
            fixeClientPInput.dispatchEvent(new Event('input'))

            //Appels de fonction
            generateAdressesSecondairesUI(datasAdressesSecondaires)
            generateContactsUI(datasClients)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
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

//Listeners pour tous les boutons
btnModifierMail.addEventListener('click', () => {
    const url = `../app/app.php?action=modif_mail&id=${id}&mail=${encodeURIComponent(mailInput.value)}`
    window.location.href = url
})
btnModifierTelephone.addEventListener('click', () => {
    // Enlever les espaces du numéro de téléphone
    const cleanTel = telInput.value.replace(/\s/g, '')

    // Vérifier si le format est correct avec la regex déjà définie
    if (!telRegex.test(cleanTel)) {
        alert('Le numéro de téléphone doit contenir exactement 10 chiffres.')
        return
    }

    const url = `../app/app.php?action=modif_telephone&id=${id}&tel=${encodeURIComponent(cleanTel)}`
    window.location.href = url
})
btnModifierSiret.addEventListener('click', () => {
    // Enlever les espaces du numéro de téléphone
    const cleanSiret = siretInput.value.replace(/\s/g, '')

    // Vérifier si le format est correct avec la regex déjà définie
    if (!siretRegex.test(cleanSiret)) {
        alert('Le numéro de SIRET doit contenir exactement 14 chiffres.')
        return
    }

    const url = `../app/app.php?action=modif_siret&id=${id}&siret=${encodeURIComponent(cleanSiret)}`
    window.location.href = url
})
btnModifierAdresse.addEventListener('click', () => {
    const idAdresse = datasAdressesPrincipales[0].Id_adresse
    const rueVal = rueInput.value.trim()
    const cpVal = cpInput.value.trim()
    const villeVal = villeInput.value.trim()
    // Vérifie que tous les champs sont remplis
    if (rueVal === '' || cpVal === '' || villeVal === '') {
        alert('Veuillez remplir tous les champs (rue, code postal, ville).')
        return
    }
    // Vérifie que le code postal est valide
    if (!cpRegex.test(cpVal)) {
        alert('Le code postal doit comporter exactement 5 chiffres.')
        return
    }
    const url = `../app/app.php?action=modif_adresseP&idA=${idAdresse}&rue=${encodeURIComponent(rueVal)}&cp=${encodeURIComponent(
        cpVal
    )}&ville=${encodeURIComponent(villeVal)}&id=${encodeURIComponent(id)}`
    window.location.href = url
})
btnModifierClientP.addEventListener('click', () => {
    const idVal = datasClients[0].Id_client
    const nomVal = nomClientPInput.value.trim()
    const mailVal = mailClientPInput.value.trim()
    const telVal = telClientPInput.value.trim().replace(/\s/g, '')
    const fixeVal = fixeClientPInput.value.trim().replace(/\s/g, '')

    // Vérifie que tous les champs sont remplis
    if (nomVal === '' || mailVal === '' || telVal === '' || fixeVal === '') {
        alert('Veuillez remplir tous les champs (nom, e-mail, téléphone, fixe).')
        return
    }

    // Vérifie que l'e-mail est valide
    if (!emailRegex.test(mailVal)) {
        alert('Veuillez entrer une adresse e-mail valide.')
        return
    }

    // Vérifie que les numéros de téléphone comportent 10 chiffres
    if (!telRegex.test(telVal)) {
        alert('Le numéro de téléphone portable doit comporter exactement 10 chiffres.')
        return
    }

    if (!telRegex.test(fixeVal)) {
        alert('Le numéro de téléphone fixe doit comporter exactement 10 chiffres.')
        return
    }

    const url = `../app/app.php?action=modif_clientP&idC=${encodeURIComponent(idVal)}&nom=${encodeURIComponent(
        nomVal
    )}&mail=${encodeURIComponent(mailVal)}&tel=${encodeURIComponent(telVal)}&fixe=${encodeURIComponent(fixeVal)}&id=${encodeURIComponent(
        id
    )}`
    window.location.href = url
})

function generateAdressesSecondairesUI(datasAdressesSecondaires) {
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

        // Bouton Modifier
        const btnModifier = document.createElement('button')
        btnModifier.textContent = 'Modifier'
        btnModifier.className = 'btn-modifier-adresse'
        btnModifier.addEventListener('click', () => {
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
                alert(`Veuiller renseigner un ordre valide entre 1 et ${maxPriorite}`)
                return
            }

            const url = `../app/app.php?action=modif_adresseS&idA=${adresse.Id_adresse}&rue=${encodeURIComponent(
                rue
            )}&cp=${encodeURIComponent(cp)}&ville=${encodeURIComponent(ville)}&priorite=${encodeURIComponent(
                priorite
            )}&id=${encodeURIComponent(id)}`
            window.location.href = url
        })

        // Bouton Supprimer
        const btnSupprimer = document.createElement('button')
        btnSupprimer.textContent = 'Supprimer'
        btnSupprimer.className = 'btn-supprimer-adresse'
        btnSupprimer.style.marginLeft = '10px'
        btnSupprimer.addEventListener('click', () => {
            const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette adresse secondaire ?')
            if (confirmDelete) {
                const url = `../app/app.php?action=suppr_adresseS&idA=${adresse.Id_adresse}&id=${encodeURIComponent(id)}`
                window.location.href = url
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
    })
}

function generateContactsUI(datasClients) {
    divContacts.innerHTML = '' // Réinitialiser le contenu

    const maxPriorite = Math.max(...datasClients.map((c) => parseInt(c.priorite)))
    const datasClientsSecondaires = datasClients.filter((client) => {
        return client.priorite !== 1
    })
    datasClientsSecondaires.forEach((contact, index) => {
        const contactDiv = document.createElement('div')
        contactDiv.className = 'contact'
        contactDiv.style.border = '1px solid #ccc'
        contactDiv.style.padding = '10px'
        contactDiv.style.marginBottom = '10px'

        // Titre
        const titre = document.createElement('h4')
        titre.textContent = `Contact n°${contact.priorite}`
        contactDiv.appendChild(titre)

        // Fonction utilitaire pour créer input + label
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

        // Nom et prénom
        const nomInput = document.createElement('input')
        nomInput.type = 'text'
        nomInput.value = contact.nom_prenom
        nomInput.placeholder = 'Nom Prénom'
        nomInput.className = 'input-nom'

        // Mail
        const mailInput = document.createElement('input')
        mailInput.type = 'email'
        mailInput.value = contact.mail
        mailInput.placeholder = 'Adresse e-mail'
        mailInput.className = 'input-mail'

        // Fixe
        const fixeInput = document.createElement('input')
        fixeInput.type = 'tel'
        fixeInput.value = contact.fixe
        fixeInput.placeholder = 'Téléphone fixe'
        fixeInput.className = 'input-fixe'
        applyPhoneMask(fixeInput)
        // Déclencher l'événement pour formater la valeur existante
        fixeInput.dispatchEvent(new Event('input'))

        // Téléphone
        const telInput = document.createElement('input')
        telInput.type = 'tel'
        telInput.value = contact.telephone
        telInput.placeholder = 'Téléphone mobile'
        telInput.className = 'input-telephone'
        applyPhoneMask(telInput)
        // Déclencher l'événement pour formater la valeur existante
        telInput.dispatchEvent(new Event('input'))

        // Priorité
        const prioriteInput = document.createElement('input')
        prioriteInput.type = 'number'
        prioriteInput.min = 1
        prioriteInput.max = maxPriorite
        prioriteInput.value = contact.priorite
        prioriteInput.className = 'input-priorite'

        // Bouton Modifier
        const btnModifier = document.createElement('button')
        btnModifier.textContent = 'Modifier'
        btnModifier.className = 'btn-modifier-contact'
        btnModifier.addEventListener('click', () => {
            const nom = nomInput.value.trim()
            const mail = mailInput.value.trim()
            const fixe = fixeInput.value.trim().replace(/\s/g, '')
            const telephone = telInput.value.trim().replace(/\s/g, '')
            const priorite = prioriteInput.value.trim()
            // Vérifie que les numéros de téléphone comportent 10 chiffres
            if (!telRegex.test(telephone)) {
                alert('Le numéro de téléphone portable doit comporter exactement 10 chiffres.')
                return
            }
            if (!telRegex.test(fixe)) {
                alert('Le numéro de téléphone fixe doit comporter exactement 10 chiffres.')
                return
            }
            if (!emailRegex.test(mail)) {
                alert('Veuillez saisir un mail valide.')
                return
            }
            if (!nom || !mail || !fixe || !telephone || !priorite) {
                alert('Tous les champs doivent être remplis.')
                return
            }

            const url = `../app/app.php?action=modif_clientS&idC=${contact.Id_client}&nom=${encodeURIComponent(
                nom
            )}&mail=${encodeURIComponent(mail)}&fixe=${encodeURIComponent(fixe)}&tel=${encodeURIComponent(
                telephone
            )}&priorite=${encodeURIComponent(priorite)}&id=${encodeURIComponent(id)}`
            console.log('URL de modification :', url)
            window.location.href = url
        })

        // Bouton Supprimer
        const btnSupprimer = document.createElement('button')
        btnSupprimer.textContent = 'Supprimer'
        btnSupprimer.className = 'btn-supprimer-contact'
        btnSupprimer.style.marginLeft = '10px'
        btnSupprimer.addEventListener('click', () => {
            const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')
            if (confirmDelete) {
                const url = `../app/app.php?action=suppr_clientS&idC=${contact.Id_client}&id=${encodeURIComponent(id)}`
                console.log('URL de suppression :', url)
                window.location.href = url
            }
        })

        // Ajout des champs dans la div
        contactDiv.appendChild(createLabeledInput('Nom et prénom :', nomInput))
        contactDiv.appendChild(createLabeledInput('E-mail :', mailInput))
        contactDiv.appendChild(createLabeledInput('Fixe :', fixeInput))
        contactDiv.appendChild(createLabeledInput('Téléphone :', telInput))
        contactDiv.appendChild(createLabeledInput('Priorité :', prioriteInput))
        contactDiv.appendChild(btnModifier)
        contactDiv.appendChild(btnSupprimer)

        divContacts.appendChild(contactDiv)
    })
}
