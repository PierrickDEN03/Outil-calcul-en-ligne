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

    public function getDevisById($idE){
        $query = $this->pdo->prepare('SELECT Id_enregistrement, nom_enregistrement, `date`, type_enregistrement, quantite, prix, longueur, largeur, format, type_impression, enregistrements.Id_client, nom_papier, nom_matiere FROM 
            enregistrements, clients, matieres, impressions 
            WHERE enregistrements.Id_client=clients.Id_client AND enregistrements.Id_impr = impressions.Id_papier AND enregistrements.Id_matiere = matieres.Id_matiere AND  clients.entreprise_ID=:idE');
        $query->bindParam(":idE",$idE);
        $query->execute();
        $res = $query->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public function getNomEntrepriseWithId($id) {
        $query = $this->pdo->prepare('SELECT nom_entreprise FROM entreprises WHERE Id_entreprise=:id');
        $query->bindParam(":id",$id);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getEntreprises() {
        $query = $this->pdo->prepare('SELECT * FROM entreprises WHERE Id_entreprise!=-1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getEntrepriseById($id) {
        $query = $this->pdo->prepare('SELECT * FROM entreprises, modalites_paiement WHERE entreprises.Id_paiement = modalites_paiement.Id_paiement AND Id_entreprise=:id');
        $query->bindParam(":id",$id);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
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


    public function addEntreprise($nom,$mail,$telephone,$siret,$modalP){
        $res=$this->pdo->prepare("INSERT INTO `entreprises` (`nom_entreprise`, `mail`, `telephone`, `siret`, `Id_paiement`) VALUES (:nom, :mail, :telephone, :siret, :mpaiement);");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":mail",$mail);
        $res->bindParam(":telephone",$telephone);
        $res->bindParam(":siret",$siret);
        $res->bindParam(":mpaiement",$modalP);
        $res->execute();
    }

    public function modifInfosGenerales($id,$nom,$mail,$telephone,$siret, $paiement){
        $res=$this->pdo->prepare("UPDATE entreprises SET nom_entreprise=:nom, mail=:mail, telephone=:telephone, siret=:siret, Id_paiement=:paiement WHERE Id_entreprise=:id");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":mail",$mail);
        $res->bindParam(":telephone",$telephone);
        $res->bindParam(":siret",$siret);
        $res->bindParam(":id",$id);
        $res->bindParam(":paiement",$paiement);
        $res->execute();
    }

    public function modifEntrepriseNom($id,$nom){
        $res=$this->pdo->prepare("UPDATE entreprises SET nom_entreprise=:nom WHERE Id_entreprise=:id");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":id",$id);
        $res->execute();
    }


    public function getLastId(){
        // Utilise la connexion courante pour éviter les problèmes de concurrence
        return $this->pdo->lastInsertId();
    }
    
}






