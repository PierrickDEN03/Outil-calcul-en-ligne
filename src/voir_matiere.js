let datasMatieres = []
let datasDegressif = []
let datasFrais = []
let datasDecoupe = []
let datasLamination = []

const tabMatieres = document.querySelector('.table_matiere')
const tabDegressif = document.querySelector('.table_degressif')
const btnAddMat = document.querySelector('.btnAdd')
const btnAddPalier = document.querySelector('.btnAddPalier')
let inputFrais = document.querySelector('.fraisFixe')
let inputDecoupe = document.querySelector('.prix_decoupe')
let btnFrais = document.querySelector('.submit_frais')
let btnDecoupe = document.querySelector('.submit_decoupe')
// **************** Pour les laminations
let inputDescriptionLamination = document.querySelector('.label_lamination')
let inputPrixLamination = document.querySelector('.prix_lamination')
let selectLamination = document.querySelector('.select_lamination')
selectLamination.addEventListener('change', () => {
    if (selectLamination.value === 'new') {
        divAddLamination.style.display = 'block'
        divModifLamination.style.display = 'none'
        inputDescriptionLamination.value = ''
        inputPrixLamination.value = 0
    } else {
        divAddLamination.style.display = 'none'
        divModifLamination.style.display = 'block'
        console.log(datasLamination)

        const lamination = datasLamination.find((lamination) => parseInt(lamination.Id_lamination) === parseInt(selectLamination.value))
        console.log(lamination)
        inputDescriptionLamination.value = lamination.description
        inputPrixLamination.value = lamination.prix_lamination
    }
})

// ** nouvelle lamination
let divAddLamination = document.querySelector('.div_add_lamination')
let btnAddLamination = document.querySelector('.add_lamination')
btnAddLamination.addEventListener('click', (e) => addLamination(e))

// ** modif lamination
let divModifLamination = document.querySelector('.div_modif_lamination')
let btnModifLamination = document.querySelector('.modif_lamination')
let btnSupprLamination = document.querySelector('.suppr_lamination')
btnModifLamination.addEventListener('click', (e) => modifLamination(e))
btnSupprLamination.addEventListener('click', (e) => supprimerLamination(e))

