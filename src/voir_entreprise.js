let datasEntreprises = []
let datasAdressesPrincipales = []

const tabEntreprises = document.querySelector('.table_entreprises')
const selectEntreprise = document.getElementById('select_entreprise')
const inputRecherche = document.querySelector('.searchInput')
const btnRecherche = document.querySelector('.searchBtn')
const btnSupprRecherche = document.querySelector('.delSearch')
const selectTrie = document.querySelector('.select_trie')
const divPagination = document.querySelector('.pagination')

//Selecteurs pour la PopUp
const popup = document.querySelector('.popupEntreprise')
const btnPopup = document.querySelector('.btnPopUp')
btnPopup.addEventListener('click', () => {
    popup.style.display = 'flex'
})

//Au changement de condition de trie, on appelle la fonction
selectTrie.addEventListener('change', () => {
    const critere = selectTrie.value
    const datasTrie = trieDatas(critere, datasEntreprises, datasAdressesPrincipales)
    createPagination(datasTrie, tabEntreprises, divPagination)
    addTabEntreprises(datasTrie, datasAdressesPrincipales, tabEntreprises)
})

//Listener pour recherche
btnRecherche.addEventListener('click', () => recherche(inputRecherche.value.toLowerCase()))
btnSupprRecherche.addEventListener('click', () => {
    inputRecherche.value = ''
    createPagination(datasEntreprises, tabEntreprises, divPagination)
    addTabEntreprises(datasEntreprises, datasAdressesPrincipales, tabEntreprises)
})

