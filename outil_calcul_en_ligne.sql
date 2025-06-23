-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 23 juin 2025 à 10:00
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `outil_calcul_en_ligne`
--

-- --------------------------------------------------------

--
-- Structure de la table `adresses`
--

CREATE TABLE `adresses` (
  `Id_adresse` int(11) NOT NULL,
  `priorite_adresse` int(11) NOT NULL,
  `rue` varchar(300) NOT NULL,
  `code_postal` varchar(300) NOT NULL,
  `ville` varchar(300) NOT NULL,
  `Id_entreprise` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adresses`
--

INSERT INTO `adresses` (`Id_adresse`, `priorite_adresse`, `rue`, `code_postal`, `ville`, `Id_entreprise`) VALUES
(-1, 1, 'Non renseigné', 'Non renseigné', 'Non renseigné', -1),
(35, 1, '30 rue de la Meue', '42400', 'Saint-Chamond', 32),
(36, 2, '4 bis clos dupont', '42400', 'Saint-Chamond', 32),
(37, 3, '38 rue de la paix', '42000', 'Saint-Etienne', 32),
(38, 1, 'Non renseigné', '00000', 'Non renseigné', 33);

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `Id_client` int(11) NOT NULL,
  `priorite` int(11) NOT NULL,
  `nom_prenom` text NOT NULL,
  `mail` text NOT NULL,
  `telephone` varchar(300) NOT NULL,
  `fixe` varchar(300) NOT NULL,
  `entreprise_Id` int(11) NOT NULL,
  `adresse_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `clients`
--

INSERT INTO `clients` (`Id_client`, `priorite`, `nom_prenom`, `mail`, `telephone`, `fixe`, `entreprise_Id`, `adresse_Id`) VALUES
(-1, 1, 'Non renseigné', '2025-06-18 16:32:05', '0000000000', '0000000000', -1, -1),
(54, 2, 'Dupond Jean', 'dupont@gmail.com', '0775145134', '0387226151', 32, 35),
(55, 1, 'Babolat Tristan', 'babolat@gmail.com', '9077514136', '0180912695', 32, 35),
(57, 1, 'Phillipe Paul', 'paul@gmail.com', '0867617411', '0000000011', 33, 38),
(58, 3, 'Edouard Leclerc', 'el@gmail.com', '0616164234', '0181907198', 32, 37);

-- --------------------------------------------------------

--
-- Structure de la table `decoupe`
--

CREATE TABLE `decoupe` (
  `Id_decoupe` int(11) NOT NULL,
  `prix_decoupe` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `decoupe`
--

INSERT INTO `decoupe` (`Id_decoupe`, `prix_decoupe`) VALUES
(1, 20.02);

-- --------------------------------------------------------

--
-- Structure de la table `degressif_impression`
--

CREATE TABLE `degressif_impression` (
  `Id_deg_matiere` int(11) NOT NULL,
  `min` int(11) NOT NULL,
  `max` int(11) NOT NULL,
  `prix` double NOT NULL COMMENT 'Coefficient multiplicateur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `degressif_impression`
--

INSERT INTO `degressif_impression` (`Id_deg_matiere`, `min`, `max`, `prix`) VALUES
(2, 101, 300, 0.8),
(3, 301, 800, 0.5),
(7, 1, 100, 1);

-- --------------------------------------------------------

--
-- Structure de la table `degressif_matiere`
--

CREATE TABLE `degressif_matiere` (
  `Id_deg_matiere` int(11) NOT NULL,
  `min` int(11) DEFAULT NULL,
  `max` int(11) NOT NULL,
  `prix_surface` double NOT NULL COMMENT 'Coefficient multiplicateur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `degressif_matiere`
--

INSERT INTO `degressif_matiere` (`Id_deg_matiere`, `min`, `max`, `prix_surface`) VALUES
(2, 101, 300, 0.8),
(4, 0, 100, 1),
(5, 301, 800, 0.5);

-- --------------------------------------------------------

--
-- Structure de la table `enregistrements`
--

CREATE TABLE `enregistrements` (
  `Id_enregistrement` int(11) NOT NULL,
  `nom_enregistrement` varchar(300) NOT NULL,
  `date` date NOT NULL,
  `type_enregistrement` varchar(300) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix` double NOT NULL,
  `longueur` double NOT NULL,
  `largeur` double NOT NULL,
  `espace_pose` double NOT NULL,
  `decoupe` varchar(300) NOT NULL,
  `format` varchar(300) NOT NULL,
  `type_impression` varchar(300) NOT NULL,
  `pliage` varchar(300) NOT NULL,
  `designations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`designations`)),
  `Id_matiere` int(11) NOT NULL,
  `Id_impr` int(11) NOT NULL,
  `Id_client` int(11) NOT NULL,
  `Id_lamination` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `enregistrements`
--

INSERT INTO `enregistrements` (`Id_enregistrement`, `nom_enregistrement`, `date`, `type_enregistrement`, `quantite`, `prix`, `longueur`, `largeur`, `espace_pose`, `decoupe`, `format`, `type_impression`, `pliage`, `designations`, `Id_matiere`, `Id_impr`, `Id_client`, `Id_lamination`) VALUES
(144, '202506-1549-46980H', '2025-06-20', 'Matière', 13, 114.58, 45, 65, 0, 'Non', '', '', '', '[]', 2, -1, -1, 1),
(145, '202506-1551-31665H', '2025-06-20', 'Matière', 13, 141.69, 79, 45, 0, 'Non', '', '', '', '[]', 9, -1, -1, 1),
(146, '202506-1554-19974H', '2025-06-20', 'Feuille', 864, 11273.76, 0, 0, 0, '', 'A5', 'Recto', 'Oui', '[]', -1, 10, -1, -1),
(147, '202506-1555-17556H', '2025-06-20', 'Feuille', 864, 11273.76, 0, 0, 0, '', 'A5', 'Recto', 'Non', '[]', -1, 10, -1, -1),
(148, 'test', '2025-06-21', 'Feuille', 76, 1031.96, 0, 0, 0, '', 'A6', 'Recto', 'Oui', '[]', -1, 11, 58, -1),
(149, '202506-1632-52394H', '2025-06-21', 'Feuille', 764, 10453.76, 0, 0, 0, '', 'A4', 'Recto', 'Oui', '[]', -1, 10, -1, -1),
(150, '202506-1636-46994H', '2025-06-21', 'Feuille', 76, 1031.96, 0, 0, 0, '', 'A6', 'Recto', 'Non', '[]', -1, 11, 57, -1),
(151, 'LDevis', '2025-06-21', 'Feuille', 76, 1031.96, 0, 0, 0, '', 'A6', 'Recto', 'Non', '[]', -1, 11, -1, -1),
(152, '202506-0841-30884H', '2025-06-23', 'Feuille', 43, 606.41, 0, 0, 0, '', 'A7', 'Recto/Verso', 'Oui', '[]', -1, 11, -1, -1),
(154, '202506-0850-27788H', '2025-06-23', 'Matière', 11, 222, 76, 53, 12, 'Oui', '', '', '', '[]', 2, -1, -1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `Id_entreprise` int(11) NOT NULL,
  `nom_entreprise` varchar(300) NOT NULL,
  `mail` varchar(300) NOT NULL,
  `telephone` varchar(300) NOT NULL,
  `siret` varchar(300) NOT NULL,
  `Id_paiement` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`Id_entreprise`, `nom_entreprise`, `mail`, `telephone`, `siret`, `Id_paiement`) VALUES
(-1, 'Non renseigné', 'Non renseigné', '00000000', 'Non renseigné', 1),
(32, 'Total', 'total@gmail.com', '0709725411', '98278526436534', 1),
(33, 'Leclerc', 'Non renseigné', 'Non renseigné', 'Non renseigné', 1);

-- --------------------------------------------------------

--
-- Structure de la table `frais_fixe_impr`
--

CREATE TABLE `frais_fixe_impr` (
  `Id_frais` int(11) NOT NULL,
  `prix_frais` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `frais_fixe_impr`
--

INSERT INTO `frais_fixe_impr` (`Id_frais`, `prix_frais`) VALUES
(1, 28.3);

-- --------------------------------------------------------

--
-- Structure de la table `frais_fixe_mat`
--

CREATE TABLE `frais_fixe_mat` (
  `Id_frais` int(11) NOT NULL,
  `prix_frais` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `frais_fixe_mat`
--

INSERT INTO `frais_fixe_mat` (`Id_frais`, `prix_frais`) VALUES
(1, 28.05);

-- --------------------------------------------------------

--
-- Structure de la table `impressions`
--

CREATE TABLE `impressions` (
  `Id_papier` int(11) NOT NULL,
  `nom_papier` varchar(300) NOT NULL,
  `grammage` int(11) NOT NULL COMMENT 'en g',
  `code_matiere` varchar(300) NOT NULL,
  `prix_recto` float NOT NULL COMMENT 'en €',
  `prix_recto_verso` float NOT NULL COMMENT 'en €'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `impressions`
--

INSERT INTO `impressions` (`Id_papier`, `nom_papier`, `grammage`, `code_matiere`, `prix_recto`, `prix_recto_verso`) VALUES
(-1, 'Non renseigné', 0, '000000', 0, 0),
(10, 'Bâche', 87, 'BÂCHE87', 5, 8.3),
(11, 'Mat', 56, 'MAT56', 3, 4);

-- --------------------------------------------------------

--
-- Structure de la table `laminations`
--

CREATE TABLE `laminations` (
  `Id_lamination` int(11) NOT NULL,
  `description` varchar(300) NOT NULL,
  `prix_lamination` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `laminations`
--

INSERT INTO `laminations` (`Id_lamination`, `description`, `prix_lamination`) VALUES
(-1, 'Non renseigné', 0),
(1, 'brillante ou mat test', 12),
(2, '3D', 8.5),
(3, 'effaçable ou anti Graff', 3.5);

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

CREATE TABLE `matieres` (
  `Id_matiere` int(11) NOT NULL,
  `nom_matiere` varchar(300) NOT NULL,
  `code_matiere` varchar(300) NOT NULL,
  `prix_mcarre` double NOT NULL COMMENT '(en €)',
  `type_matiere` varchar(300) NOT NULL,
  `laizes` int(11) NOT NULL COMMENT '(en cm)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`Id_matiere`, `nom_matiere`, `code_matiere`, `prix_mcarre`, `type_matiere`, `laizes`) VALUES
(-1, 'Non renseigné', '0000000', 0, 'Non renseigné', 0),
(2, 'Bâche 510g', 'B510', 8.5, 'Bâche', 134),
(5, 'Mat 200g', 'ABCDEED', 12, 'Bâche', 134),
(9, 'papier 150g', 'PAPIE150', 9, 'papier', 137);

-- --------------------------------------------------------

--
-- Structure de la table `modalites_paiement`
--

CREATE TABLE `modalites_paiement` (
  `Id_paiement` int(11) NOT NULL,
  `label_paiement` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `modalites_paiement`
--

INSERT INTO `modalites_paiement` (`Id_paiement`, `label_paiement`) VALUES
(1, 'Chèque'),
(2, 'Virement'),
(3, 'Espèces');

-- --------------------------------------------------------

--
-- Structure de la table `nb_impressions_page`
--

CREATE TABLE `nb_impressions_page` (
  `format_impression` text NOT NULL,
  `nb_par_page` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `nb_impressions_page`
--

INSERT INTO `nb_impressions_page` (`format_impression`, `nb_par_page`) VALUES
('A4', 2),
('A5', 4),
('A6', 8),
('A3', 1),
('A7', 16),
('10x21 (DL)', 6);

-- --------------------------------------------------------

--
-- Structure de la table `pliage`
--

CREATE TABLE `pliage` (
  `Id_pliage` int(11) NOT NULL,
  `prix_pliage` double NOT NULL,
  `frais_fixe` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pliage`
--

INSERT INTO `pliage` (`Id_pliage`, `prix_pliage`, `frais_fixe`) VALUES
(1, 12.35, 35.06);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `Id_user` int(11) NOT NULL,
  `pseudo` varchar(300) NOT NULL,
  `mdp` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`Id_user`, `pseudo`, `mdp`) VALUES
(1, 'root', 'aaa');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adresses`
--
ALTER TABLE `adresses`
  ADD PRIMARY KEY (`Id_adresse`) USING BTREE,
  ADD KEY `entreprise_id_adresse` (`Id_entreprise`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`Id_client`),
  ADD KEY `id_entreprise` (`entreprise_Id`),
  ADD KEY `id_adresse` (`adresse_Id`);

--
-- Index pour la table `decoupe`
--
ALTER TABLE `decoupe`
  ADD PRIMARY KEY (`Id_decoupe`);

--
-- Index pour la table `degressif_impression`
--
ALTER TABLE `degressif_impression`
  ADD PRIMARY KEY (`Id_deg_matiere`);

--
-- Index pour la table `degressif_matiere`
--
ALTER TABLE `degressif_matiere`
  ADD PRIMARY KEY (`Id_deg_matiere`);

--
-- Index pour la table `enregistrements`
--
ALTER TABLE `enregistrements`
  ADD PRIMARY KEY (`Id_enregistrement`),
  ADD KEY `Client_contrainte` (`Id_client`),
  ADD KEY `Lamination_contrainte` (`Id_lamination`),
  ADD KEY `Matiere_contrainte_impr` (`Id_impr`),
  ADD KEY `Matiere_contrainte_mat` (`Id_matiere`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`Id_entreprise`),
  ADD KEY `Id_paiement` (`Id_paiement`);

--
-- Index pour la table `frais_fixe_impr`
--
ALTER TABLE `frais_fixe_impr`
  ADD PRIMARY KEY (`Id_frais`);

--
-- Index pour la table `frais_fixe_mat`
--
ALTER TABLE `frais_fixe_mat`
  ADD PRIMARY KEY (`Id_frais`);

--
-- Index pour la table `impressions`
--
ALTER TABLE `impressions`
  ADD PRIMARY KEY (`Id_papier`,`nom_papier`);

--
-- Index pour la table `laminations`
--
ALTER TABLE `laminations`
  ADD PRIMARY KEY (`Id_lamination`);

--
-- Index pour la table `matieres`
--
ALTER TABLE `matieres`
  ADD PRIMARY KEY (`Id_matiere`,`nom_matiere`);

--
-- Index pour la table `modalites_paiement`
--
ALTER TABLE `modalites_paiement`
  ADD PRIMARY KEY (`Id_paiement`);

--
-- Index pour la table `pliage`
--
ALTER TABLE `pliage`
  ADD PRIMARY KEY (`Id_pliage`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id_user`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adresses`
--
ALTER TABLE `adresses`
  MODIFY `Id_adresse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `Id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT pour la table `decoupe`
--
ALTER TABLE `decoupe`
  MODIFY `Id_decoupe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `degressif_impression`
--
ALTER TABLE `degressif_impression`
  MODIFY `Id_deg_matiere` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `degressif_matiere`
--
ALTER TABLE `degressif_matiere`
  MODIFY `Id_deg_matiere` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `enregistrements`
--
ALTER TABLE `enregistrements`
  MODIFY `Id_enregistrement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `Id_entreprise` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `frais_fixe_impr`
--
ALTER TABLE `frais_fixe_impr`
  MODIFY `Id_frais` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `frais_fixe_mat`
--
ALTER TABLE `frais_fixe_mat`
  MODIFY `Id_frais` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `impressions`
--
ALTER TABLE `impressions`
  MODIFY `Id_papier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `laminations`
--
ALTER TABLE `laminations`
  MODIFY `Id_lamination` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `matieres`
--
ALTER TABLE `matieres`
  MODIFY `Id_matiere` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `modalites_paiement`
--
ALTER TABLE `modalites_paiement`
  MODIFY `Id_paiement` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `pliage`
--
ALTER TABLE `pliage`
  MODIFY `Id_pliage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `Id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `adresses`
--
ALTER TABLE `adresses`
  ADD CONSTRAINT `entreprise_id_adresse` FOREIGN KEY (`Id_entreprise`) REFERENCES `entreprises` (`Id_entreprise`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `id_adresse` FOREIGN KEY (`adresse_Id`) REFERENCES `adresses` (`Id_adresse`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id_entreprise` FOREIGN KEY (`entreprise_Id`) REFERENCES `entreprises` (`Id_entreprise`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `enregistrements`
--
ALTER TABLE `enregistrements`
  ADD CONSTRAINT `Client_contrainte` FOREIGN KEY (`Id_client`) REFERENCES `clients` (`Id_client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Lamination_contrainte` FOREIGN KEY (`Id_lamination`) REFERENCES `laminations` (`Id_lamination`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Matiere_contrainte_impr` FOREIGN KEY (`Id_impr`) REFERENCES `impressions` (`Id_papier`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Matiere_contrainte_mat` FOREIGN KEY (`Id_matiere`) REFERENCES `matieres` (`Id_matiere`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD CONSTRAINT `Id_paiement` FOREIGN KEY (`Id_paiement`) REFERENCES `modalites_paiement` (`Id_paiement`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
