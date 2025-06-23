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
            $this->tbs->LoadTemplate("../templates/modif_effectuee_impr.html");
            $this->tbs->Show();
        }

        public function ajoutEffectueeImpr(){
            $this->tbs->LoadTemplate("../templates/add_impression.html");
            $this->tbs->Show();
        }

        public function suprEffectueeImpr(){
            $this->tbs->LoadTemplate("../templates/supr_effectuee_impr.html");
            $this->tbs->Show();
        }

        public function modifEffectueeMat(){
            $this->tbs->LoadTemplate("../templates/modif_effectuee_mat.html");
            $this->tbs->Show();
        }

        public function suprEffectueeMatiere(){
            $this->tbs->LoadTemplate("../templates/supr_effectuee_mat.html");
            $this->tbs->Show();
        }

        public function suprEffectueeMat(){
            $this->tbs->LoadTemplate("../templates/supr_effectuee_mat.html");
            $this->tbs->Show();
        }

        public function ajoutEffectueeMatiere(){
            $this->tbs->LoadTemplate("../templates/add_matiere.html");
            $this->tbs->Show();
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
            $this->tbs->LoadTemplate("../templates/modif_effectuee_datas.html");
            $this->tbs->Show();
        }

        public function suprEffectueeDatas(){
            $this->tbs->LoadTemplate("../templates/supr_effectuee_datas.html");
            $this->tbs->Show();
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
            $this->tbs->LoadTemplate("../templates/modif_effectuee_entreprise.html");
            $this->tbs->Show();
        }

        public function ajoutEffectueeEntreprise(){
            $this->tbs->LoadTemplate("../templates/add_entreprise.html");
            $this->tbs->Show();
        }

        public function suprEffectueeEntreprise(){
            $this->tbs->LoadTemplate("../templates/supr_effectuee_entreprise.html");
            $this->tbs->Show();
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
                    if(!empty($_SESSION)){
                        $this->loadBackoffice();
                    }else{
                        header("Location:./login.php");
                    }  
                break; 
                case "voir_matiere" : 
                    if(!empty($_SESSION)){
                        $this->voirMatiere();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_impression" : 
                    if(!empty($_SESSION)){
                        $this->voirImpression();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_enregistrement" : 
                    if(!empty($_SESSION)){
                        $this->voirDatas();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_details_entreprise" : 
                    if(!empty($_SESSION)){
                        $this->voirDetails();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "voir_entreprise" : 
                    if(!empty($_SESSION)){
                        $this->voirEntreprises();
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                
                /* *************************POUR LES IMPRESSIONS ***************************************** */
                case "modif_impression" : 
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                        if(!empty($_SESSION)){
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
                if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["frais"])){
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
                if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["frais"]) && !empty($_GET["prixPliage"])){
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
                if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["prix_decoupe"])){
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
                if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["frais"])){
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
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && !empty($_GET["nom"]) && !empty($_GET["code"]) && !empty($_GET["prix"]) && !empty($_GET["type"]) && !empty($_GET["laize"])){
                                $acc_datasMatiere->modifMatiere($_GET["id"],$_GET["nom"],$_GET["code"],$_GET["prix"],$_GET["type"],$_GET["laize"]);
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) &&  isset($_GET["min"]) && $_GET["min"] !== "" && !empty($_GET["max"]) && !empty($_GET["prix"])){
                                $acc_datasMatiere->modifDegMatiere($_GET["id"],$_GET["min"],$_GET["max"],$_GET["prix"]);
                                $this->modifEffectueeMat();
                            }else{
                                $this->voirMatiere();
                            }
                        }catch(Exception $e){
                            $this->tbs->LoadTemplate("../templates/index.html");
                            $this->voirMatiere();
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "add_matiere" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["nom"]) && !empty($_GET["code"]) && !empty($_GET["prix"]) && !empty($_GET["type"]) && !empty($_GET["laize"])){
                                $acc_datasMatiere->addMatiere($_GET["nom"],$_GET["code"],$_GET["prix"],$_GET["type"],$_GET["laize"]);
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
                        if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                if(!empty($_SESSION)){
                        try{
                            if((!empty($_POST["nom"])) && !empty($_POST["format"]) && (!empty($_POST["nbImpression"])) && (!empty($_POST["item"]) && (!empty($_POST["recto"]))) && (!empty($_POST["prix"])) && (!empty($_POST["pliage"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"])){
                                $date = date('Y-m-d');
                                if($acc_datasEnr->verifNom($_POST["nom"]) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $acc_datasEnr->addDatas($_POST["nom"],$date,"Feuille",$_POST["nbImpression"],$_POST["prix"],"","",-1,$_POST["item"],"","",$_POST["format"],$_POST["recto"], $_POST["pliage"], $_POST["idClient"],$_POST["designations"],-1);
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
                if(!empty($_SESSION)){
                        try{
                            if((!empty($_POST["nom"])) && !empty($_POST["longueur"]) && (!empty($_POST["largeur"])) && (!empty($_POST["quantite"])) && (!empty($_POST["item"])) && (isset($_POST["espace_pose"])) && (!empty($_POST["decoupe"])) && (!empty($_POST["prix"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"]) && isset($_POST["lamination"])){
                                $date = date('Y-m-d');
                                if($acc_datasEnr->verifNom($_POST["nom"]) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $acc_datasEnr->addDatas($_POST["nom"],$date,"Matière",$_POST["quantite"],$_POST["prix"],$_POST["longueur"],$_POST["largeur"],$_POST["item"],-1,$_POST["espace_pose"],$_POST["decoupe"],"","","",$_POST["idClient"],$_POST["designations"],$_POST["lamination"]);
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
                        try{
                            if (isset($_GET['id'])) {
                                $id = intval($_GET['id']);
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
            case "modif_entreprise" : 
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
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
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["nomEntreprise"]) && !empty($_GET["siretEntreprise"]) 
                            && !empty($_GET["mailEntreprise"]) && isset($_GET["telephoneEntreprise"]) && !empty($_GET["mpaiement"])
                            && !empty($_GET["rueEntreprise"]) 
                            && isset($_GET["codePostalEntreprise"]) && !empty($_GET["villeEntreprise"]) && !empty($_GET["nomPrenomClient"]) 
                            && !empty($_GET["mailClient"]) && isset($_GET["telephoneClient"]) && isset($_GET["fixeClient"])){
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
            case "modif_nomE" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && (!empty($_GET["nomE"]))){
                                $acc_entreprise->modifNom($_GET["id"],$_GET["nomE"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_siret" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && (!empty($_GET["siret"]))){
                                $acc_entreprise->modifSiret($_GET["id"],$_GET["siret"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_mail" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && (!empty($_GET["mail"]))){
                                $acc_entreprise->modifMail($_GET["id"],$_GET["mail"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_telephone" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && (!empty($_GET["tel"]))){
                                $acc_entreprise->modifTelephone($_GET["id"],$_GET["tel"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
                case "modif_paiementE" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["id"]) && (!empty($_GET["mpaiement"]))){
                                $acc_entreprise->modifModalPaiement($_GET["id"],$_GET["mpaiement"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_adresseP" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["idA"]) && (!empty($_GET["rue"])) && (!empty($_GET["cp"])) && (!empty($_GET["ville"])) && (!empty($_GET["id"]))){
                                $acc_adresses->modifAdresse($_GET["idA"],1,$_GET["rue"],$_GET["cp"],$_GET["ville"],$_GET["id"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_adresseS" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["idA"]) && (!empty($_GET["rue"])) && (!empty($_GET["cp"])) && (!empty($_GET["ville"])) && (!empty($_GET["id"])) && (!empty($_GET["priorite"]))){
                                $acc_adresses->decalerPrioriteAdresse($_GET["idA"],$_GET["priorite"]);
                                $acc_adresses->modifAdresse($_GET["idA"],$_GET["priorite"],$_GET["rue"],$_GET["cp"],$_GET["ville"],$_GET["id"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_clientP" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["idC"]) && (!empty($_GET["nom"])) && (!empty($_GET["mail"])) && (!empty($_GET["tel"])) && (!empty($_GET["fixe"])) && (!empty($_GET["idA"])) && (!empty($_GET["id"]))){
                                $acc_client->modifClient($_GET["idC"],$_GET["nom"],$_GET["mail"],$_GET["tel"],$_GET["id"],1, $_GET["fixe"], $_GET["idA"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_clientS" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_GET["idC"]) && (!empty($_GET["nom"])) && (!empty($_GET["mail"])) && (!empty($_GET["tel"])) && (!empty($_GET["adresseC"])) && (!empty($_GET["fixe"])) && (!empty($_GET["id"])) && (!empty($_GET["priorite"]))){
                                $acc_client->decalerPrioriteClient($_GET["idC"], $_GET["priorite"]);
                                $acc_client->modifClient($_GET["idC"],$_GET["nom"],$_GET["mail"],$_GET["tel"],$_GET["id"],$_GET["priorite"], $_GET["fixe"], $_GET["adresseC"]);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "suppr_adresseS" :
                    if(!empty($_SESSION)){
                        try{
                            if (!empty($_GET["idA"]) && !empty($_GET["id"])) {
                                $id = intval($_GET['idA']);
                                $acc_adresses->decrementerPrioritesAdresses($id);
                                $acc_adresses->supprimerAdresse($id);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
            case "suppr_clientS" :
                    if(!empty($_SESSION)){
                        try{
                            if (!empty($_GET["idC"]) && !empty($_GET["id"])) {
                                $id = intval($_GET['idC']);
                                $acc_client->decrementerPriorites($id);
                                $acc_client->supprimerClient($id);
                                $this->retourDetails($_GET["id"]);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            $this->retourDetails($_GET["id"]);
                        }
                    }else{
                       
                        header("Location:./login.php");
                    } 
                break;
            case "ajouter_clientS" : 
                    if(!empty($_SESSION)){
                        try{
                            if (!empty($_GET["nom"]) && !empty($_GET["mail"]) && !empty($_GET["tel"]) && !empty($_GET["fixe"]) && isset($_GET["priorite"]) && !empty($_GET["adresseC"])&& !empty($_GET["id"])) {
                                $nom = $_GET["nom"];
                                $mail = $_GET["mail"];
                                $tel = $_GET["tel"];
                                $fixe = $_GET["fixe"];
                                $idAdresse = $_GET["adresseC"];
                                $idEntreprise = $_GET["id"];
                                $prioriteInput = intval($_GET["priorite"]);

                                // Si la priorité est = 0, on place en dernière position
                                if ($prioriteInput === 0) {
                                    $priorite = $acc_client->getProchainePriorite($idEntreprise);
                                } else {
                                    // Sinon, on décale ceux d'après
                                    $acc_client->incrementerPriorites($idEntreprise, $prioriteInput);
                                    $priorite = $prioriteInput;
                                }
                                $acc_client->addClient($nom, $mail, $tel, $fixe, $idEntreprise, $priorite, $idAdresse);
                                $this->retourDetails($idEntreprise);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            //$this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "ajouter_adresseS" :
                    if(!empty($_SESSION)){
                        try{
                            if (!empty($_GET["rue"]) && !empty($_GET["codePostal"]) && !empty($_GET["ville"]) && isset($_GET["priorite"]) && !empty($_GET["id"])) {
                                $prioriteInput = intval($_GET["priorite"]);
                                $idEntreprise = intval($_GET["id"]);
                                // Si la priorité est = 0, on place en dernière position
                                if ($prioriteInput === 0) {
                                    $priorite = $acc_adresses->getProchainePrioriteAdresse($idEntreprise);
                                } else {
                                    // Sinon, on décale ceux d'après
                                    $acc_adresses->incrementerPrioritesAdresses($idEntreprise, $prioriteInput);
                                    $priorite = $prioriteInput;
                                }
                                $acc_adresses->addAdresse($priorite,$_GET["rue"],$_GET["codePostal"],$_GET["ville"],$idEntreprise);
                                $this->retourDetails($idEntreprise);
                            }else{
                                $this->retourDetails($_GET["id"]);
                            }
                        }catch(Exception $e){
                            echo$e;
                            //$this->retourDetails($_GET["id"]);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break;
            case "modif_data_detail" : 
                    if(!empty($_SESSION)){
                        try{
                            $idEntreprise = intval($_GET["id"]);
                            if(!empty($_GET["idDevis"]) && (!empty($_GET["nom"])) && !empty($_GET["id"])){
                                $acc_datasEnr->modifDatas($_GET["idDevis"],$_GET["nom"]);
                                $this->retourDetails($idEntreprise);
                            }else{
                                $this->retourDetails($idEntreprise);
                            }
                        }catch(Exception $e){
                            echo$e;
                            //$this->retourDetails($idEntreprise);
                        }       
                    }else{
                        header("Location:./login.php");
                    }   
                break; 
                case "suppr_data_detail" :
                    if(!empty($_SESSION)){
                        try{
                            $idEntreprise = intval($_GET["id"]);
                            if (isset($_GET['idDevis']) && isset($_GET['id'])) {
                                $acc_datasEnr->supprimerDatas($_GET["idDevis"]);
                                $this->retourDetails($idEntreprise);
                            }else{
                                $this->retourDetails($idEntreprise);
                            }
                        }catch(Exception $e){
                            $this->retourDetails($idEntreprise);
                        }
                    }else{
                        header("Location:./login.php");
                    } 
                break;
            /* ************************* POUR LES MODIFS / COPIE DE DEVIS ***************************************** */
            case "copy_devis_impr" : 
                    if(!empty($_SESSION)){
                        try{
                            if((!empty($_POST["nom"])) && !empty($_POST["format"]) && (!empty($_POST["nbImpression"])) && (!empty($_POST["item"]) && (!empty($_POST["recto"]))) && (!empty($_POST["prix"])) && (!empty($_POST["pliage"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"])){
                                if($acc_datasEnr->verifNom($_POST["nom"]) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $date = date('Y-m-d');
                                $acc_datasEnr->addDatas($_POST["nom"],$date,"Feuille",$_POST["nbImpression"],$_POST["prix"],"","",-1,$_POST["item"],"","",$_POST["format"],$_POST["recto"], $_POST["pliage"], $_POST["idClient"],$_POST["designations"],-1);
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
            case "modif_devis_impr" : 
                    if(!empty($_SESSION)){
                        try{
                            if(!empty($_POST["idD"]) && (!empty($_POST["nom"])) && !empty($_POST["format"]) && (!empty($_POST["nbImpression"])) && (!empty($_POST["item"]) && (!empty($_POST["recto"]))) && (!empty($_POST["prix"])) && (!empty($_POST["pliage"])) && (!empty($_POST["idClient"])) && isset($_POST["designations"])){
                                if($acc_datasEnr->verifNom($_POST["nom"]) === true){
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
            case "copy_devis_mat" : 
                    if(!empty($_SESSION)){
                        try{
                            if(isset($_POST["nom"]) && isset($_POST["quantite"]) && isset($_POST["prix"]) && isset($_POST["longueur"]) && isset($_POST["largeur"]) && isset($_POST["item"]) && isset($_POST["espace_pose"]) && isset($_POST["decoupe"]) && isset($_POST["idClient"]) && isset($_POST["designations"]) && isset($_POST["lamination"])){
                                if($acc_datasEnr->verifNom($_POST["nom"]) === true){
                                    echo json_encode([
                                        'status' => 'error',
                                        'message' => 'Le devis "' . $_POST["nom"] . '" existe déjà, veuillez choisir un autre nom de devis',
                                    ]);
                                    exit;
                                }
                                $date = date('Y-m-d');
                                $acc_datasEnr->addDatas($_POST["nom"],$date,"Matière",$_POST["quantite"],$_POST["prix"],$_POST["longueur"],$_POST["largeur"],$_POST["item"],-1,$_POST["espace_pose"],$_POST["decoupe"],"","","",$_POST["idClient"],$_POST["designations"],$_POST["lamination"]);
                                $idDevis = $acc_datasEnr->getLastId();
                                echo json_encode([
                                    'status' => 'success',
                                    'message' => 'Données copiées avec succès.',
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
            case "modif_devis_mat" : 
                    if(!empty($_SESSION)){
                        try{
                            if(isset($_POST["idD"]) && isset($_POST["nom"]) && isset($_POST["quantite"]) && isset($_POST["prix"]) && isset($_POST["longueur"]) && isset($_POST["largeur"]) && isset($_POST["item"]) && isset($_POST["espace_pose"]) && isset($_POST["decoupe"]) && isset($_POST["idClient"]) && isset($_POST["designations"]) && isset($_POST["lamination"])){
                                if($acc_datasEnr->verifNom($_POST["nom"]) === true){
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
            default:
                header("Location:../");
            }
        }
    }
?>


