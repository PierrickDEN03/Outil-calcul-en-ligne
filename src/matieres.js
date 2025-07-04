import { getIdClient } from './gestion_entreprise.js'
import { getDatasDesignations, verifDesignations, getTotalPrixDesignation } from './designations.js'
import { datasDevis as datasDevisMat, devisLoaded } from './getDevisWithId.js'

// *************************************** Définition des variables
let coutTotal
let datasMatieres = []
let datasDegressif = []
let datasFrais = []
let datasDecoupe = []
let datasLamination = []
let fraisLancement
let globalPrixDecoupe
let idData
let session
let matiereChoices
const spanFraisFixe = document.querySelector('.fraix_fixe')
const spanPrixDecoupe = document.querySelector('.prix_decoupe_span')
let resultats = []
//Modif ou duplicat de devis
let idDevis
let action
//Appel de la bse de données
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    idDevis = params.get('id')
    action = params.get('modif')
    Promise.all([fetch('../api/matieres.php').then((res) => res.json()), fetch('../api/session_id.php').then((res) => res.json())])
        .then(([datasMatieresFetch, datasSessionFetch]) => {
            // ---- Données matières.php ----
            console.log(datasMatieresFetch)
            datasMatieres = datasMatieresFetch.matieres
            datasDegressif = datasMatieresFetch.degressif
            datasFrais = datasMatieresFetch.frais
            datasLamination = datasMatieresFetch.laminations
            console.log('datasLamination : ', datasLamination)
            datasDecoupe = datasMatieresFetch.decoupe

            globalPrixDecoupe = parseFloat(datasDecoupe[0].prix_decoupe)
            spanPrixDecoupe.innerHTML = globalPrixDecoupe

            fraisLancement = parseFloat(datasFrais[0].prix_frais)
            spanFraisFixe.innerHTML = `${fraisLancement}€`

            datasDegressif.sort((a, b) => a.min - b.min)
            datasMatieres.sort((a, b) => a.nom_matiere.localeCompare(b.nom_matiere))
            datasLamination.sort((a, b) => a.description.localeCompare(b.description))

            addSelectMatiereType(datasMatieres)
            addSelectLamination(datasLamination)

            // ---- Données session_id.php ----
            session = datasSessionFetch.user
            console.log('user : ', session)

            idData = datasSessionFetch.new_id
            console.log('idData : ', idData)

            devisLoaded.then(() => {
                // Traitement du devis si duplication ou modification
                if (idDevis) {
                    console.log('datas devis : ', datasDevisMat)
                    remplirCalculDevis()
                }
            })
        })
        .catch((error) => {
            console.error('Erreur lors du chargement des données :', error)
        })
})

//Query Selector pour tous les inputs
const spanCoutTotal = document.querySelector('.total_cout_matiere')

const btnCalcul = document.querySelector('.button-calcul-matieres')
btnCalcul.addEventListener('click', () => {
    console.log('designations : ', getDatasDesignations())
    inputNom.disabled = true
    spanCoutTotal.innerHTML = ''
    if (!verifDesignations(getDatasDesignations())) return
    resultats = updateCalcul(
        fraisLancement,
        datasMatieres,
        datasDegressif,
        largeur.value,
        longueur.value,
        quantite.value,
        selectMatiere.value,
        checkDecoupe_value,
        espacePose.value,
        selectLamination.value,
        getTotalPrixDesignation()
    )
})

const largeur = document.querySelector('.input-largeur')
largeur.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
})

const longueur = document.querySelector('.input-longueur')
longueur.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
})

const quantite = document.querySelector('.input-qte')
quantite.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
})

const selectMatiere = document.querySelector('.select-matiere')
selectMatiere.addEventListener('change', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
})

const selectLamination = document.querySelector('.select-lamination')
selectLamination.addEventListener('change', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
})

const espacePose = document.querySelector('.input-espace')
espacePose.addEventListener('input', () => {
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
    if (espacePose.value === '') {
        espacePose.value = 0
    }
})

