// Définition des variables
let datasImpressions = []
let datasDegressif = []

const tabImpression = document.querySelector('.table_matiere')
const tabDegressif = document.querySelector('.table_degressif')
const btnAddImpr = document.querySelector('.btnAdd')
const btnAddPalier = document.querySelector('.btnAddPalier')

window.addEventListener('DOMContentLoaded', () => {
    //Récupération des éléments de la tables impressions
    fetch('../api/impressions.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datasImpressions = datasFetch.impressions
            datasDegressif = datasFetch.degressif

            datasImpressions.sort((a, b) => a.nom_papier.localeCompare(b.nom_papier))
            datasDegressif.sort((a, b) => a.min - b.min)

            addTabMatiere(datasImpressions, tabImpression)
            addTabDegressif(datasDegressif, tabDegressif)
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

btnAddImpr.addEventListener('click', addImpression)
btnAddPalier.addEventListener('click', addDegImpr)

function addTabMatiere(datasImpressions, tabImpression) {
    datasImpressions.forEach((impression) => {
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
