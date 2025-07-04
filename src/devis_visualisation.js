let datasDevis = []
let id
let tabComplements = []
const btnPDF = document.querySelector('.btnGenererPDF')

btnPDF.addEventListener('click', () => {
    const element = document.querySelector('.PDF_content')

    // Version simple - juste un petit ajustement pour l'espace
    html2pdf()
        .from(element)
        .set({
            margin: [3, 3, 3, 3],
            filename: `${datasDevis?.enregistrement_nom || 'devis'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 1.5,
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#ffffff',
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true,
            },
        })
        .save()
        .catch((error) => {
            console.error('Erreur lors de la génération du PDF:', error)
        })
})

//Appel de la base de données
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    id = params.get('id')

    if (!id) {
        console.error('Aucun identifiant fourni')
        return
    }

    fetch(`../api/devis_visualisation.php?id=${id}`)
        .then((response) => response.json())
        .then((datasFetch) => {
            console.log(datasFetch)
            datasDevis = datasFetch.infos
            console.log('datas Devis : ', datasDevis)
            tabComplements = handleComplements()
            console.log('tabCompléments : ', tabComplements)
            //Remplir tous les champs du devis
            remplirDevis()
        })
        .catch((error) => console.error('Erreur lors du chargement des données : ', error))
})

// Fonction pour remplir le devis
function remplirDevis() {
    //Pour le header
    document.querySelector('.ref_header').innerHTML = datasDevis.enregistrement_nom
    document.querySelector('.telephone_header').innerHTML = datasDevis.client_telephone
    document.querySelector('.mail_header').innerHTML = datasDevis.client_mail
    document.querySelector('.nomE_header').innerHTML = datasDevis.entreprise_nom.toUpperCase()
    document.querySelector('.nomC_header').innerHTML = datasDevis.client_nom_prenom.toUpperCase()
    document.querySelector('.adresse_header').innerHTML = datasDevis.rue.toUpperCase()
    document.querySelector('.cp_header').innerHTML = datasDevis.code_postal.toUpperCase()
    document.querySelector('.ville_header').innerHTML = datasDevis.ville.toUpperCase()
    document.querySelector('.offre-numero').innerHTML = datasDevis.enregistrement_id

    //Infos dates
    document.querySelector('.today_date').innerHTML = formatDate(datasDevis.enregistrement_date)
    document.querySelector('.nomC').innerHTML = datasDevis.client_nom_prenom

    // Informations de base
    document.querySelector('.qte_body').innerHTML = datasDevis.quantite || ''
    const nomMatiere = datasDevis.type_enregistrement === 'Feuille' ? datasDevis.nom_papier : datasDevis.nom_matiere
    document.querySelector('.matiere_body').innerHTML = nomMatiere || ''
    document.querySelector('.body_name_devis').innerHTML = datasDevis.enregistrement_nom || ''
    //En fonction du type de devis
    if (datasDevis.type_enregistrement === 'Feuille') {
        document.querySelector('.matieres_infos').style.display = 'none'
        document.querySelector('.format').innerHTML = datasDevis.format
        document.querySelector('.type_impr').innerHTML = datasDevis.type_impression
        document.querySelector('.pliage').innerHTML = datasDevis.pliage
    } else {
        document.querySelector('.feuilles_infos').style.display = 'none'
        document.querySelector('.dimension_body').innerHTML = `${datasDevis.largeur} x ${datasDevis.longueur}`
        document.querySelector('.espace_pose_body').innerHTML = datasDevis.espace_pose
        document.querySelector('.decoupe_body').innerHTML = datasDevis.decoupe
    }
    //Les désignations définies comme visibles
    const divDesignations = document.querySelector('.designations')
    tabComplements.forEach((item) => {
        if (item.visible === true) {
            const newP = document.createElement('p')
            newP.innerHTML = item.label
            divDesignations.appendChild(newP)
        }
    })

    // Prix - utilisation des vraies données
    document.querySelector('.quantite-prix').innerHTML = datasDevis.quantite || ''
    document.querySelector('.prix-ht').innerHTML = datasDevis.prix || ''
    document.querySelector('.prix-ttc').innerHTML = calculateTTC(datasDevis.prix) || ''

    //Modalité de paiement
    document.querySelector('.reglement').innerHTML = datasDevis.label_paiement || ''
}

// Fonction utilitaire pour calculer le
function calculateTTC(priceHT) {
    if (!priceHT) return 0
    return (parseFloat(priceHT) * 1.2).toFixed(2) // 20% de TVA
}

// Fonction utilitaire pour formater la date
function formatDate(dateString) {
    if (!dateString) return ''

    const date = new Date(dateString)
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    return date.toLocaleDateString('fr-FR', options)
}

function handleComplements() {
    return JSON.parse(datasDevis.designations)
}