const checkDecoupe = document.querySelector('.check-decoupe')
var checkDecoupe_value = checkDecoupe.value
checkDecoupe.addEventListener('change', (e) => {
    console.log('change')
    btnValidation.disabled = true
    inputNom.disabled = true
    pourcentageInput.disabled = true
    if (e.target.checked === true) {
        checkDecoupe_value = true
    } else {
        checkDecoupe_value = false
    }
})
// Ajout de l'écoute sur le clavier
checkDecoupe.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault() // Empêche le scroll, etc.
        checkDecoupe.checked = !checkDecoupe.checked
        checkDecoupe_value = checkDecoupe.checked

        // Déclenche l'événement 'change' si nécessaire
        const changeEvent = new Event('change')
        checkDecoupe.dispatchEvent(changeEvent)
    }
})

const pourcentageInput = document.querySelector('.pourcentageInput')
pourcentageInput.disabled = true
pourcentageInput.addEventListener('input', () => {
    if (isNaN(pourcentageInput.value) || parseFloat(pourcentageInput.value) < 0 || pourcentageInput.value === '') {
        pourcentageInput.value = 0
    }
    coutTotal = spanCoutTotal.textContent.replace('€', '')
    const pourcentage = 1 + parseInt(pourcentageInput.value) / 100
    const prix = coutTotal * pourcentage
    spanCoutTotal.innerHTML = `${prix.toFixed(2)}€`
})

const btnValidation = document.querySelector('.btnValiderDevis')
btnValidation.disabled = true
btnValidation.addEventListener('click', () => {
    PopupValiderEnregistrement(
        idData,
        resultats[0],
        nom_value,
        longueur.value,
        largeur.value,
        quantite.value,
        selectMatiere.value,
        espacePose.value,
        checkDecoupe_value,
        selectLamination.value,
        resultats[1],
        getIdClient()
    )
})

const inputNom = document.querySelector('.nom_devis')
var nom_value = inputNom.value
inputNom.disabled = true
inputNom.addEventListener('change', () => {
    nom_value = inputNom.value
})
// FIN QUERY SELECTOR //

//Ajoute dynamiquement les types de matiere dans le select
function addSelectMatiereType(datasMatieres) {
    const select_type = document.querySelector('.select-matiere')
    select_type.innerHTML = ''

    const options = [
        {
            value: '',
            label: '-----------',
            disabled: true,
            selected: true,
            customProperties: { prix: '' },
        },
    ]

    options.push(
        ...datasMatieres.map((matiere) => ({
            value: matiere.Id_matiere,
            label: `${matiere.nom_matiere} - Laize ${matiere.laizes}cm`,
            customProperties: {
                prix: `(${matiere.prix_mcarre}€/m²)`,
            },
        }))
    )

    // Création de l'instance Choices
    matiereChoices = new Choices(select_type, {
        removeItemButton: false,
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,

        callbackOnCreateTemplates: function (template) {
            return {
                item: (classNames, data) => {
                    const prix = data.customProperties?.prix
                    return template(`
                        <div class="${classNames.item} ${
                        data.highlighted ? classNames.highlightedState : classNames.itemSelectable
                    }" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${
                        data.disabled ? 'aria-disabled="true"' : ''
                    }>
                            ${data.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#999;font-style:italic">${prix ?? ''}</span>
                        </div>
                    `)
                },
                choice: (classNames, data) => {
                    const prix = data.customProperties?.prix
                    return template(`
                        <div class="${classNames.item} ${classNames.itemChoice}" data-select-text="" data-choice ${
                        data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'
                    } data-id="${data.id}" data-value="${data.value}" style="margin-bottom:15px; margin-left:10px">
                            ${data.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#999;font-style:italic">${prix ?? ''}</span>
                        </div>
                    `)
                },
            }
        },
    })

    // Injection des options
    matiereChoices.setChoices(options, 'value', 'label', true)
}

//Ajoute dynamiquement les types de lamination dans le select
function addSelectLamination(datasLamination) {
    //On récupère les types de matiere
    const select_type = document.querySelector('.select-lamination')
    datasLamination.forEach((lamination) => {
        //On les insère dans la balise select
        //Selecteur pour le type de lamination
        const option = document.createElement('option')
        option.value = lamination.Id_lamination
        option.innerHTML = lamination.description + ' ( Prix m² : ' + lamination.prix_lamination + ')'
        select_type.appendChild(option)
    })
}

