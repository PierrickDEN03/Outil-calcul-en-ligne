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
class AccesEntreprises {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getEntreprises() {
        $query = $this->pdo->prepare('SELECT * FROM entreprises WHERE Id_entreprise!=-1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getEntrepriseById($id) {
        $query = $this->pdo->prepare('SELECT * FROM entreprises WHERE Id_entreprise=:id');
        $query->bindParam(":id",$id);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function modifEntrepriseNom($id,$nom){
        $res=$this->pdo->prepare("UPDATE entreprises SET nom_entreprise=:nom WHERE Id_entreprise=:id");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":id",$id);
        $res->execute();
    }


    public function modifEntreprise($id,$nom,$mail,$telephone,$siret){
        $res=$this->pdo->prepare("UPDATE entreprises SET nom_entreprise=:nom, mail=:mail, telephone=:telephone, siret=:siret WHERE Id_entreprise=:id");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":mail",$mail);
        $res->bindParam(":telephone",$telephone);
        $res->bindParam(":siret",$siret);
        $res->bindParam(":id",$id);
        $res->execute();
    }

    public function supprimerEntreprise($id) {
        $query = $this->pdo->prepare("DELETE FROM entreprises WHERE Id_entreprise = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }


    public function addEntreprise($nom,$mail,$telephone,$siret){
        $res=$this->pdo->prepare("INSERT INTO `entreprises` (`nom_entreprise`, `mail`, `telephone`, `siret`) VALUES (:nom, :mail, :telephone, :siret);");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":mail",$mail);
        $res->bindParam(":telephone",$telephone);
        $res->bindParam(":siret",$siret);
        $res->execute();
    }


    public function modifMail($id,$mail){
        $res=$this->pdo->prepare("UPDATE entreprises SET mail=:mail WHERE Id_entreprise=:id");
        $res->bindParam(":mail",$mail);
        $res->bindParam(":id",$id);
        $res->execute();
    }

    public function modifSiret($id,$siret){
        $res=$this->pdo->prepare("UPDATE entreprises SET siret=:siret WHERE Id_entreprise=:id");
        $res->bindParam(":siret",$siret);
        $res->bindParam(":id",$id);
        $res->execute();
    }

    public function modifTelephone($id,$telephone){
        $res=$this->pdo->prepare("UPDATE entreprises SET telephone=:telephone WHERE Id_entreprise=:id");
        $res->bindParam(":telephone",$telephone);
        $res->bindParam(":id",$id);
        $res->execute();
    }

    public function getLastId(){
        // Utilise la connexion courante pour éviter les problèmes de concurrence
        return $this->pdo->lastInsertId();
    }
    
}






