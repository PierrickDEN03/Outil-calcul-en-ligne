// Définition des variables
let datasImpressions = []
let datasDegressif = []
let fraisFixe = []
let infosPliage = []

const tabImpression = document.querySelector('.table_matiere')
const tabDegressif = document.querySelector('.table_degressif')
const btnAddImpr = document.querySelector('.btnAdd')
const btnAddPalier = document.querySelector('.btnAddPalier')
let inputFraisFixe = document.querySelector('.fraisFixe')
let inputPrixPliage = document.querySelector('.prix_pliage')
let inputFraisPliage = document.querySelector('.frais_pliage')
const btnModifPliage = document.querySelector('.submit_pliage')
const btnFrais = document.querySelector('.submit_frais')
const divPagination = document.querySelector('.pagination')
//**** Recherche
const inputRecherche = document.querySelector('.searchInput')
const btnRecherche = document.querySelector('.searchBtn')
const btnSupprRecherche = document.querySelector('.delSearch')
const selectTrie = document.querySelector('.select_trie')

//Au changement de condition de trie, on appelle la fonction
selectTrie.addEventListener('change', () => {
    const critere = selectTrie.value
    const datasTrie = trieDatas(critere, datasImpressions)
    addTabMatiere(datasTrie, tabImpression)
    createPagination(datasTrie, tabImpression, divPagination)
})

//Listener pour recherche
btnRecherche.addEventListener('click', () => recherche(inputRecherche.value.toLowerCase()))
btnSupprRecherche.addEventListener('click', () => {
    inputRecherche.value = ''
    addTabMatiere(datasImpressions, tabImpression)
    createPagination(datasImpressions, tabImpression, divPagination)
})

//EventListeners
btnAddImpr.addEventListener('click', addImpression)
btnAddPalier.addEventListener('click', addDegImpr)
//Modification frais fixe
btnFrais.addEventListener('click', (e) => {
    e.preventDefault()
    if (parseFloat(inputFraisFixe.value) < 0 || isNaN(parseFloat(inputFraisFixe.value))) {
        alert('Veuillez saisir un frais fixe correct.')
        return
    }

    let frais = inputFraisFixe.value
    let id = fraisFixe.Id_frais
    const url = `../app/app.php?action=modif_frais_impr&id=${encodeURIComponent(id)}&frais=${encodeURIComponent(frais)}`
    window.location.href = url
})
//Modification infos pliage
btnModifPliage.addEventListener('click', (e) => {
    e.preventDefault()
    if (parseFloat(inputFraisPliage.value) < 0 || isNaN(parseFloat(inputFraisPliage.value))) {
        alert('Veuillez saisir un frais de lancement correct.')
        return
    }
    if (parseFloat(inputPrixPliage.value) <= 0 || isNaN(parseFloat(inputPrixPliage.value))) {
        alert('Veuillez saisir un prix de pliage correct.')
        return
    }
    let id = infosPliage.Id_pliage
    const fraisPliage = inputFraisPliage.value
    const prixPliage = inputPrixPliage.value
    const url = `../app/app.php?action=modif_infos_pliage&id=${encodeURIComponent(id)}&frais=${encodeURIComponent(
        fraisPliage
    )}&prixPliage=${encodeURIComponent(prixPliage)}`
    window.location.href = url
})