window.addEventListener('DOMContentLoaded', () => {
    //Récupération des éléments des tables entreprises et adresses
    fetch('../api/clients.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datasEntreprises = datasFetch.entreprises
            datasAdressesPrincipales = datasFetch.adressesPrincipales
            console.log('adresses : ', datasAdressesPrincipales)
            console.log('entreprises : ', datasEntreprises)

            datasEntreprises.sort((a, b) => a.nom_entreprise.localeCompare(b.nom_entreprise))
            createPagination(datasEntreprises, tabEntreprises, divPagination)
            addTabEntreprises(datasEntreprises, datasAdressesPrincipales, tabEntreprises)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

function addTabEntreprises(datasEntreprises, datasAdressesPrincipales, tabEntreprises, start = 0, limit = 20) {
    tabEntreprises.innerHTML = ''
    const paginatedData = datasEntreprises.slice(start, start + limit)
    console.log(paginatedData)
    paginatedData.forEach((entreprise) => {
        const tr = document.createElement('tr')

        // Nom entreprise
        const tdNom = document.createElement('td')
        const inputNom = document.createElement('input')
        inputNom.type = 'text'
        inputNom.value = entreprise.nom_entreprise
        inputNom.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdNom.appendChild(inputNom)

        //Récupération de l'adresse principale pour chaque entreprise
        const adresse = datasAdressesPrincipales.find((adresse) => {
            return parseInt(entreprise.Id_entreprise) === parseInt(adresse.Id_entreprise)
        })

        // Rue
        const tdRue = document.createElement('td')
        const inputRue = document.createElement('input')
        inputRue.type = 'text'
        inputRue.value = adresse.rue
        inputRue.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdRue.appendChild(inputRue)

        // Code postal
        const tdCP = document.createElement('td')
        const inputCP = document.createElement('input')
        inputCP.type = 'text'
        inputCP.value = adresse.code_postal
        inputCP.maxLength = 5
        inputCP.pattern = '\\d{5}'
        inputCP.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdCP.appendChild(inputCP)

        // Ville
        const tdVille = document.createElement('td')
        const inputVille = document.createElement('input')
        inputVille.type = 'text'
        inputVille.value = adresse.ville
        inputVille.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdVille.appendChild(inputVille)

        // Boutons actions
        const tdActions = document.createElement('td')
        const btnModif = document.createElement('button')
        btnModif.textContent = 'Confirmer les modifications'
        btnModif.style.display = 'none'
        btnModif.classList.add('btn-modif')

        btnModif.addEventListener('click', () => {
            const nom = inputNom.value.trim()
            const rue = inputRue.value.trim()
            const code_postal = inputCP.value.trim()
            const ville = inputVille.value.trim()

            if (!/^\d{5}$/.test(code_postal)) {
                alert('Le code postal doit comporter exactement 5 chiffres.')
                return
            }

            const isValid = nom && rue && code_postal && ville

            if (isValid) {
                const url = `../app/app.php?action=modif_entreprise&idE=${entreprise.Id_entreprise}&nom=${encodeURIComponent(
                    nom
                )}&rue=${encodeURIComponent(rue)}&cp=${code_postal}&ville=${encodeURIComponent(ville)}&idA=${encodeURIComponent(
                    adresse.Id_adresse
                )}`
                window.location.href = url
            } else {
                alert('Tous les champs doivent être remplis.')
            }
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ? Tous ces contacts associés seront supprimés.')) {
                const url = `../app/app.php?action=suppr_entreprise&id=${entreprise.Id_entreprise}`
                window.location.href = url
            }
        })

        const btnVoirClient = document.createElement('button')
        btnVoirClient.textContent = 'Voir Détails'
        btnVoirClient.style.display = 'block'
        btnVoirClient.addEventListener('click', () => {
            const url = `../app/app.php?action=voir_details_entreprise&id=${entreprise.Id_entreprise}`
            window.open(url, '_blank')
        })
        tdActions.appendChild(btnVoirClient)
        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnSuppr)

        // Assemblage des éléments
        tr.appendChild(tdNom)
        tr.appendChild(tdRue)
        tr.appendChild(tdCP)
        tr.appendChild(tdVille)
        tr.appendChild(tdActions)

        tabEntreprises.appendChild(tr)
    })
}

function recherche(texte) {
    if (texte === '') {
        alert('Veuillez saisir un ou plusieurs termes de recherche')
        return
    }

    console.log('recherche avec le terme :', texte)
    const mots = texte.toLowerCase().split(' ')

    const datasFiltre = datasEntreprises.filter((item) => {
        // On cherche l'adresse principale de l'entreprise
        const adresse = datasAdressesPrincipales.find((a) => parseInt(a.Id_entreprise) === parseInt(item.Id_entreprise))

        const champ = `
            ${item.nom_entreprise}
            ${adresse?.rue || ''}
            ${adresse?.code_postal || ''}
            ${adresse?.ville || ''}
        `.toLowerCase()

        return mots.some((mot) => champ.includes(mot))
    })

    if (datasFiltre.length === 0) {
        alert(`Aucun résultat trouvé avec la recherche "${texte}"`)
    } else {
        createPagination(datasFiltre, tabEntreprises, divPagination)
        addTabEntreprises(datasFiltre, datasAdressesPrincipales, tabEntreprises)
        alert(`${datasFiltre.length} résultat(s) trouvé(s) avec la recherche "${texte}"`)
    }
}

function trieDatas(trie, datasEntreprises, datasAdressesPrincipales) {
    let datasTries = [...datasEntreprises] // copie des données
    datasTries.sort((a, b) => {
        const adresseA = datasAdressesPrincipales.find((ad) => parseInt(ad.Id_entreprise) === parseInt(a.Id_entreprise))
        const adresseB = datasAdressesPrincipales.find((ad) => parseInt(ad.Id_entreprise) === parseInt(b.Id_entreprise))
        switch (trie) {
            case 'nom':
                return a.nom_entreprise.localeCompare(b.nom_entreprise)
            case 'cp':
                return (adresseA?.code_postal || '').localeCompare(adresseB?.code_postal || '')
            case 'ville':
                return (adresseA?.ville || '').localeCompare(adresseB?.ville || '')
            default:
                return 0 // pas de tri
        }
    })
    return datasTries
}

function createPagination(datas, tabEntreprises, divPagination, limit = 20) {
    divPagination.innerHTML = ''
    const totalPages = Math.ceil(datas.length / limit)
    console.log('taille : ', datas.length)
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button')
        btn.textContent = `Page ${i + 1}`
        btn.classList.add('pagination-btn')
        btn.addEventListener('click', () => {
            addTabEntreprises(datas, datasAdressesPrincipales, tabEntreprises, i * limit, limit)
        })
        divPagination.appendChild(btn)
    }
}
