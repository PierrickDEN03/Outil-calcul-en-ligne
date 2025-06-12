let datas = []
let datasClients = []
let datasEntreprises = []
const inputRecherche = document.querySelector('.searchInput')
const btnRecherche = document.querySelector('.searchBtn')
const btnSupprRecherche = document.querySelector('.delSearch')
const tabDatas = document.querySelector('.table_enregistrements')
const selectTrie = document.querySelector('.select_trie')

window.addEventListener('DOMContentLoaded', () => {
    fetch('../api/datas.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            const datas = datasFetch.datas
            const datasClients = datasFetch.clients
            const datasEntreprises = datasFetch.entreprises

            console.log(datas)
            console.log(datasClients)
            console.log(datasEntreprises)

            // Appel de fonction
            addTabDatas(datas, datasClients, datasEntreprises, tabDatas)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

//Au changement de condition de trie, on appelle la fonction
selectTrie.addEventListener('change', () => {
    const critere = selectTrie.value
    const datasTrie = trieDatas(critere, datas)
    addTabDatas(datasTrie, tabDatas)
})

// Fonction utilitaire pour remplacer 0 ou "" par "_" sauf si type = "Matière" et champ = "espace_pose"
function formatValue(val, type, champ) {
    if (type === 'Matière' && champ === 'espace_pose') {
        // On retourne la vraie valeur, même si c’est 0
        return val
    }
    return val === 0 || val === '' ? '_' : val
}

// Fonction modifiée pour générer les lignes dynamiquement
function addTabDatas(datas, datasClients, datasEntreprises, tabDatas) {
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
        const nomEntreprise = datasEntreprises.find((entreprise) => {
            return parseInt(entreprise.Id_entreprise) === parseInt(idClientEntreprise)
        })?.nom_entreprise

        const nomContact = datasClients.find((client) => {
            return parseInt(client.Id_client) === parseInt(data.Id_client)
        })?.nom_prenom

        // Colonnes en lecture seule avec formatage
        const tdDate = createReadOnlyCell(formatValue(data.date, data.type_enregistrement, 'date'))
        const tdType = createReadOnlyCell(formatValue(data.type_enregistrement, data.type_enregistrement, 'type_enregistrement'))
        const tdQuantite = createReadOnlyCell(formatValue(data.quantite, data.type_enregistrement, 'quantite'))
        const tdPrix = createReadOnlyCell(formatValue(data.prix, data.type_enregistrement, 'prix'))
        const tdLongueur = createReadOnlyCell(formatValue(data.longueur, data.type_enregistrement, 'longueur'))
        const tdLargeur = createReadOnlyCell(formatValue(data.largeur, data.type_enregistrement, 'largeur'))
        const tdMatiere = createReadOnlyCell(formatValue(data.matiere, data.type_enregistrement, 'matiere'))
        const tdDecoupe = createReadOnlyCell(formatValue(data.decoupe, data.type_enregistrement, 'decoupe'))
        const tdFormat = createReadOnlyCell(formatValue(data.format, data.type_enregistrement, 'format'))
        const tdImpression = createReadOnlyCell(formatValue(data.type_impression, data.type_enregistrement, 'type_impression'))
        const tdEntreprise = createReadOnlyCell(nomEntreprise === undefined ? '_' : nomEntreprise)
        const tdContact = createReadOnlyCell(nomContact === undefined ? '_' : nomContact)

        // Actions : Modifier + Supprimer
        const tdActions = document.createElement('td')

        const btnModif = document.createElement('button')
        btnModif.textContent = 'Confirmer les modifications'
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

            const url = `../app/app.php?action=modif_data&id=${encodeURIComponent(data.Id_enregistrement)}&nom=${encodeURIComponent(
                newNom
            )}`
            window.location.href = url
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')
            if (confirmation) {
                const url = `../app/app.php?action=suppr_data&id=${encodeURIComponent(data.Id_enregistrement)}`
                window.location.href = url
            }
        })

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnSuppr)

        // Ajout des cellules à la ligne
        tr.appendChild(tdHiddenId)
        tr.appendChild(tdNom)
        tr.appendChild(tdEntreprise)
        tr.appendChild(tdContact)
        tr.appendChild(tdDate)
        tr.appendChild(tdType)
        tr.appendChild(tdFormat)
        tr.appendChild(tdImpression)
        tr.appendChild(tdMatiere)
        tr.appendChild(tdQuantite)
        tr.appendChild(tdPrix)
        tr.appendChild(tdLongueur)
        tr.appendChild(tdLargeur)
        tr.appendChild(tdDecoupe)

        tr.appendChild(tdActions)

        tabDatas.appendChild(tr)
    })
}

// Fonction utilitaire pour créer une cellule en lecture seule
function createReadOnlyCell(value) {
    const td = document.createElement('td')
    td.textContent = value
    return td
}

function trieDatas(trie, datas) {
    let datasTries = [...datas] // on fait une copie du tableau original

    switch (trie) {
        case 'type':
            datasTries.sort((a, b) => a.type_enregistrement.localeCompare(b.type_enregistrement))
            break
        case 'nom':
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
    addTabDatas(datas, tabDatas)
})

function recherche(texte) {
    if (texte === '') {
        alert('Veuillez saisir un ou plusieurs termes de recherche')
        return
    }
    console.log('recherche avec le terme :', texte)
    const mots = texte.toLowerCase().split(' ')

    const datasFiltre = datas.filter((item) => {
        //On met tout dans un string pour éviter des conditions
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
        `.toLowerCase()

        return mots.some((mot) => champ.includes(mot))
    })

    if (datasFiltre.length === 0) {
        alert(`Aucun résultat trouvé avec la recherche "${texte}"`)
    } else {
        addTabDatas(datasFiltre, tabDatas)
        alert(`${datasFiltre.length} résultat(s) trouvé(s) avec la recherche "${texte}"`)
    }
}
