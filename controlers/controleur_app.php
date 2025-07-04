<?php
    class Appli{
        private $tbs;

        function __construct ($param_tbs){
            $this->tbs=$param_tbs;
        }

        public function voirMatiere(){
             require("../utils/session.php");
            $this->tbs->LoadTemplate("../templates/voir_matiere.html");
            $this->tbs->Show();
        }

        public function voirImpression(){
             require("../utils/session.php");
            $this->tbs->LoadTemplate("../templates/voir_impression.html");
            $this->tbs->Show();
        }

        public function modifEffectueeImpr(){
            header("Location:./app.php?action=voir_impression");
        }

        public function ajoutEffectueeImpr(){
            header("Location:./app.php?action=voir_impression");
        }

        public function suprEffectueeImpr(){
            header("Location:./app.php?action=voir_impression");
        }

        public function modifEffectueeMat(){
            header("Location:./app.php?action=voir_matiere");
        }

        public function suprEffectueeMatiere(){
           header("Location:./app.php?action=voir_matiere");
        }

        public function suprEffectueeMat(){
            header("Location:./app.php?action=voir_matiere");
        }

        public function ajoutEffectueeMatiere(){
            header("Location:./app.php?action=voir_matiere");
        }

        public function calculImpression(){
             require("../utils/session.php");
            $this->tbs->LoadTemplate("../templates/calcul_impression.html");
            $this->tbs->Show();
        }  
    
        public function calculMatiere(){
             require("../utils/session.php");
            $this->tbs->LoadTemplate("../templates/calcul_matiere.html");
            $this->tbs->Show();
        } 
        
        public function loadBackoffice(){
            require("../utils/session.php");
            $this->tbs->LoadTemplate("../templates/backoffice.html");
            $this->tbs->Show();
        }  

        public function voirDatas(){
            require("../utils/session.php");
            $this->tbs->LoadTemplate("../templates/voir_datas.html");
            $this->tbs->Show();
        }  

        public function modifEffectueeDatas(){
            header("Location:./app.php?action=voir_enregistrement");
        }

        public function suprEffectueeDatas(){
            header("Location:./app.php?action=voir_enregistrement");
        }

        public function voirDetails(){
            $this->tbs->LoadTemplate("../templates/voir_details_entreprise.html");
            $this->tbs->Show();
        }

        public function modifEffectueeClient(){
            $this->tbs->LoadTemplate("../templates/modif_effectuee_clients.html");
            $this->tbs->Show();
        }

        public function suprEffectueeClient(){
            $this->tbs->LoadTemplate("../templates/supr_effectuee_client.html");
            $this->tbs->Show();
        }

        public function ajoutEffectueeClient(){
            $this->tbs->LoadTemplate("../templates/add_client.html");
            $this->tbs->Show();
        }

        public function voirEntreprises(){
            $this->tbs->LoadTemplate("../templates/voir_entreprises.html");
            $this->tbs->Show();
        }

        public function modifEffectueeEntreprises(){
            header("Location:./app.php?action=voir_entreprise");
        }

        public function ajoutEffectueeEntreprise(){
            header("Location:./app.php?action=voir_entreprise");
        }

        public function suprEffectueeEntreprise(){
            header("Location:./app.php?action=voir_entreprise");
        }

        public function retourDetails($id){
            header("Location: ../templates/voir_details_entreprise.html?id=$id");
            exit();
        }

        public function voirPDF($id){
            header("Location: ../templates/data_visualisation.html?id=$id");
            exit();
        }

        public function moteur($acc_datasImpr,$acc_datasMatiere, $acc_datasEnr,$acc_client,$acc_entreprise, $acc_adresses){
            if (isset($_GET["action"])){
                $action=$_GET["action"];
            }else{
                if (isset($_POST["action"])){
                    $action=$_POST["action"];
                }else{
                    $action="";
                }
            }  
            switch ($action){                   //En cas d'exception, l'utilisateur est renvoyé sur la page de l'application
                case "calcul_matiere" : 
                    $this->calculMatiere();
                break;
                case "calcul_impression" : 
                    $this->calculImpression();
                break;  
                case "backoffice" : 
                    if(!empty($_SESSION['Pseudo'])){
                        $this->loadBackoffice();
                    }else{
                        header("Location:./login.php");
                    }  
                break; 
                case "voir_matiere" : 
                    if(!empty($_SESSION['Pseudo'])){
                        $this->voirMatiere();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_impression" : 
                    if(!empty($_SESSION['Pseudo'])){
                        $this->voirImpression();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_enregistrement" : 
                    if(!empty($_SESSION['Pseudo'])){
                        $this->voirDatas();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_details_entreprise" : 
                    if(!empty($_SESSION['Pseudo'])){
                        $this->voirDetails();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_entreprise" : 
                    if(!empty($_SESSION['Pseudo'])){
                        $this->voirEntreprises();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                
                /* *************************POUR LES IMPRESSIONS ***************************************** */
                case "modif_impression" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["nom"]) && !empty($_GET["grammage"]) && !empty($_GET["code"]) && !empty($_GET["recto"]) && !empty($_GET["recto_verso"])){
                                $acc_datasImpr->modifImpression($_GET["id"],$_GET["nom"],$_GET["grammage"],$_GET["code"],$_GET["recto"],$_GET["recto_verso"]);
                                $this->modifEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch(Exception $e){
                            $this->voirImpression();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "suppr_impression" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
                                $acc_datasImpr->supprimerImpression($_GET["id"]);
                                $this->suprEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch(Exception $e){
                            $this->voirImpression();
                        }       
                        
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "suppr_deg_impr" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
                                $acc_datasImpr->supprimerDegImpr($_GET["id"]);
                                $this->suprEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch (Exception $e){
                            $this->voirImpression();
                        }  
                    }else{
                        header("Location:./login.php");
                    } 
                break;
                case "modif_deg_impr" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["min"]) && !empty($_GET["max"]) && !empty($_GET["prix"])){
                                $acc_datasImpr->modifDegImpr($_GET["id"],$_GET["min"],$_GET["max"],$_GET["prix"]);
                                $this->modifEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch(Exception $e){
                            $this->voirImpression();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "add_impression" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["nom"]) && !empty($_GET["grammage"]) && !empty($_GET["code"]) && !empty($_GET["recto"]) && !empty($_GET["recto_verso"])){
                                $acc_datasImpr->addImpression($_GET["nom"],$_GET["grammage"],$_GET["code"],$_GET["recto"],$_GET["recto_verso"]);
                                $this->ajoutEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch(Exception $e){
                            $this->voirImpression();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
                case "add_deg_impr" : 
                    try{
                        if(!empty($_SESSION['Pseudo'])){
                            if(!empty($_GET["min"]) && !empty($_GET["max"]) && !empty($_GET["prix"])){
                                $acc_datasImpr->addDegImpr($_GET["min"],$_GET["max"],$_GET["prix"]);
                                $this->ajoutEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }else{
                            header("Location:./login.php");
                        }
                    }catch(Exception $e){
                        $this->voirImpression();
                    }         
                break;
            case "modif_frais_impr" : 
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && isset($_GET["frais"])){
                                $acc_datasImpr->modifFrais($_GET["id"],$_GET["frais"]);
                                $this->modifEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->voirImpression();
                        }       
                    }else{
                        header("Location:./login.php");
                    }    
                break;
            case "modif_infos_pliage" : 
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && isset($_GET["frais"]) && isset($_GET["prixPliage"])){
                                $acc_datasImpr->modifPliage($_GET["id"],$_GET["frais"],$_GET["prixPliage"]);
                                $this->modifEffectueeImpr();
                            }else{
                                $this->voirImpression();
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->voirImpression();
                        }       
                    }else{
                        header("Location:./login.php");
                    }    
                break;
            /* *************************POUR LES MATIERES ***************************************** */
            case "modif_decoupe" : 
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && isset($_GET["prix_decoupe"])){
                                $acc_datasMatiere->modifDecoupe($_GET["id"],$_GET["prix_decoupe"]);
                                $this->modifEffectueeMat();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->voirMatiere();
                        }       
                    }else{
                        header("Location:./login.php");
                    }    
                break;
            case "modif_frais" : 
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && isset($_GET["frais"])){
                                $acc_datasMatiere->modifFrais($_GET["id"],$_GET["frais"]);
                                $this->modifEffectueeMat();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->voirMatiere();
                        }       
                    }else{
                        header("Location:./login.php");
                    }    
                break;
            case "modif_matiere" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["nom"]) && !empty($_GET["code"]) && !empty($_GET["prix"]) && !empty($_GET["type"]) && !empty($_GET["laize"]) && isset($_GET["marges"])){
                                $acc_datasMatiere->modifMatiere($_GET["id"],$_GET["nom"],$_GET["code"],$_GET["prix"],$_GET["type"],$_GET["laize"], $_GET["marges"]);
                                $this->modifEffectueeMat();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->voirMatiere();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "suppr_matiere" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
                                $acc_datasMatiere->supprimerMatiere($_GET["id"]);
                                $this->suprEffectueeMatiere();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->voirMatiere();
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
                case "suppr_deg_matiere" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
                                $acc_datasMatiere->supprimerDegMatiere($_GET["id"]);
                                $this->suprEffectueeMat();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->voirMatiere();
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
                case "modif_deg_matiere" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) &&  isset($_GET["min"]) && $_GET["min"] !== "" && !empty($_GET["max"]) && !empty($_GET["prix"])){
                                $acc_datasMatiere->modifDegMatiere($_GET["id"],$_GET["min"],$_GET["max"],$_GET["prix"]);
                                $this->modifEffectueeMat();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->voirMatiere();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "add_matiere" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["nom"]) && !empty($_GET["code"]) && !empty($_GET["prix"]) && !empty($_GET["type"]) && !empty($_GET["laize"] && isset($_GET["marges"]))){
                                $acc_datasMatiere->addMatiere($_GET["nom"],$_GET["code"],$_GET["prix"],$_GET["type"],$_GET["laize"], $_GET["marges"]);
                                $this->ajoutEffectueeMatiere();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->voirMatiere();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
                case "add_deg_matiere" : 
                    try{
                        if(!empty($_SESSION['Pseudo'])){
                            if(!empty($_GET["min"]) && !empty($_GET["max"]) && !empty($_GET["prix"])){
                                $acc_datasMatiere->addDegMatiere($_GET["min"],$_GET["max"],$_GET["prix"]);
                                $this->ajoutEffectueeMatiere();
                            }else{
                                $this->voirMatiere();
                            }
                        }else{
                           header("Location:./login.php"); 
                        }
                    }catch(Exception $e){
                        $this->voirMatiere();
                    }           
                break;
                case "add_lamination" : 
                    if(!empty($_SESSION['Pseudo'])){
                            try{
                                if(!empty($_GET["prixL"]) && !empty($_GET["descriptionL"])){
                                    $acc_datasMatiere->addLamination($_GET["descriptionL"],$_GET["prixL"]);
                                    $this->ajoutEffectueeMatiere();
                                }else{
                                    $this->voirMatiere();
                                }
                            }catch(Exception $e){
                                echo$e;
                                $this->voirMatiere();
                            }       
                        }else{
                            header("Location:./login.php");
                        }    
                break;
                case "modif_lamination" : 
                    if(!empty($_SESSION['Pseudo'])){
                            try{
                                if(!empty($_GET["prixL"]) && !empty($_GET["descriptionL"]) && !empty($_GET["idL"])){
                                    $acc_datasMatiere->modifLamination($_GET["idL"],$_GET["descriptionL"],$_GET["prixL"]);
                                    $this->modifEffectueeMat();
                                }else{
                                    $this->voirMatiere();
                                }
                            }catch(Exception $e){
                                echo$e;
                                $this->voirMatiere();
                            }       
                        }else{
                            header("Location:./login.php");
                        }    
                break;
                case "suppr_lamination" : 
                    if(!empty($_SESSION['Pseudo'])){
                            try{
                                if(!empty($_GET["idL"])){
                                    $acc_datasMatiere->supprimerLamination($_GET["idL"]);
                                    $this->suprEffectueeMat();
                                }else{
                                    $this->voirMatiere();
                                }
                            }catch(Exception $e){
                                echo$e;
                                $this->voirMatiere();
                            }       
                        }else{
                            header("Location:./login.php");
                        }    
                break;
            /* ************************* POUR LES DATAS ***************************************** */
            //On rajoute des données à partir des impressions (feuilles)
            case "add_impr_data" : 
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            if((!empty($_POST["id"])) && (!empty($_POST["nom"])) && !empty($_POST["format"]) && (!empty($_POST["nbImpression"])) && (!empty($_POST["item"]) && (!empty($_POST["recto"]))) && (!empty($_POST["prix"])) && (!empty($_POST["pliage"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"])){
                                $date = date('Y-m-d');
                                if($acc_datasEnr->verifNom($_POST["nom"],-1) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $acc_datasEnr->addDatas($_POST["id"], $_POST["nom"],$date,"Feuille",$_POST["nbImpression"],$_POST["prix"],"","",-1,$_POST["item"],"","",$_POST["format"],$_POST["recto"], $_POST["pliage"], $_POST["idClient"],$_POST["designations"],-1);
                                $idDevis = $acc_datasEnr->getLastId();
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données enregistrées avec succès.',
                                    'idDevis' => $idDevis
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Certains champs sont manquants.'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'error',
                                    'message' => $e
                                ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "add_matiere_data" :
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            if((!empty($_POST["id"])) && (!empty($_POST["nom"])) && !empty($_POST["longueur"]) && (!empty($_POST["largeur"])) && (!empty($_POST["quantite"])) && (!empty($_POST["item"])) && (isset($_POST["espace_pose"])) && (!empty($_POST["decoupe"])) && (!empty($_POST["prix"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"]) && isset($_POST["lamination"])){
                                $date = date('Y-m-d');
                                if($acc_datasEnr->verifNom($_POST["nom"],-1) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $acc_datasEnr->addDatas($_POST["id"],$_POST["nom"],$date,"Matière",$_POST["quantite"],$_POST["prix"],$_POST["longueur"],$_POST["largeur"],$_POST["item"],-1,$_POST["espace_pose"],$_POST["decoupe"],"","","",$_POST["idClient"],$_POST["designations"],$_POST["lamination"]);
                                $idDevis = $acc_datasEnr->getLastId();
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données enregistrées avec succès.',
                                    'idDevis' => $idDevis
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Certains champs sont manquants.'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'error',
                                    'message' => $e
                                ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_data" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["id"]) && (!empty($_GET["nom"]))){
                                $acc_datasEnr->modifDatas($_GET["id"],$_GET["nom"]);
                                $this->modifEffectueeDatas();
                            }else{
                                $this->voirDatas();
                            }
                        }catch(Exception $e){
                            $this->voirDatas();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "suppr_data" :
                    //A comparer avec suppr_data_devis
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
                                $acc_datasEnr->supprimerDatas($_GET["id"]);
                                $this->suprEffectueeDatas();
                            }else{
                                $this->voirDatas();
                            }
                        }catch(Exception $e){
                            $this->voirDatas();
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
                case "devis_visualisation" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = $_GET['id'];
                                $this->voirPDF($id);
                            }else{
                                $this->voirDatas();
                            }
                        }catch(Exception $e){
                            $this->voirDatas();
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
                
            /* ************************* POUR LES ENTREPRISES ***************************************** */
            case "get_infos_clients_entreprises" : 
                if(!empty($_SESSION['Pseudo'])  || $_POST["ia"] === "true"){
                    try{
                        if(!empty($_POST["idClient"]) && (!empty($_POST["idEntreprise"]))){
                            $nomClient = $acc_client->getClientWithIdClient($_POST["idClient"]);
                            $nomEntreprise = $acc_entreprise->getNomEntrepriseWithId($_POST["idEntreprise"]);
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Noms récupérés avec succès',
                                'nomClient' => $nomClient,
                                'nomEntreprise' => $nomEntreprise 
                            ]);
                            exit;
                        }else{
                            echo json_encode([
                                'status' => 'error',
                                'message' => 'Champ(s) manquant(s)',
                            ]);
                            exit;
                        }
                    }catch(Exception $e){
                        echo json_encode([
                            'status' => 'success',
                            'message' => 'Champ(s) manquant(s)',
                        ]);
                        exit;
                    }     
                }else{
                    header("Location:./login.php");
                }
            break;
            case "modif_entreprise" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["idE"]) && (!empty($_GET["nom"])) && (!empty($_GET["rue"])) && (!empty($_GET["cp"])) && (!empty($_GET["ville"])) && (!empty($_GET["idA"]))){
                                $acc_entreprise->modifEntrepriseNom($_GET["idE"],$_GET["nom"]);
                                $acc_adresses->modifAdresse(intval($_GET["idA"]),1,$_GET["rue"],$_GET["cp"],$_GET["ville"],intval($_GET["idE"]));
                                $this->modifEffectueeEntreprises();
                            }else{
                                $this->voirEntreprises();
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->voirEntreprises();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "suppr_entreprise" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
                                $acc_entreprise->supprimerEntreprise($_GET["id"]);
                                $this->suprEffectueeEntreprise();
                            }else{
                                $this->voirEntreprises();
                            }
                        }catch(Exception $e){
                            $this->voirEntreprises();
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
            case "ajouter_entreprise_client" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_GET["nomEntreprise"]) && isset($_GET["siretEntreprise"]) 
                            && isset($_GET["mailEntreprise"]) && isset($_GET["telephoneEntreprise"]) && isset($_GET["mpaiement"])
                            && isset($_GET["rueEntreprise"]) 
                            && isset($_GET["codePostalEntreprise"]) && isset($_GET["villeEntreprise"]) && isset($_GET["nomPrenomClient"]) 
                            && isset($_GET["mailClient"]) && isset($_GET["telephoneClient"]) && isset($_GET["fixeClient"])){
                                $acc_entreprise->addEntreprise($_GET["nomEntreprise"],$_GET["mailEntreprise"],$_GET["telephoneEntreprise"],$_GET["siretEntreprise"], $_GET["mpaiement"]);
                                //Il faut maintenant récupérer l'id de l'entreprise créée
                                $idEntreprise=$acc_entreprise->getLastId();
                                $acc_adresses->addAdresse(1,$_GET["rueEntreprise"],$_GET["codePostalEntreprise"],$_GET["villeEntreprise"],$idEntreprise);
                                $idAdresse=$acc_adresses->getLastId();
                                $acc_client->addClient($_GET["nomPrenomClient"],$_GET["mailClient"],$_GET["telephoneClient"],$_GET["fixeClient"],$idEntreprise,1,$idAdresse);
                                $this->ajoutEffectueeEntreprise();
                            }else{

                                $this->voirEntreprises();
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->voirEntreprises();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            /* ************************* POUR LES DETAILS ENTREPRISES ***************************************** */
            case "modif_infos_generales":
                if(!empty($_SESSION['Pseudo'])){
                        try{
                            //On modifie les infos générales
                            if(!empty($_POST["id"]) && (!empty($_POST["nomEntreprise"])) && (isset($_POST["mailEntreprise"])) && (isset($_POST["telEntreprise"])) && (isset($_POST["siret"])) && (!empty($_POST["paiement"]))){
                                $acc_entreprise->modifInfosGenerales($_POST["id"],$_POST["nomEntreprise"],$_POST["mailEntreprise"],$_POST["telEntreprise"],$_POST["siret"],$_POST["paiement"]);
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => "Champ(s) manquant(s) concernant les informations générales"
                                ]);
                                exit;
                            }
                            
                            //On modifie l'adresse
                            if(isset($_POST["rue"]) && (isset($_POST["cp"])) && (isset($_POST["ville"])) && (!empty($_POST["id"])) && (!empty($_POST["idAdresse"]))){
                                $acc_adresses->modifAdresse($_POST["idAdresse"],1,$_POST["rue"],$_POST["cp"],$_POST["ville"],$_POST["id"]);
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => "Champ(s) manquant(s) concernant les informations de l'adresse principale."
                                ]);
                            }

                            //On modifie le client
                            if(!empty($_POST["nomClient"]) && (isset($_POST["mailClient"])) && (isset($_POST["telClient"])) && (isset($_POST["fixeClient"])) && (isset($_POST["id"])) && (isset($_POST["idClientAdresse"])) && (!empty($_POST["idClient"]))){
                                $acc_client->modifClient($_POST["idClient"],$_POST["nomClient"],$_POST["mailClient"],$_POST["telClient"],$_POST["id"],1, $_POST["fixeClient"], $_POST["idClientAdresse"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Informations générales modifiées avec succès.'
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => 'Champ(s) manquant(s) concernant les informations du contact principal'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'Error',
                                    'message' => $e
                                ]);
                                exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }
                break;
            case "modif_adresseS" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_POST["idA"]) && (!empty($_POST["rue"])) && (!empty($_POST["cp"])) && (!empty($_POST["ville"])) && (!empty($_POST["id"])) && (!empty($_POST["priorite"]))){
                                $acc_adresses->decalerPrioriteAdresse($_POST["idA"],$_POST["priorite"]);
                                $acc_adresses->modifAdresse($_POST["idA"],$_POST["priorite"],$_POST["rue"],$_POST["cp"],$_POST["ville"],$_POST["id"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données modifiées avec succès.'
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => 'Champ(s) manquant(s)'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'Error',
                                    'message' => $e
                                ]);
                                exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_clientS" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_POST["idC"]) && (!empty($_POST["nom"])) && (!empty($_POST["mail"])) && (isset($_POST["tel"])) && (!empty($_POST["adresseC"])) && (isset($_POST["fixe"])) && (!empty($_POST["id"])) && (!empty($_POST["priorite"]))){
                                $acc_client->decalerPrioriteClient($_POST["idC"], $_POST["priorite"]);
                                $acc_client->modifClient($_POST["idC"],$_POST["nom"],$_POST["mail"],$_POST["tel"],$_POST["id"],$_POST["priorite"], $_POST["fixe"], $_POST["adresseC"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données modifiées avec succès.'
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => 'Champ(s) manquant(s).'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'Error',
                                'message' => $e
                            ]);
                            exit;
                            //$this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "suppr_adresseS" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (!empty($_POST["idA"]) && !empty($_POST["id"])) {
                                $id = intval($_POST['idA']);
                                $acc_adresses->decrementerPrioritesAdresses($id);
                                $acc_adresses->supprimerAdresse($id);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Adresse supprimée avec succès !',
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => "Champ(s) manquant pour la suppression d'une adresse",
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'Error',
                                'message' => $e
                            ]);
                            exit;
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
            case "suppr_clientS" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (!empty($_POST["idC"]) && !empty($_POST["id"])) {
                                $id = intval($_POST['idC']);
                                $acc_client->decrementerPriorites($id);
                                $acc_client->supprimerClient($id);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Client supprimé avec succès !',
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Veuillez renseigner un client à supprimer',
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'error',
                                'message' => $e,
                            ]);
                            exit;
                        }
                    }else{
                       
                        header("Location:./login.php");
                    } 
                break;
            case "ajouter_clientS" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (!empty($_POST["nom"]) && !empty($_POST["mail"]) && isset($_POST["tel"]) && isset($_POST["fixe"]) && isset($_POST["priorite"]) && !empty($_POST["adresseC"])&& !empty($_POST["id"])) {
                                $nom = $_POST["nom"];
                                $mail = $_POST["mail"];
                                $tel = $_POST["tel"];
                                $fixe = $_POST["fixe"];
                                $idAdresse = $_POST["adresseC"];
                                $idEntreprise = $_POST["id"];
                                $prioriteInput = intval($_POST["priorite"]);

                                // Si la priorité est = 0, on place en dernière position
                                if ($prioriteInput === 0) {
                                    $priorite = $acc_client->getProchainePriorite($idEntreprise);
                                } else {
                                    // Sinon, on décale ceux d'après
                                    $acc_client->incrementerPriorites($idEntreprise, $prioriteInput);
                                    $priorite = $prioriteInput;
                                }
                                $acc_client->addClient($nom, $mail, $tel, $fixe, $idEntreprise, $priorite, $idAdresse);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => "Contact ajouté avec succès !"
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => "Champ(s) manquant(s) pour l'ajout d'un contact."
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'Error',
                                'message' => $e
                            ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "ajouter_adresseS" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (!empty($_POST["rue"]) && !empty($_POST["codePostal"]) && !empty($_POST["ville"]) && isset($_POST["priorite"]) && !empty($_POST["id"])) {
                                $prioriteInput = intval($_POST["priorite"]);
                                $idEntreprise = intval($_POST["id"]);
                                // Si la priorité est = 0, on place en dernière position
                                if ($prioriteInput === 0) {
                                    $priorite = $acc_adresses->getProchainePrioriteAdresse($idEntreprise);
                                } else {
                                    // Sinon, on décale ceux d'après
                                    $acc_adresses->incrementerPrioritesAdresses($idEntreprise, $prioriteInput);
                                    $priorite = $prioriteInput;
                                }
                                $acc_adresses->addAdresse($priorite,$_POST["rue"],$_POST["codePostal"],$_POST["ville"],$idEntreprise);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => "Adresse ajoutée avec succès !"
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => "Champ(s) manquant(s) concernant l'ajout d'une adresse."
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'Error',
                                'message' => $e,
                            ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_nom_devis" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_POST["idDevis"]) && (!empty($_POST["nom"])) && !empty($_POST["id"])){
                                $acc_datasEnr->modifDatas($_POST["idDevis"],$_POST["nom"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Devis modifié avec succès',
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Champ(s) manquant(s) pour la modification rapide de devis',
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'error',
                                'message' => $e,
                            ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "suppr_data_devis" :
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if (isset($_POST['idDevis']) && isset($_POST['id'])) {
                                $acc_datasEnr->supprimerDatas($_POST["idDevis"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Devis supprimé avec succès',
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Champ(s) manquant pour la supression de devis.',
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'error',
                                    'message' => $e,
                                ]);
                                exit;
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
            /* ************************* POUR LES MODIFS / COPIE DE DEVIS ***************************************** */
            case "modif_client_devis" : 
                    if(!empty($_SESSION['Pseudo'])  || $_POST["ia"] === "true"){
                        try{
                            if(!empty($_POST["idD"]) && (!empty($_POST["idC"]))){
                                $nomDevis = $acc_datasEnr->genererIdIA();
                                $acc_datasEnr->modifClientDevis($_POST["idD"],$_POST["idC"],$nomDevis);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Le client associé au devis "' . $_POST["idD"] . '" a été modifié avec succès',
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Certains champs sont manquants.'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'error',
                                    'message' => $e
                                ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_devis_impr" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(!empty($_POST["idD"]) && (!empty($_POST["nom"])) && !empty($_POST["format"]) && (!empty($_POST["nbImpression"])) && (!empty($_POST["item"]) && (!empty($_POST["recto"]))) && (!empty($_POST["prix"])) && (!empty($_POST["pliage"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"])){
                                if($acc_datasEnr->verifNom($_POST["nom"],$_POST["idD"]) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $date = date('Y-m-d');
                                $acc_datasEnr->updateDatas($_POST['idD'], $_POST["nom"],$date,"Feuille",$_POST["nbImpression"],$_POST["prix"],"","",-1,$_POST["item"],"","",$_POST["format"],$_POST["recto"], $_POST["pliage"], $_POST["idClient"],$_POST["designations"],-1);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données modifiées avec succès.'
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Certains champs sont manquants.'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'error',
                                    'message' => $e
                                ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_devis_mat" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(isset($_POST["idD"]) && isset($_POST["nom"]) && isset($_POST["quantite"]) && isset($_POST["prix"]) && isset($_POST["longueur"]) && isset($_POST["largeur"]) && isset($_POST["item"]) && isset($_POST["espace_pose"]) && isset($_POST["decoupe"]) && isset($_POST["idClient"]) && isset($_POST["designations"]) && isset($_POST["lamination"])){
                                if($acc_datasEnr->verifNom($_POST["nom"],$_POST["idD"]) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $date = date('Y-m-d');
                                $acc_datasEnr->updateDatas($_POST['idD'], $_POST["nom"],$date,"Matière",$_POST["quantite"],$_POST["prix"],$_POST["longueur"],$_POST["largeur"],$_POST["item"],-1,$_POST["espace_pose"],$_POST["decoupe"],"","","", $_POST["idClient"],$_POST["designations"],$_POST["lamination"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données modifiées avec succès.'
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'error',
                                    'message' => 'Certains champs sont manquants.'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                    'status' => 'error',
                                    'message' => $e
                                ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
                // ******************************* A MERGE AVEC COPY_DEVIS
            case "copy_devis_voir_datas" : 
                    if(!empty($_SESSION['Pseudo'])){
                        try{
                            if(isset($_GET["id"])){
                                $acc_datasEnr->duplicateDevis($_GET["id"]);
                                header('Location:./app.php?action=voir_enregistrement');
                            }else{
                                echo("id manquant");
                                header('Location:./app.php?action=voir_enregistrement');
                            }
                        }catch(Exception $e){
                            header('Location:./app.php?action=voir_enregistrement');
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "copy_devis" : 
                    if(!empty($_SESSION['Pseudo']) || $_POST["ia"] === "true"){
                        try{
                            if(isset($_POST["id"])){
                                $acc_datasEnr->duplicateDevis($_POST["id"]);
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Devis dupliqué avec succès.',
                                    'idDevis' => $acc_datasEnr->getLastId(),
                                ]);
                                exit;
                            }else{
                                echo json_encode([
                                    'status' => 'Error',
                                    'message' => 'Champ(s) manquant(s) pour la duplication de devis'
                                ]);
                                exit;
                            }
                        }catch(Exception $e){
                            echo json_encode([
                                'status' => 'Error',
                                'message' => $e
                            ]);
                            exit;
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            default:
                header("Location:../");
            }
        }
    }
?>