window.addEventListener('DOMContentLoaded', () => {
    //Récupération des éléments de la tables impressions
    fetch('../api/impressions.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datasImpressions = datasFetch.impressions
            datasDegressif = datasFetch.degressif
            infosPliage = datasFetch.pliage[0]
            fraisFixe = datasFetch.frais[0]
            console.log('infosPliage : ', infosPliage)
            console.log('frais fixe : ', fraisFixe)

            datasImpressions.sort((a, b) => a.nom_papier.localeCompare(b.nom_papier))
            datasDegressif.sort((a, b) => a.min - b.min)
            console.log('Chargement page...')
            //Création de la pagination et du tableau des impressions
            addTabMatiere(datasImpressions, tabImpression)
            createPagination(datasImpressions, tabImpression, divPagination)

            addTabDegressif(datasDegressif, tabDegressif)

            //Assignation des valeurs des inputs frais et pliage
            inputFraisFixe.value = fraisFixe.prix_frais
            inputPrixPliage.value = infosPliage.prix_pliage
            inputFraisPliage.value = infosPliage.frais_fixe
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

function addTabMatiere(datasImpressions, tabImpression, start = 0, limit = 20) {
    tabImpression.innerHTML = ''
    //20 ou moins impressions affichées
    const paginatedData = datasImpressions.slice(start, start + limit)
    console.log(paginatedData)
    paginatedData.forEach((impression) => {
        const tr = document.createElement('tr')

        const tdId = document.createElement('td')
        tdId.textContent = impression.Id_papier

        const tdNom = document.createElement('td')
        const inputNom = document.createElement('input')
        inputNom.type = 'text'
        inputNom.value = impression.nom_papier
        inputNom.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdNom.appendChild(inputNom)

        const tdGrammage = document.createElement('td')
        const inputGrammage = document.createElement('input')
        inputGrammage.type = 'number'
        inputGrammage.value = impression.grammage
        inputGrammage.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdGrammage.appendChild(inputGrammage)

        const tdCode = document.createElement('td')
        const inputCode = document.createElement('input')
        inputCode.type = 'text'
        inputCode.value = impression.code_matiere
        inputCode.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdCode.appendChild(inputCode)

        const tdRecto = document.createElement('td')
        const inputRecto = document.createElement('input')
        inputRecto.type = 'number'
        inputRecto.step = '0.01'
        inputRecto.value = impression.prix_recto
        inputRecto.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdRecto.appendChild(inputRecto)

        const tdRectoVerso = document.createElement('td')
        const inputRectoVerso = document.createElement('input')
        inputRectoVerso.type = 'number'
        inputRectoVerso.step = '0.01'
        inputRectoVerso.value = impression.prix_recto_verso
        inputRectoVerso.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdRectoVerso.appendChild(inputRectoVerso)

        const tdActions = document.createElement('td')
        const btnModif = document.createElement('button')
        btnModif.textContent = 'Confirmer les modifications'
        btnModif.style.display = 'none'
        btnModif.classList.add('btn-modif')
        btnModif.addEventListener('click', () => {
            const id = parseInt(impression.Id_papier)
            const nom = inputNom.value.trim()
            const code = inputCode.value.trim()
            const grammage = parseInt(inputGrammage.value)
            const recto = parseFloat(inputRecto.value)
            const rectoVerso = parseFloat(inputRectoVerso.value)

            const isValid =
                !isNaN(id) &&
                id > 0 &&
                nom !== '' &&
                code !== '' &&
                !isNaN(grammage) &&
                grammage > 0 &&
                !isNaN(recto) &&
                recto > 0 &&
                !isNaN(rectoVerso) &&
                rectoVerso > 0

            if (isValid) {
                const url = `../app/app.php?action=modif_impression&id=${id}&nom=${encodeURIComponent(
                    nom
                )}&grammage=${grammage}&code=${encodeURIComponent(code)}&recto=${recto}&recto_verso=${rectoVerso}`
                window.location.href = url
            } else {
                alert(
                    'Tous les champs doivent être remplis correctement.\n- Les textes ne doivent pas être vides\n- Les nombres doivent être valides et positifs.'
                )
            }
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')
            if (confirmation) {
                const id = impression.Id_papier
                const url = `../app/app.php?action=suppr_impression&id=${id}`
                window.location.href = url
            }
        })

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnSuppr)

        tr.appendChild(tdId)
        tr.appendChild(tdNom)
        tr.appendChild(tdGrammage)
        tr.appendChild(tdRecto)
        tr.appendChild(tdRectoVerso)
        tr.appendChild(tdCode)
        tr.appendChild(tdActions)

        tabImpression.appendChild(tr)
    })
}

function addTabDegressif(datasDegressif, tabDegressif) {
    datasDegressif.forEach((palier) => {
        const tr = document.createElement('tr')

        // Min
        const tdMin = document.createElement('td')
        const inputMin = document.createElement('input')
        inputMin.type = 'number'
        inputMin.value = palier.min
        inputMin.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdMin.appendChild(inputMin)

        // Max
        const tdMax = document.createElement('td')
        const inputMax = document.createElement('input')
        inputMax.type = 'number'
        inputMax.value = palier.max
        inputMax.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdMax.appendChild(inputMax)

        // Coefficient (prix)
        const tdPrix = document.createElement('td')
        const inputPrix = document.createElement('input')
        inputPrix.type = 'number'
        inputPrix.step = '0.01'
        inputPrix.value = palier.prix
        inputPrix.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdPrix.appendChild(inputPrix)

        // Bouton d'action
        const tdActions = document.createElement('td')
        const btnModif = document.createElement('button')
        btnModif.textContent = 'Confirmer les modifications'
        btnModif.style.display = 'none'
        btnModif.classList.add('btn-modif')

        btnModif.addEventListener('click', () => {
            const id = parseInt(palier.Id_deg_matiere)
            const min = parseInt(inputMin.value)
            const max = parseInt(inputMax.value)
            const prix = parseFloat(inputPrix.value)

            const isValid = !isNaN(id) && id > 0 && !isNaN(min) && min > 0 && !isNaN(max) && max >= min && !isNaN(prix) && prix > 0

            if (isValid) {
                const url = `../app/app.php?action=modif_deg_impr&id=${id}&min=${min}&max=${max}&prix=${prix}`
                window.location.href = url
                console.log('ok')
            } else {
                alert('Tous les champs doivent être remplis correctement.\n- Min ≤ Max\n- Prix doit être un nombre positif.')
            }
        })

        // Bouton Supprimer
        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            const id = parseInt(palier.Id_deg_matiere)
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce palier ?')
            if (confirmation) {
                const url = `../app/app.php?action=suppr_deg_impr&id=${id}`
                window.location.href = url
            }
        })

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnSuppr)

        tr.appendChild(tdMin)
        tr.appendChild(tdMax)
        tr.appendChild(tdPrix)
        tr.appendChild(tdActions)

        tabDegressif.appendChild(tr)
    })
}

