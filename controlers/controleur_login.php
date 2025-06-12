<!-- controleur.insc.php, Appartient au controleur -->
<?php
    class Appli{
        private $tbs;

        function __construct ($param_tbs){
            $this->tbs=$param_tbs;
        }
        private function retourConnexion(){   //renvoie sur la page de connexion
            $this->tbs->LoadTemplate("../templates/connexion.form.tpl.html");
            $this->tbs->Show();
        }

        private function formulaireConnexion(){
            $this->tbs->LoadTemplate("connexion.form.tpl.html");
            $this->tbs->Show();
        }


        private function EchecModif(){          //renvoie de nouveau au formulaire de modification de profil
            header("Location:../login.php?action=modif");
        } 
        
        private function EchecConnexion(){       //renvoie au formulaire de connexion avec un message d'erreur
            $this->tbs->LoadTemplate("../templates/connexionNotOk.form.tpl.html");
            $this->tbs->Show();
        }

        public function Accueil(){
            header("Location:../app/app.php");
        }

        public function dejaConnecte(){
            $this->tbs->LoadTemplate("../templates/deja_connecte.html");
            $this->tbs->Show();
        }

        public function Deconnexion(){
            $this->tbs->LoadTemplate("../templates/deconnexion.html");
            $this->tbs->Show();
        }

        public function pageModifEffectuees(){
            $this->tbs->LoadTemplate("../templates/modification_profil.html");
            $this->tbs->Show();
        }
        

        public function moteur($acc_users){
            if (isset($_GET["action"])){
                $action=$_GET["action"];
            }else{
                if (isset($_POST["action"])){
                    $action=$_POST["action"];
                }else{
                    $action="";
                }
            }  
            switch ($action){                   //En cas d'exception, l'utilisateur est renvoyé sur la page de connexion
                case "connexion" :
                    $this->formulaireConnexion();
                break;
                case "form_connect" : 
                    if(!empty($_SESSION)){
                        $this->dejaConnecte();
                    }else{
                        try{
                            $res=$acc_users->connexion($_POST["pseudo"],$_POST["password"]);        //permet de récupérer l'id de la personne connectée
                            if($res==-1){
                                $this->EchecConnexion();
                            }else{
                                $_SESSION['Id']=$res;       
                                $data=$acc_users->recupererProfil($_SESSION['Id']);                 //on récupère le reste des informations
                                $_SESSION['Pseudo']=$data["pseudo"];  
                                $this->Accueil();
                            }
                        }catch(exception $e){
                            $this->retourConnexion();
                        }
                    }   
                break; 
                case "deconnexion" :
                    try{
                        if(!empty($_SESSION)){
                            $_SESSION=array();
                            session_destroy();
                            $this->Deconnexion();
                        } 
                    }catch(exception $e){
                        $this->retourConnexion();
                    } 
                case "modif" :              //affiche le formulaire pour modifier le profil
                    if(!empty($_SESSION)){
                        $this->tbs->LoadTemplate("../templates/modif.form.tpl.html");
                        $this->tbs->Show();   
                    } 
                case "form_modif" :         //modifie le profil
                    try{
                        if(empty($_SESSION)){
                            $this->retourConnexion();
                        }else{
                            if(!empty($_SESSION) && (!empty($_POST["pseudo"]) && (!empty($_POST["password"])))){
                                $acc_users->ModifierProfil($_SESSION['Id'],$_POST["pseudo"],$_POST["password"]);
                                $_SESSION['Pseudo']=$_POST["pseudo"];     //on modifie les infos de la session
                                $this->pageModifEffectuees();
                            }else{
                                $this->EchecModif(); 
                            }
                        }
                    }catch(exception $e){
                        $this->retourConnexion();
                    } 
                break;  
            default:
                if(empty($_SESSION)){
                    $this->tbs->LoadTemplate("../templates/connexion.form.tpl.html");
                    $this->tbs->Show();
                }else{
                    $this->dejaConnecte();
                }  
            }
        }
    }
?>