function getCoefDegressif(datasDegressif, surface) {
    if (!Array.isArray(datasDegressif) || datasDegressif.length === 0) {
        console.warn('Données dégressives invalides ou vides.')
        return 1
    }
    let trancheMax = null
    for (const tranche of datasDegressif) {
        const min = tranche.min
        const max = tranche.max
        // Si la quantité est dans la tranche
        if (surface >= min && surface <= max) {
            console.log('✅ Tranche exacte trouvée :', `${min}-${max}`)
            return parseFloat(tranche.prix_surface)
        }
        // On garde la tranche la plus haute pour fallback
        if (!trancheMax || max > trancheMax.max) {
            trancheMax = tranche
        }
    }
    // Si aucune tranche ne correspond, on renvoie la plus grande connue
    if (trancheMax) {
        console.log('➡️ Tranche dépassée, on retourne la plus haute :', `${trancheMax.min}-${trancheMax.max}`)
        console.log('surface fonction : ', surface)
        console.log('Tranche prix :', trancheMax.prix_surface)
        return parseFloat(trancheMax.prix_surface)
    }
    console.warn('⚠️ Aucune tranche applicable trouvée pour  surface =', surface)
    return 1
}

function updateCalcul(
    fraisLancement,
    datasMatieres,
    datasDegressif,
    largeur,
    longueur,
    quantite,
    id_matiere,
    selectDecoupe,
    espacePose,
    lamination,
    prix_designations
) {
    console.clear()
    if (!largeur || !longueur) {
        alert('Veuillez renseigner les dimensions')
        return
    }
    if (!quantite || isNaN(quantite) || quantite <= 0) {
        alert('Veuillez renseigner une quantité')
        return
    }
    if (id_matiere === 'null') {
        alert('Veuillez renseigner une matière')
        return
    }

    //Détcetion de la matière
    const matiere = datasMatieres.find((m) => m.Id_matiere === parseInt(id_matiere))
    if (!matiere) {
        alert('Matière introuvable.')
        return
    }

    //Si découpe alors 2cm de chaque côté sinon 1cm de chaque côté (1cm de chaque coté + (ou pas) 2cm si découpe activées)
    let marge = selectDecoupe === true ? 2 : 0
    marge += matiere.marges
    console.log('MARGES : ', marge)
    const format_utile = matiere.laizes - 2 * marge

    if (longueur > format_utile && largeur > format_utile) {
        alert('Les dimensions renseignées sont trop grandes.')
        return
    }
    let cout1
    let cout2
    if (largeur <= format_utile) {
        console.log('------------------- CALCUL NORMAL -------------------------------')
        cout1 = calculFrais(
            fraisLancement,
            matiere,
            datasDegressif,
            largeur,
            longueur,
            quantite,
            selectDecoupe,
            format_utile,
            espacePose,
            lamination,
            prix_designations
        )
    } else {
        cout1 = null
    }
    if (longueur <= format_utile) {
        console.log('------------------- CALCUL INVERSE LONGUEUR LARGEUR-------------------------------')
        cout2 = calculFrais(
            fraisLancement,
            matiere,
            datasDegressif,
            longueur,
            largeur,
            quantite,
            selectDecoupe,
            format_utile,
            espacePose,
            lamination,
            prix_designations
        )
    } else {
        cout2 = null
    }

    if (cout1 === null && cout2 === null) {
        console.log('DIMENSIONS INCORRECTES POUR LES DEUX')
        alert('Calcul impossible à effectuer. Veuillez renseigner la pertinence des champs.')
        console.log('longueur : ', longueur)
        console.log('largeur : ', largeur)
        console.log('format utile : ', format_utile)
        return ['undefined', '']
    }
    if (cout1 === null && !isNaN(cout2)) {
        console.log(['inversé', `${cout2}€`])
        resultats = ['inversé', `${cout2}€`]
    } else if (!isNaN(cout1) && cout2 === null) {
        console.log(['normal', `${cout1}€`])
        resultats = ['normal', `${cout1}€`]
    } else {
        //Ou sinon on compare et conserve le minimum des deux calculs
        console.log('Cout 1 : ', cout1)
        console.log('Cout 2 : ', cout2)
        resultats = cout1 <= cout2 ? ['normal', `${cout1}€`] : ['inversé', `${cout2}€`]
        console.log(resultats)
    }
    btnValidation.disabled = false
    inputNom.disabled = false
    pourcentageInput.disabled = false
    pourcentageInput.value = 0
    coutTotal = resultats[1]
    spanCoutTotal.innerHTML = coutTotal
    return resultats
}

