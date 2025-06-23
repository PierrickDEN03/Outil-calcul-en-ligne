let datasClients = []
let datasEntreprises = []
let datasAdressesPrincipales = []
let datasAdressesSecondaires = []
let datasDevis = []
let datasPaiements = []
let datasAdresses = []
let id

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
// Boutons de modification
const btnModifNom = document.querySelector('.modifier-nomE')
const btnModifPaiement = document.querySelector('.modifier-paiementE')
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
            datasEntreprises = datasFetch.entreprise[0]
            datasAdressesPrincipales = datasFetch.adressePrincipale[0]
            datasAdressesSecondaires = datasFetch.adressesSecondaires
            datasDevis = datasFetch.devis
            datasAdresses = [...datasFetch.adressePrincipale, ...datasFetch.adressesSecondaires]
            datasPaiements = datasFetch.paiements
            /*console.log('clients : ', datasClients)
            console.log('entreprise : ', datasEntreprises)
            console.log('adresse p : ', datasAdressesPrincipales)
            console.log('adresse sec : ', datasAdressesSecondaires)
            console.log('datasDevis : ', datasDevis)
            console.log('datasP : ', datasPaiements)*/

            //Rajout dynamique dans select des modalités de paiement
            const selectPaiement = document.getElementById('paiementE')
            datasPaiements.forEach((item) => {
                const option = document.createElement('option')
                option.value = item.Id_paiement
                option.innerHTML = item.label_paiement
                selectPaiement.appendChild(option)
            })
            selectPaiement.value = datasEntreprises.Id_paiement

            //Et aussi pour les adresses pour le client principal
            datasAdresses.forEach((item) => {
                const option = document.createElement('option')
                option.innerHTML = `${item.rue}, ${item.code_postal} ${item.ville}`
                option.value = item.Id_adresse
                selectAdresseClientP.appendChild(option)
            })
            selectAdresseClientP.value = datasClients.find((client) => parseInt(client.priorite) === 1)?.adresse_Id

            //Récupération du client principal
            const clientPrincipal = datasClients.find((client) => {
                return client.priorite === 1
            })

            //Attribution du contenu aux sélecteurs
            hName.innerHTML += datasEntreprises.nom_entreprise
            nomEntreprise.value = datasEntreprises.nom_entreprise
            mailInput.value = datasEntreprises.mail
            nomClientPInput.value = clientPrincipal.nom_prenom
            mailClientPInput.value = clientPrincipal.mail
            telClientPInput.value = clientPrincipal.telephone
            fixeClientPInput.value = clientPrincipal.fixe

            // Pour le téléphone : assigner la valeur puis déclencher l'événement input pour formater
            telInput.value = datasEntreprises.telephone
            telInput.dispatchEvent(new Event('input'))

            // Pour le SIRET : assigner la valeur puis déclencher l'événement input pour formater
            siretInput.value = datasEntreprises.siret
            siretInput.dispatchEvent(new Event('input'))

            // Pour l'adresse si elle existe
            if (datasAdressesPrincipales) {
                rueInput.value = datasAdressesPrincipales.rue || ''
                villeInput.value = datasAdressesPrincipales.ville || ''

                // Pour le code postal : assigner la valeur puis déclencher l'événement input pour formater
                cpInput.value = datasAdressesPrincipales.code_postal || ''
                cpInput.dispatchEvent(new Event('input'))
            }

            // Pour le Tel du client : assigner la valeur puis déclencher l'événement input pour formater
            telClientPInput.dispatchEvent(new Event('input'))

            // Pour le Fixe du client : assigner la valeur puis déclencher l'événement input pour formater
            fixeClientPInput.dispatchEvent(new Event('input'))

            //Appels de fonction
            generateAdressesSecondairesUI(datasAdressesSecondaires)
            generateContactsUI(datasClients)
            addTabDatas(datasDevis, datasClients, tabDatas)
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

/* ========================================================= ELEMENTS PRINCIPAUX ============================================================ */

//Listeners pour tous les boutons
btnModifNom.addEventListener('click', () => {
    const url = `../app/app.php?action=modif_nomE&id=${id}&nomE=${encodeURIComponent(nomEntreprise.value)}`
    window.location.href = url
})

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

btnModifPaiement.addEventListener('click', () => {
    const url = `../app/app.php?action=modif_paiementE&id=${id}&mpaiement=${encodeURIComponent(document.getElementById('paiementE').value)}`
    window.location.href = url
})

btnModifierAdresse.addEventListener('click', () => {
    const idAdresse = datasAdressesPrincipales.Id_adresse
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
    const idAdresse = selectAdresseClientP.value

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
    )}&mail=${encodeURIComponent(mailVal)}&tel=${encodeURIComponent(telVal)}&fixe=${encodeURIComponent(fixeVal)}&idA=${encodeURIComponent(
        idAdresse
    )}&id=${encodeURIComponent(id)}`
    window.location.href = url
})

/* ====================================================== SECTION ADRESSES =====================================================*/
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

/* ====================================================== SECTION CONTACTS =================================================== */
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

        //Adresse
        const selectAdresse = document.createElement('select')
        datasAdresses.forEach((item) => {
            const option = document.createElement('option')
            option.innerHTML = `${item.rue}, ${item.code_postal} ${item.ville}`
            option.value = item.Id_adresse
            selectAdresse.appendChild(option)
        })
        selectAdresse.value = contact.adresse_Id

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
            )}&adresseC=${encodeURIComponent(selectAdresse.value)}&priorite=${encodeURIComponent(priorite)}&id=${encodeURIComponent(id)}`
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
        contactDiv.appendChild(createLabeledInput('Adresse :', selectAdresse))
        contactDiv.appendChild(createLabeledInput('Priorité :', prioriteInput))
        contactDiv.appendChild(btnModifier)
        contactDiv.appendChild(btnSupprimer)

        divContacts.appendChild(contactDiv)
    })
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
function addTabDatas(datas, datasClients, tabDatas) {
    tabDatas.innerHTML = ''
    datas.forEach((data) => {
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
        btnModif.addEventListener('click', () => {
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

            const url = `../app/app.php?action=modif_data_detail&id=${encodeURIComponent(id)}&idDevis=${encodeURIComponent(
                data.Id_enregistrement
            )}&nom=${encodeURIComponent(newNom)}`
            window.location.href = url
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')
            if (confirmation) {
                const url = `../app/app.php?action=suppr_data_detail&id=${encodeURIComponent(id)}&idDevis=${encodeURIComponent(
                    data.Id_enregistrement
                )}`
                window.location.href = url
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
        btnMPasteDevis.addEventListener('click', () => {
            //En fonction du type de devis, on renvoie sur une page de calcul différent
            const direction = data.type_enregistrement === 'Feuille' ? 'calcul_impression' : 'calcul_matiere'
            const url = `../app/app.php?action=${direction}modif=copy&id=${encodeURIComponent(data.Id_enregistrement)}`
            window.open(url, '_blank')
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
        addTabDatas(datasFiltre, datasClients, tabDatas)
        alert(`${datasFiltre.length} résultat(s) trouvé(s) avec la recherche "${texte}"`)
    }
}