function addImpression() {
    const nom = document.getElementById('newNom').value.trim()
    const grammage = document.getElementById('newGrammage').value.trim()
    const code =
        document.getElementById('newCode').value.trim() !== ''
            ? document.getElementById('newCode').value.trim()
            : genererCode(nom, grammage)
    const recto = document.getElementById('newRecto').value.trim()
    const rectoVerso = document.getElementById('newRectoVerso').value.trim()

    // Validation simple
    if (nom === '' || isNaN(grammage) || grammage <= 0 || isNaN(recto) || recto <= 0 || isNaN(rectoVerso) || rectoVerso <= 0) {
        alert("Veuillez remplir correctement tous les champs d'impression.")
        return
    }

    // Construction URL
    const url = `../app/app.php?action=add_impression&nom=${encodeURIComponent(nom)}&grammage=${grammage}&code=${encodeURIComponent(
        code
    )}&recto=${recto}&recto_verso=${rectoVerso}`

    // Redirection
    window.location.href = url
}

function addDegImpr() {
    const min = document.getElementById('newMin').value.trim()
    const max = document.getElementById('newMax').value.trim()
    const coeff = document.getElementById('newCoeff').value.trim()

    // Validation simple
    if (isNaN(min) || min <= 0 || isNaN(max) || max < 0 || Number(min) > Number(max) || isNaN(coeff) || coeff <= 0) {
        alert('Veuillez remplir correctement tous les champs des paliers dégressifs.\nLe minimum doit être inférieur ou égal au maximum.')
        return
    }

    // Construction URL
    const url = `../app/app.php?action=add_deg_impr&min=${min}&max=${max}&prix=${coeff}`

    // Redirection
    console.log(url)
    window.location.href = url
}

function genererCode(nom, grammage) {
    let code = ''
    const tabLettres = nom.split('')
    tabLettres.forEach((lettre, i) => {
        if (i >= 5) return
        code += lettre.toString().toUpperCase()
    })
    code += grammage.toString()
    return code
}

function trieDatas(trie, datasImpressions) {
    let datasTries = [...datasImpressions] // copie des données

    datasTries.sort((a, b) => {
        switch (trie) {
            case 'nom':
                return a.nom_papier.localeCompare(b.nom_papier)

            case 'grammage':
                return a.grammage - b.grammage
            case 'code':
                return a.code_matiere.localeCompare(b.code_matiere)
            case 'recto':
                return a.prix_recto - b.prix_recto
            case 'verso':
                return a.prix_recto_verso - b.prix_recto_verso
            default:
                return 0 // pas de tri
        }
    })

    return datasTries
}

function recherche(texte) {
    if (texte === '') {
        alert('Veuillez saisir un ou plusieurs termes de recherche')
        return
    }
    console.log('recherche avec le terme :', texte)
    const mots = texte.toLowerCase().split(' ')
    const datasFiltre = datasImpressions.filter((item) => {
        // On cherche l'adresse principale de l'entreprise
        const champ = normalizeString(`
            ${item.nom_entreprise}
            ${item.grammage}
            ${item.code_matiere}
        `)
        return mots.some((mot) => champ.includes(mot))
    })
    if (datasFiltre.length === 0) {
        alert(`Aucun résultat trouvé avec la recherche "${texte}"`)
    } else {
        addTabMatiere(datasFiltre, tabImpression)
        createPagination(datasFiltre, tabImpression, divPagination)
        alert(`${datasFiltre.length} résultat(s) trouvé(s) avec la recherche "${texte}"`)
    }
}

function normalizeString(str) {
    return str
        .normalize('NFD') // décompose les lettres accentuées
        .replace(/[\u0300-\u036f]/g, '') // supprime les accents
        .replace(/[^a-z0-9\s]/gi, '') // supprime les caractères spéciaux (garde lettres, chiffres, espaces)
        .toLowerCase()
        .trim()
}

function createPagination(datas, tabImpression, divPagination, limit = 20) {
    divPagination.innerHTML = ''
    const totalPages = Math.ceil(datas.length / limit)

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button')
        btn.textContent = `Page ${i + 1}`
        btn.classList.add('pagination-btn')
        btn.addEventListener('click', () => {
            addTabMatiere(datas, tabImpression, i * limit, limit)
        })
        divPagination.appendChild(btn)
    }
}