function calculFrais(
    fraisLancement,
    matiere,
    datasDegressif,
    largeur,
    longueur,
    quantite,
    selectDecoupe,
    format_utile,
    espacePose,
    laminationId,
    prix_designations
) {
    const laize = matiere.laizes
    const prixMcarre = matiere.prix_mcarre
    const espacePoseCM = espacePose / 10
    const largeurCM = parseFloat(largeur)
    const longueurCM = parseFloat(longueur)

    console.log(`Laize utile : ${format_utile} cm`)
    const largeurAvecPose = largeurCM + espacePoseCM
    let nbParLaize = Math.floor(format_utile / largeurAvecPose)
    if (nbParLaize < 1) nbParLaize = 1 //comme ça même avec un espace de pose qui ferait dépasser, ça marche quand même

    console.log(`Calcul nbParLaize : ${format_utile} / (${largeurCM} + ${espacePoseCM}) = ${nbParLaize}`)
    const nbBandes = Math.ceil(quantite / nbParLaize)
    console.log(`Calcul nbBandes : ${quantite} / ${nbParLaize} = ${nbBandes}`)

    // Surface d’une seule pièce avec espace (utile)
    const surfacePiece = (largeurCM * longueurCM) / 10000

    // Surface totale utile pour toute la quantité
    const surfacePieceTotale = surfacePiece * quantite

    // Longueur totale consommée : chaque bande a une longueur + espacePose (sauf la dernière)
    const longueurTotaleCM = (nbBandes * (longueurCM + espacePoseCM) - espacePoseCM).toFixed(4)
    console.log(`Calcul longueur totale (CM): ${nbBandes} * (${longueurCM} + ${espacePoseCM}) - ${espacePoseCM} = ${longueurTotaleCM}`)
    console.log('Longueur totale : ', longueurTotaleCM)

    // Surface totale consommée (avec perte) sur la laize
    const surfaceTotale = (laize * longueurTotaleCM) / 10000
    console.log(`Calcul surface totale : (${laize} * ${longueurTotaleCM}) / 10000 = ${surfaceTotale}`)
    console.log(`Surface totale (avec perte) : ${surfaceTotale.toFixed(4)} m²`)

    // Coefficient dégressif appliqué à la surface totale
    const prixDegressif = getCoefDegressif(datasDegressif, surfaceTotale)

    // Prix découpe (selon la surface utile réelle)
    selectDecoupe === true
        ? console.log(
              `Calcul découpe : surfacePieceTotale : ${surfacePieceTotale} * ${globalPrixDecoupe} =${
                  surfacePieceTotale * globalPrixDecoupe
              }`
          )
        : console.log('Pas de découpe')
    const prixDecoupe = selectDecoupe === true ? surfacePieceTotale * globalPrixDecoupe : 0

    // Prix lamination (selon la surface totale utilisée, pertes comprises)
    let prix_lamination = 0
    if (parseInt(laminationId) !== -1) {
        const lamination = datasLamination.find((l) => l.Id_lamination === parseInt(laminationId))
        if (!lamination) return 'Lamination introuvable.'
        prix_lamination = surfaceTotale * lamination.prix_lamination
    }
    console.log('Montant lamination : ', prix_lamination)

    // Coût matière
    console.log('Cout Matiere = prixDegressif * surfaceTotale * prixMcarre')
    console.log(`Calcul cout matiere : ${prixDegressif} * ${surfaceTotale} * ${prixMcarre}`)
    const coutMatiere = prixDegressif * surfaceTotale * prixMcarre

    return parseFloat((fraisLancement + coutMatiere + prixDecoupe + prix_lamination + prix_designations).toFixed(2))
}

