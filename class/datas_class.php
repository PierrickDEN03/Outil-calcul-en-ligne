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

public function getDatasById($idD){
    $query = $this->pdo->prepare('SELECT 
            enregistrements.Id_enregistrement AS enregistrement_id,
            enregistrements.nom_enregistrement AS enregistrement_nom,
            enregistrements.date AS enregistrement_date,
            enregistrements.type_enregistrement,
            enregistrements.quantite,
            enregistrements.prix,
            enregistrements.longueur,
            enregistrements.largeur,
            enregistrements.Id_matiere,
            enregistrements.Id_impr,
            enregistrements.espace_pose,
            enregistrements.decoupe,
            enregistrements.format,
            enregistrements.type_impression,
            enregistrements.pliage,
            enregistrements.designations,
            enregistrements.Id_lamination,

            clients.Id_client AS client_id,
            clients.nom_prenom AS client_nom_prenom,
            clients.mail AS client_mail,
            clients.telephone AS client_telephone,
            clients.fixe AS client_fixe,

            entreprises.nom_entreprise AS entreprise_nom,
            entreprises.mail AS entreprise_mail,
            entreprises.telephone AS entreprise_telephone,
            entreprises.siret AS entreprise_siret,

            adresses.rue,
            adresses.code_postal,
            adresses.ville,

            modalites_paiement.label_paiement, 

            impressions.nom_papier, 
            matieres.nom_matiere

        FROM enregistrements, clients, entreprises, adresses, modalites_paiement, impressions, matieres
        WHERE enregistrements.Id_client = clients.Id_client
         AND clients.entreprise_Id = entreprises.Id_entreprise 
         AND adresses.Id_entreprise = entreprises.Id_entreprise 
         AND enregistrements.Id_enregistrement = :idD AND adresses.priorite_adresse=1
         AND entreprises.Id_paiement = modalites_paiement.Id_paiement
         AND enregistrements.Id_impr = impressions.Id_papier
         AND enregistrements.Id_matiere = matieres.Id_matiere
    ');

    $query->bindParam(":idD",$idD);
    $query->execute();
    $res = $query->fetchAll(PDO::FETCH_ASSOC);
    return $res;
}

    public function getDatas() {
        $query = $this->pdo->prepare('SELECT * FROM enregistrements, matieres, impressions WHERE matieres.Id_matiere = enregistrements.Id_matiere AND impressions.Id_papier = enregistrements.Id_impr');
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


    public function addDatas($nom,$date,$type_enr,$quantite,$prix,$longueur,$largeur,$id_matiere,$id_impr,$espace_pose,$decoupe,$format,$type_impression,$pliage,$idClient,$designations,$lamination){
        $res=$this->pdo->prepare("INSERT INTO `enregistrements` (`nom_enregistrement`, `date`, `type_enregistrement`, `quantite`, `prix`, `longueur`, `largeur`, `Id_matiere`,`Id_impr`, `espace_pose`, `decoupe`, `format`, `type_impression`, `Id_client`, `designations`, `pliage`, `Id_lamination`) VALUES (:nom, :date_param, :type_enr, :qte, :prix, :longueur, :largeur, :matiere, :impression, :espace_pose, :decoupe, :format, :type_impr, :idClient, :designations, :pliage, :lamination);");
        $res->bindParam(":nom",$nom);
        $res->bindParam(":date_param",$date);
        $res->bindParam(":type_enr",$type_enr);
        $res->bindParam(":qte",$quantite);
        $res->bindParam(":prix",$prix);
        $res->bindParam(":longueur",$longueur);
        $res->bindParam(":largeur",$largeur);
        $res->bindParam(":matiere",$id_matiere);
        $res->bindParam(":impression",$id_impr);
        $res->bindParam(":espace_pose",$espace_pose);
        $res->bindParam(":decoupe",$decoupe);
        $res->bindParam(":format",$format);
        $res->bindParam(":type_impr",$type_impression);
        $res->bindParam(":idClient",$idClient);
        $res->bindParam(":designations",$designations);
        $res->bindParam(":pliage",$pliage);
        $res->bindParam(":lamination",$lamination);
        $res->execute();
    }


    public function updateDatas($id, $nom, $date, $type_enr, $quantite, $prix, $longueur, $largeur, $matiere, $impression, $espace_pose, $decoupe, $format, $type_impression, $pliage, $idClient, $designations, $lamination) {
        $res = $this->pdo->prepare("
            UPDATE `enregistrements` 
            SET 
                `nom_enregistrement` = :nom,
                `date` = :date_param,
                `type_enregistrement` = :type_enr,
                `quantite` = :qte,
                `prix` = :prix,
                `longueur` = :longueur,
                `largeur` = :largeur,
                `Id_matiere` = :matiere,
                `Id_impr` = :impression,
                `espace_pose` = :espace_pose,
                `decoupe` = :decoupe,
                `format` = :format,
                `type_impression` = :type_impr,
                `pliage` = :pliage,
                `Id_client` = :idClient,
                `designations` = :designations, 
                `Id_lamination` = :lamination
            WHERE `id_enregistrement` = :id
        ");
        
        $res->bindParam(":id", $id);
        $res->bindParam(":nom", $nom);
        $res->bindParam(":date_param", $date);
        $res->bindParam(":type_enr", $type_enr);
        $res->bindParam(":qte", $quantite);
        $res->bindParam(":prix", $prix);
        $res->bindParam(":longueur", $longueur);
        $res->bindParam(":largeur", $largeur);
        $res->bindParam(":matiere", $matiere);
        $res->bindParam(":impression", $impression);
        $res->bindParam(":espace_pose", $espace_pose);
        $res->bindParam(":decoupe", $decoupe);
        $res->bindParam(":format", $format);
        $res->bindParam(":type_impr", $type_impression);
        $res->bindParam(":pliage", $pliage);
        $res->bindParam(":idClient", $idClient);
        $res->bindParam(":designations", $designations);
        $res->bindParam(":lamination",$lamination);

        $res->execute();
    }


    public function genererId(): string {
        $now = microtime(true);
        $milliseconds = sprintf("%03d", ($now - floor($now)) * 1000);

        // Format : YYYYMM - HHMM - SSmmm
        $yearMonth = date("Ym", (int)$now);     // ex : 202506
        $hourMinute = date("Hi", (int)$now);    // ex : 1654
        $second = date("s", (int)$now);         // ex : 36

        $finalDate = $yearMonth . '-' . $hourMinute . '-' . $second . $milliseconds . 'H';

        return $finalDate;
    }
    public function verifNom($nom){
        $query = $this->pdo->prepare('SELECT * FROM enregistrements WHERE nom_enregistrement=:nomE');
        $query -> bindParam(":nomE",$nom);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        //True si ou plusieurs résultats trouvés
        return count($result) > 0 ? true : false;

    }

    public function getLastId(){
        // Utilise la connexion courante pour éviter les problèmes de concurrence
        return $this->pdo->lastInsertId();
    }
}


