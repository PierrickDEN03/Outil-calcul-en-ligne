import { datasDevis, devisLoaded } from './getDevisWithId.js'

const btnDevis = document.querySelector('.btnValiderDevis')
const divDesignations = document.querySelector('.designation-row')
const btnAjout = document.querySelector('.designationBtn')
let datasDesignations = []

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    const idDevis = params.get('id')
    devisLoaded.then(() => {
        if (idDevis) injectDesignationsFromDevis()
    })
})

btnAjout.addEventListener('click', () => {
    btnDevis.disabled = true
    const newIndex = datasDesignations.length
    datasDesignations.push({ label: '', prix: 0, index: newIndex, visible: true })

    //Div
    const divRow = document.createElement('div')
    divRow.classList.add('form-row')
    divRow.dataset.index = newIndex

    //Label
    const inputLabel = document.createElement('input')
    inputLabel.type = 'text'
    inputLabel.placeholder = 'Désignation...'
    inputLabel.addEventListener('change', () => {
        const index = parseInt(divRow.dataset.index)
        datasDesignations[index].label = inputLabel.value
        btnDevis.disabled = true
    })

    //Prix
    const inputPrix = document.createElement('input')
    inputPrix.type = 'number'
    inputPrix.placeholder = 'Montant (en €)'
    inputPrix.min = 0
    inputPrix.addEventListener('change', () => {
        const index = parseInt(divRow.dataset.index)
        datasDesignations[index].prix = parseFloat(inputPrix.value) || 0
        btnDevis.disabled = true
    })

    //Bouton supprimer
    const btnSuppr = document.createElement('button')
    btnSuppr.textContent = 'Retirer'
    btnSuppr.addEventListener('click', () => {
        btnDevis.disabled = true
        const index = parseInt(divRow.dataset.index)
        datasDesignations.splice(index, 1)
        divRow.remove()
        updateIndexes()
    })

    //Bouton voir ou pas voir
    const btnVoir = document.createElement('button')
    const imgEye = document.createElement('img')
    imgEye.classList.add('imgEye')
    imgEye.src = '../img/eye.png'
    imgEye.style.width = '20px'
    imgEye.style.height = '20px'
    btnVoir.appendChild(imgEye)
    btnVoir.addEventListener('click', () => {
        const index = parseInt(divRow.dataset.index)
        datasDesignations[index].visible === true ? (imgEye.src = '../img/eye_closed.png') : (imgEye.src = '../img/eye.png')
        datasDesignations[index].visible = !datasDesignations[index].visible
        btnDevis.disabled = true
        console.log(datasDesignations)
    })

    //Div contenant les boutons
    const divBtn = document.createElement('div')
    divBtn.style.display = 'flex'
    divBtn.style.flexDirection = 'column'
    divBtn.appendChild(btnSuppr)
    divBtn.appendChild(btnVoir)

    //Ajout dans le DOM
    divRow.appendChild(inputLabel)
    divRow.appendChild(inputPrix)
    divRow.appendChild(divBtn)
    divDesignations.appendChild(divRow)
})

function updateIndexes() {
    const rows = document.querySelectorAll('.designation-row .form-row')

    // Reconstruire le tableau pour correspondre aux lignes restantes
    const newDatasDesignations = []

    rows.forEach((row, i) => {
        row.dataset.index = i

        // Récupérer les valeurs actuelles des inputs
        const inputLabel = row.querySelector('input[type="text"]')
        const inputPrix = row.querySelector('input[type="number"]')
        const btnImg = row.querySelector('.imgEye')

        newDatasDesignations.push({
            label: inputLabel.value || '',
            prix: parseFloat(inputPrix.value) || 0,
            index: i,
            visible: btnImg.src === '../img/eye.png' ? true : false,
        })
    })

    datasDesignations = newDatasDesignations
}

export function getDatasDesignations() {
    return datasDesignations
}

export function verifDesignations() {
    console.log('vérif designations')
    const hasError = datasDesignations.some((item) => item.label === '' || isNaN(item.prix) || item.prix <= 0)
    if (hasError) {
        alert("Les désignations renseignées doivent contenir un label non vide ainsi qu'un prix supérieur à 0")
        return false
    }
    return true
}

export function getTotalPrixDesignation() {
    let total = 0
    datasDesignations.forEach((d) => {
        total += parseFloat(d.prix)
    })
    console.log('total désignation : ', total)
    return total
}

export function injectDesignationsFromDevis() {
    console.log('datas d devis : ', datasDevis)
    const container = document.querySelector('.designation-row')
    container.innerHTML = '' // On vide l'existant

    const designations = JSON.parse(datasDevis.designations)
    datasDesignations = [] // On reset le tableau global

    designations.forEach((item, i) => {
        // Créer une ligne .form-row
        const divRow = document.createElement('div')
        divRow.classList.add('form-row')
        divRow.dataset.index = i

        // Input label
        const inputLabel = document.createElement('input')
        inputLabel.type = 'text'
        inputLabel.value = item.label || ''
        inputLabel.addEventListener('change', () => {
            const index = parseInt(divRow.dataset.index)
            datasDesignations[index].label = inputLabel.value
            btnDevis.disabled = true
        })

        // Input prix
        const inputPrix = document.createElement('input')
        inputPrix.type = 'number'
        inputPrix.value = item.prix ?? 0
        inputPrix.addEventListener('change', () => {
            const index = parseInt(divRow.dataset.index)
            datasDesignations[index].prix = parseFloat(inputPrix.value) || 0
            btnDevis.disabled = true
        })

        //Bouton supprimer
        const btnSuppr = document.createElement('button')
        btnSuppr.textContent = 'Retirer'
        btnSuppr.addEventListener('click', () => {
            btnDevis.disabled = true
            const index = parseInt(divRow.dataset.index)
            datasDesignations.splice(index, 1)
            divRow.remove()
            updateIndexes()
        })

        //Bouton voir ou pas voir
        const btnVoir = document.createElement('button')
        const imgEye = document.createElement('img')
        imgEye.className = 'imgEye'
        imgEye.style.width = '20px'
        imgEye.style.height = '20px'
        imgEye.src = item.visible ? '../img/eye.png' : '../img/eye_closed.png'
        btnVoir.appendChild(imgEye)
        btnVoir.addEventListener('click', () => {
            const index = parseInt(divRow.dataset.index)
            datasDesignations[index].visible === true ? (imgEye.src = '../img/eye_closed.png') : (imgEye.src = '../img/eye.png')
            datasDesignations[index].visible = !datasDesignations[index].visible
            btnDevis.disabled = true
            console.log(datasDesignations)
        })

        //Div contenant les boutons
        const divBtn = document.createElement('div')
        divBtn.style.display = 'flex'
        divBtn.style.flexDirection = 'column'
        divBtn.appendChild(btnSuppr)
        divBtn.appendChild(btnVoir)

        // Append les éléments à la ligne
        divRow.appendChild(inputLabel)
        divRow.appendChild(inputPrix)
        divRow.appendChild(divBtn)

        // Ajouter la ligne au container
        container.appendChild(divRow)

        // Mettre à jour datasDesignations en même temps
        datasDesignations.push({
            label: item.label || '',
            prix: parseFloat(item.prix) || 0,
            index: i,
            visible: !!item.visible,
        })
    })
}
