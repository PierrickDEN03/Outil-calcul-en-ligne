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
class AccesDatasMatiere {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getMatieres() {
        $query = $this->pdo->prepare('SELECT * FROM matieres WHERE Id_matiere !=-1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getLaminations() {
        $query = $this->pdo->prepare('SELECT * FROM laminations WHERE Id_lamination!=-1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDegressif() {
        $query = $this->pdo->prepare('SELECT * FROM degressif_matiere');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getFrais() {
        $query = $this->pdo->prepare('SELECT * FROM frais_fixe_mat');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getPrixDecoupe() {
        $query = $this->pdo->prepare('SELECT * FROM decoupe');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function modifMatiere($id,$nom,$code,$prix,$type,$laize,$marges){
        $res=$this->pdo->prepare("UPDATE matieres SET nom_matiere=:nom, code_matiere=:code, prix_mcarre=:prix,type_matiere=:type_mat,laizes=:laize, marges=:marges WHERE Id_matiere=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":nom",$nom);
        $res->bindParam(":code",$code);
        $res->bindParam(":prix",$prix);
        $res->bindParam(":type_mat",$type);
        $res->bindParam(":laize",$laize);
        $res->bindParam(":marges",$marges);
        $res->execute();
    }

    public function supprimerMatiere($id) {
        $query = $this->pdo->prepare("DELETE FROM matieres WHERE Id_matiere = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }

    public function supprimerDegMatiere($id) {
        $query = $this->pdo->prepare("DELETE FROM degressif_matiere WHERE Id_deg_matiere = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }

    public function modifDegMatiere($id,$min,$max,$prix){
        $res=$this->pdo->prepare("UPDATE degressif_matiere SET min=:min,max=:max,prix_surface=:prix  WHERE Id_deg_matiere=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":min",$min);
        $res->bindParam(":max",$max);
        $res->bindParam(":prix",$prix);
        $res->execute();
    }

    public function addMatiere($nom,$code,$prix,$type,$laize,$marges){
        $res=$this->pdo->prepare("INSERT INTO matieres (`Id_matiere`, `nom_matiere`, `code_matiere`, `prix_mcarre`, `type_matiere`, `laizes`, `marges`) VALUES (NULL, :nom, :code, :prix, :type_mat, :laize, :marges);");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":code",$code);
        $res->bindParam(":prix",$prix);
        $res->bindParam(":type_mat",$type);
        $res->bindParam(":laize",$laize);
        $res->bindParam(":marges",$marges);
        $res->execute();
    }

    public function addDegMatiere($min,$max,$prix){
        $res=$this->pdo->prepare("INSERT INTO `degressif_matiere` (`Id_deg_matiere`, `min`, `max`, `prix_surface`) VALUES (NULL, :min, :max, :prix);");
        $res->bindParam(":min",$min);
        $res->bindParam(":max",$max);
        $res->bindParam(":prix",$prix);
        $res->execute();
    }

    public function modifFrais($id,$frais){
        $res=$this->pdo->prepare("UPDATE frais_fixe_mat SET prix_frais=:frais WHERE Id_frais=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":frais",$frais);
        $res->execute();
    }

    public function modifDecoupe($id,$prix_decoupe){
        $res=$this->pdo->prepare("UPDATE decoupe SET prix_decoupe=:prix WHERE Id_decoupe=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":prix",$prix_decoupe);
        $res->execute();
    }

    public function addLamination($description, $prix){
        $res=$this->pdo->prepare("INSERT INTO laminations (`description`, `prix_lamination`) VALUES (:descr, :prix);");
        $res->bindParam(":descr",$description);
        $res->bindParam(":prix",$prix);
        $res->execute();
    }

    public function supprimerLamination($id) {
        $query = $this->pdo->prepare("DELETE FROM laminations WHERE Id_lamination = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }

    public function modifLamination($id,$description, $prix){
        $res=$this->pdo->prepare("UPDATE laminations SET `description`=:descr, `prix_lamination`=:prix WHERE Id_lamination=:id");
        $res->bindParam(":id",$id);
        $res->bindParam(":descr",$description);
        $res->bindParam(":prix",$prix);
        $res->execute();
    }
}



