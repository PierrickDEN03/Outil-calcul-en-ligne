<?php
    class AccesUsers{
        private $pdo;
    
        function __construct($param_pdo){
            $this->pdo=$param_pdo;
        }    
    
        public function connexion($pseudo,$mdp){
            $res=$this->pdo->prepare("SELECT * FROM users WHERE pseudo =:pseudo AND mdp=:mdp");
            $res->bindParam(":pseudo",$pseudo);
            $res->bindParam(":mdp",$mdp);
            $res->execute();
            $data=$res->fetch();
            if(empty($data)){   //Infos incorrectes dans ce cas
                return -1;
            }else{
                return $data["Id_user"];       //Profil trouvé
            } 
        }

        public function recupererProfil($id){                           //récupère les infos d'un utilisateur en sachant son id
            $res=$this->pdo->prepare("SELECT * FROM users WHERE Id_user = ?");
            $res->execute([$id]);
            $data=$res->fetch();
            return $data; 
        }

        public function CreerProfil($pseudo,$mdp){
            $res=$this->pdo->prepare("INSERT INTO users (pseudo,mdp,Photo) VALUES (:pseudo,:mdp)");
            $res->bindParam(":pseudo",$pseudo);
            $res->bindParam(":mdp",$mdp);
            $res->execute(); 
        }  

        public function ModifierProfil($id,$pseudo,$mdp){
            $res=$this->pdo->prepare("UPDATE users SET pseudo=:pseudo, mdp=:mdp WHERE Id_user=:id");
            $res->bindParam(":pseudo",$pseudo);
            $res->bindParam(":mdp",$mdp);
            $res->bindParam(":id",$id);
            $res->execute();
        }

        public function verification($pseudo){              //verifie si les informations ne sont pas déjà repris sur un autre profil
            $res=$this->pdo->prepare("SELECT * FROM users WHERE pseudo=:pseudo");
            $res->bindParam(":pseudo",$pseudo);
            $res->execute();
            $data=$res->fetch();
            if(empty($data)){    //Le pseudo n'est pas utilisé     
                return 1;
            }else{
                return 0;       //Un utilisateur possède déjà ce pseudo
            }
        }

    }
    
    
?>