window.addEventListener('DOMContentLoaded', () => {
    //Récupération des éléments de la table matieres
    fetch('../api/matieres.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datasMatieres = datasFetch.matieres
            datasDegressif = datasFetch.degressif
            datasFrais = datasFetch.frais[0]
            datasDecoupe = datasFetch.decoupe[0]
            datasLamination = datasFetch.laminations
            console.log('laminations : ', datasLamination)
            console.log(datasFrais)
            console.log(datasFrais.prix_frais)
            inputFrais.value = datasFrais.prix_frais
            inputDecoupe.value = datasDecoupe.prix_decoupe

            datasMatieres.sort((a, b) => a.nom_matiere.localeCompare(b.nom_matiere))
            datasDegressif.sort((a, b) => a.min - b.min)

            addTabMatieres(datasMatieres, tabMatieres)
            addTabDegressif(datasDegressif, tabDegressif)
            addSelectLamination(datasLamination, selectLamination)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

btnAddMat.addEventListener('click', addMatiere)
btnAddPalier.addEventListener('click', addDegressif)

function addTabMatieres(datasMatieres, tab) {
    datasMatieres.forEach((matiere) => {
        const tr = document.createElement('tr')

        const tdId = document.createElement('td')
        tdId.textContent = matiere.Id_matiere

        const tdNom = document.createElement('td')
        const inputNom = document.createElement('input')
        inputNom.type = 'text'
        inputNom.value = matiere.nom_matiere
        inputNom.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdNom.appendChild(inputNom)

        const tdCode = document.createElement('td')
        const inputCode = document.createElement('input')
        inputCode.type = 'text'
        inputCode.value = matiere.code_matiere
        inputCode.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdCode.appendChild(inputCode)

        const tdPrix = document.createElement('td')
        const inputPrix = document.createElement('input')
        inputPrix.type = 'number'
        inputPrix.step = '0.01'
        inputPrix.value = matiere.prix_mcarre
        inputPrix.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdPrix.appendChild(inputPrix)

        const tdType = document.createElement('td')
        const inputType = document.createElement('input')
        inputType.type = 'text'
        inputType.value = matiere.type_matiere
        inputType.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdType.appendChild(inputType)

        const tdLaize = document.createElement('td')
        const inputLaize = document.createElement('input')
        inputLaize.type = 'number'
        inputLaize.value = matiere.laizes
        inputLaize.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdLaize.appendChild(inputLaize)

        const tdActions = document.createElement('td')
        const btnModif = document.createElement('button')
        btnModif.textContent = 'Confirmer les modifications'
        btnModif.style.display = 'none'
        btnModif.classList.add('btn-modif')
        btnModif.addEventListener('click', () => {
            const id = matiere.Id_matiere
            const nom = inputNom.value.trim()
            const code = inputCode.value.trim()
            const prix = parseFloat(inputPrix.value)
            const type = inputType.value.trim()
            const laize = parseInt(inputLaize.value)

            const isValid = nom && code && type && !isNaN(prix) && prix > 0 && !isNaN(laize) && laize > 0

            if (isValid) {
                const url = `../app/app.php?action=modif_matiere&id=${id}&nom=${encodeURIComponent(nom)}&code=${encodeURIComponent(
                    code
                )}&prix=${prix}&type=${encodeURIComponent(type)}&laize=${laize}`
                window.location.href = url
            } else {
                alert('Tous les champs doivent être valides et non vides.')
            }
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
                const url = `../app/app.php?action=suppr_matiere&id=${matiere.Id_matiere}`
                window.location.href = url
            }
        })

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnSuppr)

        tr.appendChild(tdId)
        tr.appendChild(tdNom)
        tr.appendChild(tdType)
        tr.appendChild(tdLaize)
        tr.appendChild(tdPrix)
        tr.appendChild(tdCode)
        tr.appendChild(tdActions)

        tab.appendChild(tr)
    })
}

function addTabDegressif(datasDegressif, tab) {
    datasDegressif.forEach((palier) => {
        const tr = document.createElement('tr')

        const tdMin = document.createElement('td')
        const inputMin = document.createElement('input')
        inputMin.type = 'number'
        inputMin.min = 0
        inputMin.value = palier.min
        inputMin.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdMin.appendChild(inputMin)

        const tdMax = document.createElement('td')
        const inputMax = document.createElement('input')
        inputMax.type = 'number'
        inputMax.min = 0
        inputMax.value = palier.max
        inputMax.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdMax.appendChild(inputMax)

        const tdPrix = document.createElement('td')
        const inputPrix = document.createElement('input')
        inputPrix.type = 'number'
        inputPrix.min = 0
        inputPrix.step = '0.01'
        inputPrix.value = palier.prix_surface
        inputPrix.addEventListener('input', () => {
            btnModif.style.display = 'block'
        })
        tdPrix.appendChild(inputPrix)

        const tdActions = document.createElement('td')
        const btnModif = document.createElement('button')
        btnModif.textContent = 'Confirmer les modifications'
        btnModif.style.display = 'none'
        btnModif.classList.add('btn-modif')
        btnModif.addEventListener('click', () => {
            const id = palier.Id_deg_matiere
            const min = parseInt(inputMin.value)
            const max = parseInt(inputMax.value)
            const prix = parseFloat(inputPrix.value)

            const isValid = !isNaN(min) && !isNaN(max) && !isNaN(prix) && min >= 0 && max >= min && prix > 0

            if (isValid) {
                const url = `../app/app.php?action=modif_deg_matiere&id=${id}&min=${min}&max=${max}&prix=${prix}`
                window.location.href = url
            } else {
                alert('Tous les champs doivent être remplis correctement.\n- Min ≤ Max\n- Prix > 0')
            }
        })

        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Supprimer'
        btnSuppr.classList.add('btn-suppr')
        btnSuppr.addEventListener('click', () => {
            const id = palier.Id_deg_matiere
            if (confirm('Êtes-vous sûr de vouloir supprimer ce palier ?')) {
                const url = `../app/app.php?action=suppr_deg_matiere&id=${id}`
                window.location.href = url
            }
        })

        tdActions.appendChild(btnModif)
        tdActions.appendChild(btnSuppr)

        tr.appendChild(tdMin)
        tr.appendChild(tdMax)
        tr.appendChild(tdPrix)
        tr.appendChild(tdActions)

        tab.appendChild(tr)
    })
}

function addSelectLamination(datasLamination, selectLamination) {
    datasLamination.forEach((lamination) => {
        const option = document.createElement('option')
        option.value = lamination.Id_lamination
        option.innerHTML = lamination.description
        selectLamination.appendChild(option)
    })
}

function addMatiere() {
    const nom = document.getElementById('newNom').value.trim()
    console.log(nom)
    const code = document.getElementById('newCode').value.trim() !== '' ? document.getElementById('newCode').value.trim() : genererCode(nom)
    if (code === null) return alert('Veuillez remplir correctement le nom (ex : Exemple 42g)')
    const prix = parseFloat(document.getElementById('newMcarre').value.trim())
    const type = document.getElementById('newType').value.trim()
    const laize = parseInt(document.getElementById('newLaize').value.trim())

    if (nom && type && !isNaN(prix) && prix > 0 && !isNaN(laize) && laize > 0) {
        const url = `../app/app.php?action=add_matiere&nom=${encodeURIComponent(nom)}&code=${encodeURIComponent(
            code
        )}&prix=${prix}&type=${encodeURIComponent(type)}&laize=${laize}`
        window.location.href = url
    } else {
        alert('Veuillez remplir correctement tous les champs de la matière.')
    }
}

function addDegressif() {
    const min = parseInt(document.getElementById('newMin').value.trim())
    const max = parseInt(document.getElementById('newMax').value.trim())
    const prix = parseFloat(document.getElementById('newCoeff').value.trim())

    if (!isNaN(min) && !isNaN(max) && !isNaN(prix) && min > 0 && max >= min && prix > 0) {
        const url = `../app/app.php?action=add_deg_matiere&min=${min}&max=${max}&prix=${prix}`
        window.location.href = url
    } else {
        alert('Veuillez remplir correctement tous les champs du palier dégressif.')
    }
}

function genererCode(nomComplet) {
    const match = nomComplet.match(/^(.+?)\s+(\d+)\s*g$/i)

    if (!match) {
        console.error("Format invalide. Attendu : 'Nom 135g'")
        return null
    }

    const nom = match[1].trim()
    const grammage = match[2]

    const lettres = nom.replace(/\s+/g, '').substring(0, 5).toUpperCase() // Enlève les espaces, prend les 5 premières lettres
    const code = lettres + grammage

    console.log('Code généré :', code)
    return code
}

//EVENT LISTENER POUR LE BTN DE MODIF DE FRAIS
btnFrais.addEventListener('click', (e) => {
    e.preventDefault()
    if (parseFloat(inputFrais.value) <= 0 || isNaN(parseFloat(inputFrais.value))) {
        alert('Veuillez saisir un frais fixe correct.')
        return
    }

    let frais = inputFrais.value
    let id = datasFrais.Id_frais
    const url = `../app/app.php?action=modif_frais&id=${encodeURIComponent(id)}&frais=${encodeURIComponent(frais)}`
    window.location.href = url
})

//EVENT LISTENER POUR LE BTN DE MODIF DE PRIX DE DECOUPE
btnDecoupe.addEventListener('click', (e) => {
    e.preventDefault()
    if (parseFloat(inputDecoupe.value) <= 0 || isNaN(parseFloat(inputDecoupe.value))) {
        alert('Veuillez saisir un prix de découpe correct.')
        return
    }

    let decoupe = inputDecoupe.value
    let id = datasDecoupe.Id_decoupe
    const url = `../app/app.php?action=modif_decoupe&id=${encodeURIComponent(id)}&prix_decoupe=${encodeURIComponent(decoupe)}`
    window.location.href = url
})

/* ============================= LAMINATIONS ======================================== */
function addLamination(e) {
    e.preventDefault()
    const description = inputDescriptionLamination.value
    const prix = inputPrixLamination.value
    if (description === '' || isNaN(prix) || prix <= 0) {
        alert('Veuillez renseigner une description et un prix corrects')
        return
    }
    const url = `../app/app.php?action=add_lamination&prixL=${encodeURIComponent(prix)}&descriptionL=${encodeURIComponent(description)}`
    window.location.href = url
}
function modifLamination(e) {
    e.preventDefault()
    const id = selectLamination.value
    const description = inputDescriptionLamination.value
    const prix = inputPrixLamination.value
    if (description === '' || isNaN(prix) || prix <= 0) {
        alert('Veuillez renseigner une description et un prix corrects')
        return
    }
    const url = `../app/app.php?action=modif_lamination&idL=${encodeURIComponent(id)}&prixL=${encodeURIComponent(
        prix
    )}&descriptionL=${encodeURIComponent(description)}`
    window.location.href = url
}
function supprimerLamination(e) {
    e.preventDefault()
    if (confirm('Êtes-vous sûr de vouloir supprimer cette lamination ?')) {
        const id = selectLamination.value
        const url = `../app/app.php?action=suppr_lamination&idL=${id}`
        window.location.href = url
    }
}
