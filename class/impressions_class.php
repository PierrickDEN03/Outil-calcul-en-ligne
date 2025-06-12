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
class AccesDatasImpr {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getImpressions() {
        $query = $this->pdo->prepare('SELECT * FROM impressions');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getNbOnPaper(){
        $query = $this->pdo->prepare('SELECT * FROM nb_impressions_page');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDegressif() {
        $query = $this->pdo->prepare('SELECT * FROM degressif_impression');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function modifImpression($id,$nom_papier,$grammage,$code,$prixR,$prixRV){
        $res=$this->pdo->prepare("UPDATE impressions SET nom_papier=:nom_papier, grammage=:grammage, code_matiere=:code,prix_recto=:prixR,prix_recto_verso=:prixRV WHERE Id_papier=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":nom_papier",$nom_papier);
        $res->bindParam(":grammage",$grammage);
        $res->bindParam(":code",$code);
        $res->bindParam(":prixR",$prixR);
        $res->bindParam(":prixRV",$prixRV);
        $res->execute();
    }

    public function supprimerImpression($id) {
        $query = $this->pdo->prepare("DELETE FROM impressions WHERE Id_papier = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }

    public function supprimerDegImpr($id) {
        $query = $this->pdo->prepare("DELETE FROM degressif_impression WHERE Id_deg_matiere = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }

    public function modifDegImpr($id,$min,$max,$prix){
        $res=$this->pdo->prepare("UPDATE degressif_impression SET min=:min,max=:max,prix=:prix  WHERE Id_deg_matiere=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":min",$min);
        $res->bindParam(":max",$max);
        $res->bindParam(":prix",$prix);
        $res->execute();
    }

    public function addImpression($nom_papier,$grammage,$code,$prixR,$prixRV){
        $res=$this->pdo->prepare("INSERT INTO impressions (`Id_papier`, `nom_papier`, `grammage`, `code_matiere`, `prix_recto`, `prix_recto_verso`) VALUES (NULL, :nom, :grammage, :code, :prixR, :prixRV);");
        $res->bindParam(":nom",$nom_papier);
        $res->bindParam(":grammage",$grammage);
        $res->bindParam(":code",$code);
        $res->bindParam(":prixR",$prixR);
        $res->bindParam(":prixRV",$prixRV);
        $res->execute();
    }

    public function addDegImpr($min,$max,$prix){
        $res=$this->pdo->prepare("INSERT INTO `degressif_impression` (`Id_deg_matiere`, `min`, `max`, `prix`) VALUES (NULL, :min, :max, :prix);");
        $res->bindParam(":min",$min);
        $res->bindParam(":max",$max);
        $res->bindParam(":prix",$prix);
        $res->execute();
    }


}


