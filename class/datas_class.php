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
        // 1) Récupérer l'enregistrement et le client
        $query = $this->pdo->prepare('
            SELECT 
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
                clients.adresse_Id,

                entreprises.Id_entreprise AS entreprise_id,
                entreprises.nom_entreprise AS entreprise_nom,
                entreprises.mail AS entreprise_mail,
                entreprises.telephone AS entreprise_telephone,
                entreprises.siret AS entreprise_siret,

                modalites_paiement.label_paiement, 
                impressions.nom_papier, 
                matieres.nom_matiere

            FROM enregistrements
            JOIN clients ON enregistrements.Id_client = clients.Id_client
            JOIN entreprises ON clients.entreprise_Id = entreprises.Id_entreprise
            JOIN modalites_paiement ON entreprises.Id_paiement = modalites_paiement.Id_paiement
            JOIN impressions ON enregistrements.Id_impr = impressions.Id_papier
            JOIN matieres ON enregistrements.Id_matiere = matieres.Id_matiere
            WHERE enregistrements.Id_enregistrement = :idD
        ');

        $query->bindParam(':idD', $idD);
        $query->execute();
        $data = $query->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            // Aucun enregistrement trouvé
            return null;
        }

        // 2) Déterminer si on prend l'adresse du client ou de l'entreprise
        if (!empty($data['adresse_Id'])) {
            // Adresse du client
            $queryAdresse = $this->pdo->prepare('
                SELECT rue, code_postal, ville
                FROM adresses
                WHERE Id_adresse = :adresseId
            ');
            $queryAdresse->bindParam(':adresseId', $data['adresse_Id']);
        } else {
            // Adresse de l'entreprise (prioritaire)
            $queryAdresse = $this->pdo->prepare('
                SELECT rue, code_postal, ville
                FROM adresses
                WHERE Id_entreprise = :entrepriseId
                AND priorite_adresse = 1
            ');
            $queryAdresse->bindParam(':entrepriseId', $data['entreprise_id']);
        }

        $queryAdresse->execute();
        $adresse = $queryAdresse->fetch(PDO::FETCH_ASSOC);

        if (!$adresse) {
            // Si aucune adresse trouvée, on met des champs vides
            $adresse = [
                'rue' => null,
                'code_postal' => null,
                'ville' => null
            ];
        }

        // 3) Fusionner les deux tableaux
        $result = array_merge($data, $adresse);

        return $result;
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


    public function addDatas($id,$nom,$date,$type_enr,$quantite,$prix,$longueur,$largeur,$id_matiere,$id_impr,$espace_pose,$decoupe,$format,$type_impression,$pliage,$idClient,$designations,$lamination){
        $res=$this->pdo->prepare("INSERT INTO `enregistrements` (`Id_enregistrement`, `nom_enregistrement`, `date`, `type_enregistrement`, `quantite`, `prix`, `longueur`, `largeur`, `Id_matiere`,`Id_impr`, `espace_pose`, `decoupe`, `format`, `type_impression`, `Id_client`, `designations`, `pliage`, `Id_lamination`) VALUES (:id, :nom, :date_param, :type_enr, :qte, :prix, :longueur, :largeur, :matiere, :impression, :espace_pose, :decoupe, :format, :type_impr, :idClient, :designations, :pliage, :lamination);");
        $res->bindParam(":id",$id);
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

    //Pour l'IA, modifie juste la lettre à la fin (H par I)
    public function genererIdIA(): string {
        $now = microtime(true);
        $milliseconds = sprintf("%03d", ($now - floor($now)) * 1000);

        // Format : YYYYMM - HHMM - SSmmm
        $yearMonth = date("Ym", (int)$now);     // ex : 202506
        $hourMinute = date("Hi", (int)$now);    // ex : 1654
        $second = date("s", (int)$now);         // ex : 36

        $finalDate = $yearMonth . '-' . $hourMinute . '-' . $second . $milliseconds . 'I';

        return $finalDate;
    }

    public function verifNom($nom, $idDevis) {
        $query = $this->pdo->prepare(
            'SELECT * FROM enregistrements 
            WHERE (nom_enregistrement = :nomE OR Id_enregistrement = :nomE)
            AND Id_enregistrement != :idD'
        );
        $query->bindParam(":nomE", $nom);
        $query->bindParam(":idD", $idDevis);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        
        return count($result) > 0;
    }


    public function getLastId(){
        // Utilise la connexion courante pour éviter les problèmes de concurrence
        return $this->pdo->lastInsertId();
    }

    public function duplicateDevis($id){
        $date = date('Y-m-d');
        // 1. Récupérer l'enregistrement original
        $query = $this->pdo->prepare('SELECT * FROM enregistrements WHERE Id_enregistrement = :idD');
        $query->bindParam(':idD', $id);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // 2. Préparer la requête d'insertion
            $insert = $this->pdo->prepare('
                INSERT INTO enregistrements (Id_enregistrement,nom_enregistrement,date,type_enregistrement,
                    quantite,prix,longueur,largeur,espace_pose,decoupe,format,type_impression,pliage,designations,Id_matiere,Id_impr,Id_client,Id_lamination
                ) VALUES (
                    :idE,:nom_enregistrement,:date,:type_enregistrement,:quantite,:prix,:longueur,:largeur,:espace_pose,:decoupe,:format,:type_impression,:pliage,:designations,:Id_matiere,:Id_impr,:Id_client,:Id_lamination
                )
            ');

            // 3. Ajouter " - Copy" au nom et définir les variables
            $newId = $this->genererId();
            $nom = $result['nom_enregistrement'] . ' - Copy';
            $type = $result['type_enregistrement'];
            $quantite = $result['quantite'];
            $prix = $result['prix'];
            $longueur = $result['longueur'];
            $largeur = $result['largeur'];
            $espace_pose = $result['espace_pose'];
            $decoupe = $result['decoupe'];
            $format = $result['format'];
            $impression = $result['type_impression'];
            $pliage = $result['pliage'];
            $designations = $result['designations'];
            $id_matiere = $result['Id_matiere'];
            $id_impr = $result['Id_impr'];
            $id_client = $result['Id_client'];
            $id_lamination = $result['Id_lamination'];

            // 4. Bind des paramètres
            $insert->bindParam(':idE', $newId);
            $insert->bindParam(':nom_enregistrement', $nom);
            $insert->bindParam(':date', $date);
            $insert->bindParam(':type_enregistrement', $type);
            $insert->bindParam(':quantite', $quantite);
            $insert->bindParam(':prix', $prix);
            $insert->bindParam(':longueur', $longueur);
            $insert->bindParam(':largeur', $largeur);
            $insert->bindParam(':espace_pose', $espace_pose);
            $insert->bindParam(':decoupe', $decoupe);
            $insert->bindParam(':format', $format);
            $insert->bindParam(':type_impression', $impression);
            $insert->bindParam(':pliage', $pliage);
            $insert->bindParam(':designations', $designations);
            $insert->bindParam(':Id_matiere', $id_matiere);
            $insert->bindParam(':Id_impr', $id_impr);
            $insert->bindParam(':Id_client', $id_client);
            $insert->bindParam(':Id_lamination', $id_lamination);

            // 5. Exécuter l'insertion
            $insert->execute();
        }
    }

    public function modifClientDevis($idDevis,$idClient,$nomDevis){
        $res=$this->pdo->prepare("UPDATE enregistrements SET nom_enregistrement=:nom, Id_client=:idClient WHERE Id_enregistrement=:idDevis");
        $res->bindParam(":nom",$nomDevis);
        $res->bindParam(":idDevis",$idDevis);
        $res->bindParam(":idClient",$idClient);
        $res->execute();
    }

}