function PopupValiderEnregistrement(
    id,
    verification,
    nom,
    longueur,
    largeur,
    quantite,
    idMatiere,
    espace_pose,
    selectDecoupe,
    lamination,
    prix,
    idClient
) {
    if (session !== null) {
        if (idClient === -2) {
            alert("Veuillez saisir un client correspondant à l'entreprise.")
            return
        }
        const decoupe = selectDecoupe === true ? 'Oui' : 'Non'
        if (nom.trim() === '') {
            nom = id
            if (parseInt(idClient) === -1) {
                nom = 'Simulation_' + id
            }
        } else {
            //Si le nom n'est pas vide
            if (parseInt(idClient) === -1) {
                nom = 'Simulation_' + nom
            }
        }

        const params = new URLSearchParams({
            id: id,
            nom: nom,
            longueur: verification === 'normal' ? longueur : largeur,
            largeur: verification === 'normal' ? largeur : longueur,
            quantite,
            item: idMatiere,
            espace_pose,
            decoupe,
            prix,
            idClient,
            designations: JSON.stringify(getDatasDesignations()),
            lamination,
        })

        if (action === 'modif') {
            // *********************** Modif d'un devis
            params.append('idD', idDevis)
            console.log('URL:', '../app/app.php?action=modif_devis_mat')
            console.log('Body:', params.toString())
            fetch('../app/app.php?action=modif_devis_mat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.status === 'success') {
                        const demandeVoirDevisModif = confirm('Votre devis a été modifié. Voulez-vous le visualiser ?')
                        if (demandeVoirDevisModif) {
                            const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(idDevis)}`
                            window.open(url, '_blank')
                        } else {
                            window.location.href = '../app/app.php?action=calcul_impression'
                        }
                    } else {
                        alert(data.message)
                    }
                })
                .catch((e) => {
                    alert("Une erreur s'est produite, veuillez réessayer.")
                    console.log(e)
                })
        } else {
            // ****************** Cas d'ajout normal
            const confirmation = confirm('Voulez-vous enregistrer ce devis ?')
            if (confirmation) {
                fetch('../app/app.php?action=add_matiere_data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString(),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === 'success') {
                            const idDevis = parseInt(data.idDevis)
                            console.log(data)
                            const demandeVoirDevis = confirm('Votre devis a été enregistré. Voulez-vous le visualiser ?')
                            if (demandeVoirDevis) {
                                const url = `../app/app.php?action=devis_visualisation&id=${encodeURIComponent(idDevis)}`
                                window.open(url, '_blank')
                            } else {
                                window.location.href = '../app/app.php?action=calcul_matiere'
                            }
                        } else {
                            alert(data.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        alert("Une erreur s'est produite, veuillez réessayer.")
                    })
            }
        }
    } else {
        const confirmation = confirm(
            'Vous devez être connecté pour pouvoir bénéficier de cette fonctionnalité. Appuyez sur "OK" pour afficher le formulaire de connexion.'
        )
        if (confirmation) {
            window.location.href = '../app/login.php'
        }
    }
}

//Si l'utilisateur modifie son devis ou le duplique, on recharge les infos en fonction
function remplirCalculDevis() {
    largeur.value = datasDevisMat.largeur ?? ''
    longueur.value = datasDevisMat.longueur ?? ''
    quantite.value = datasDevisMat.quantite
    selectLamination.value = datasDevisMat.Id_lamination
    selectMatiere.value = datasDevisMat.Id_matiere
    matiereChoices.setChoiceByValue(datasDevisMat.Id_matiere)
    selectMatiere.selected = selectMatiere.value
    espacePose.value = datasDevisMat.espace_pose
    if (datasDevisMat.decoupe === 'Oui') {
        checkDecoupe.checked = true
        checkDecoupe.value = true
        checkDecoupe_value = true
    } else {
        checkDecoupe.checked = false
        checkDecoupe.value = false
        checkDecoupe_value = false
    }
    if (action === 'modif') {
        btnCalcul.value = 'Refaire le calcul'
        inputNom.value = datasDevisMat.enregistrement_nom
        btnValidation.innerHTML = 'Modifier le devis'
    }

    coutTotal = datasDevisMat.prix
    spanCoutTotal.innerHTML = `${datasDevisMat.prix}€`
    resultats[1] = coutTotal
    inputNom.disabled = false
    pourcentageInput.disabled = false
    inputNom.dispatchEvent(new Event('change'))
    btnValidation.disabled = false
}
