let datas = []
let datasClients = []
let datasEntreprises = []
const inputRecherche = document.querySelector('.searchInput')
const btnRecherche = document.querySelector('.searchBtn')
const btnSupprRecherche = document.querySelector('.delSearch')
let tabDatas = document.querySelector('.table_enregistrements')
const selectTrie = document.querySelector('.select_trie')

window.addEventListener('DOMContentLoaded', () => {
    fetch('../api/datas.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datas = datasFetch.datas
            datasClients = datasFetch.clients
            datasEntreprises = datasFetch.entreprises

            console.log('datas : ', datas)
            console.log('datasClients : ', datasClients)
            console.log('datasEntreprises : ', datasEntreprises)

            // Appel de fonction
            addTabDatas(datas, datasClients, datasEntreprises, tabDatas)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

//Au changement de condition de trie, on appelle la fonction
selectTrie.addEventListener('change', () => {
    const critere = selectTrie.value
    const datasTrie = trieDatas(critere, datas)
    addTabDatas(datasTrie, datasClients, datasEntreprises, tabDatas)
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
        const tdEntreprise = createReadOnlyCell(nomEntreprise === undefined ? '_' : nomEntreprise)
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

        //Bouton dupliquer
        const btnMPasteDevis = document.createElement('button')
        const imgPasteDevis = document.createElement('img')
        imgPasteDevis.src = '../img/copy.png'
        imgPasteDevis.style.width = '20px'
        imgPasteDevis.style.height = '20px'
        btnMPasteDevis.appendChild(imgPasteDevis)
        btnMPasteDevis.addEventListener('click', () => {
            //En fonction du type de devis, on renvoie sur une page de calcul différent
            const direction = data.type_enregistrement === 'Feuille' ? 'calcul_impression' : 'calcul_matiere'
            const url = `../app/app.php?action=${direction}&modif=copy&id=${encodeURIComponent(data.Id_enregistrement)}`
            window.open(url, '_blank')
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

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnModifDevis)
        tdActions.appendChild(btnMPasteDevis)
        tdActions.appendChild(btnPDF)
        tdActions.appendChild(btnSuppr)

        // Ajout des cellules à la ligne
        tr.appendChild(tdHiddenId)
        tr.appendChild(tdNom)
        tr.appendChild(tdType)
        tr.appendChild(tdEntreprise)
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

// Fonction utilitaire pour créer une cellule en lecture seule
function createReadOnlyCell(value) {
    const td = document.createElement('td')
    td.textContent = value
    return td
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
    addTabDatas(datas, datasClients, datasEntreprises, tabDatas)
})

function recherche(texte) {
    if (texte === '') {
        alert('Veuillez saisir un ou plusieurs termes de recherche')
        return
    }

    console.log('recherche avec le terme :', texte)
    const mots = texte.toLowerCase().split(' ')

    const datasFiltre = datas.filter((item) => {
        // Récupérer le client lié à l'enregistrement
        const client = datasClients.find((c) => c.Id_client === item.Id_client)
        // Récupérer l'entreprise liée au client (s'il y a un client)
        const entreprise = client ? datasEntreprises.find((e) => e.Id_entreprise === client.entreprise_Id) : null

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
            ${entreprise ? entreprise.nom_entreprise : ''}
        `.toLowerCase()

        return mots.some((mot) => champ.includes(mot))
    })

    if (datasFiltre.length === 0) {
        alert(`Aucun résultat trouvé avec la recherche "${texte}"`)
    } else {
        addTabDatas(datasFiltre, datasClients, datasEntreprises, tabDatas)
        alert(`${datasFiltre.length} résultat(s) trouvé(s) avec la recherche "${texte}"`)
    }
}
