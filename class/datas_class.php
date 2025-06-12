<?php

// Connexion à la base
require("../utils/db_login.php");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion à la base : " . $e->getMessage()]);
    exit;
}


// Classe d'accès aux données
class AccesDatas {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getDatas() {
        $query = $this->pdo->prepare('SELECT * FROM enregistrements');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function modifDatas($id,$nom){
        $res=$this->pdo->prepare("UPDATE enregistrements SET nom_enregistrement=:nom WHERE Id_enregistrement=:id");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":id",$id);
        $res->execute();
    }

    public function supprimerDatas($id) {
        $query = $this->pdo->prepare("DELETE FROM enregistrements WHERE Id_enregistrement = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }


    public function addDatas($nom,$date,$type_enr,$quantite,$prix,$longueur,$largeur,$matiere,$espace_pose,$decoupe,$format,$type_impression,$idClient){
        $res=$this->pdo->prepare("INSERT INTO `enregistrements` (`nom_enregistrement`, `date`, `type_enregistrement`, `quantite`, `prix`, `longueur`, `largeur`, `matiere`, `espace_pose`, `decoupe`, `format`, `type_impression`, `Id_client`) VALUES (:nom, :date_param, :type_enr, :qte, :prix, :longueur, :largeur, :matiere, :espace_pose, :decoupe, :format, :type_impr, :idClient);");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":date_param",$date);
        $res->bindParam(":type_enr",$type_enr);
        $res->bindParam(":qte",$quantite);
        $res->bindParam(":prix",$prix);
        $res->bindParam(":longueur",$longueur);
        $res->bindParam(":largeur",$largeur);
        $res->bindParam(":matiere",$matiere);
        $res->bindParam(":espace_pose",$espace_pose);
        $res->bindParam(":decoupe",$decoupe);
        $res->bindParam(":format",$format);
        $res->bindParam(":type_impr",$type_impression);
        $res->bindParam(":idClient",$idClient);
        $res->execute();
    }

    public function genererId(): string {
        // Récupérer l'id du dernier enregistrement
        $query = $this->pdo->prepare("SELECT Id_enregistrement FROM enregistrements ORDER BY Id_enregistrement DESC LIMIT 1");
        $query->execute(); 
        $lastId = $query->fetch(PDO::FETCH_COLUMN);

        // Si aucun enregistrement, on commence à 1
        $nextId = $lastId ? ((int)$lastId + 1) : 1;

        // Formatter l'ID avec des zéros en padding
        $formattedId = 'ID' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

        return $formattedId;
    }



}


