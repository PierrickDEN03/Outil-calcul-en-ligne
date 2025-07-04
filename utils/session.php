<?php

// CSS 
echo '
<style>
    p {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
        text-align:center;
        line-height: 1.6;
    }
    a {
        text-align: center;
        margin-bottom: 30px;
        color: #555;
        text-decoration: none;
        display: block;
    }
    a:hover {
        text-decoration: underline;
    }
    .back-link {
        position: absolute;
        top: 20px;
        left: 20px;
    }
    .link_nav {
        display:flex;
        gap:5px;
    }
</style>
';

// ---------- Historique d'URL ----------

// Récupérer URL actuelle
$currentUrl = $_SERVER['REQUEST_URI'];
$parsedCurrent = parse_url($currentUrl);
$currentPath = $parsedCurrent['path'] ?? '';
$currentQuery = $parsedCurrent['query'] ?? '';
parse_str($currentQuery, $currentParams);
$currentAction = $currentParams['action'] ?? '';

// Construire clé métier
if ($currentPath === '/index.php' || $currentPath === '/') {
    $currentPageKey = 'index';
} else {
    $currentPageKey = $currentPath;
    if ($currentAction !== '') {
        $currentPageKey .= '?action=' . $currentAction;
    }
}

// Initialiser historique si besoin
if (!isset($_SESSION['url_history'])) {
    $_SESSION['url_history'] = [];
}

// Empiler seulement si différent de la dernière entrée métier
$lastEntry = end($_SESSION['url_history']) ?: null;

if (!$lastEntry || $lastEntry['page_key'] !== $currentPageKey) {
    $_SESSION['url_history'][] = [
        'url' => $currentUrl,
        'page_key' => $currentPageKey,
    ];
}

// Chercher la dernière URL métier différente
$previousUrl = '/'; // par défaut

for ($i = count($_SESSION['url_history']) - 2; $i >= 0; $i--) {
    $entry = $_SESSION['url_history'][$i];
    if ($entry['page_key'] !== $currentPageKey) {
        $previousUrl = $entry['url'];
        break;
    }
}

// Affichage du lien retour
echo '<a href="' . htmlspecialchars($previousUrl) . '" class="back-link">← Page précédente</a>';

// ---------- Infos utilisateur ----------

if (!empty($_SESSION['Pseudo'])) {
    echo '<p style="text-align:center;">Vous êtes connecté(e) en tant que ' . htmlspecialchars($_SESSION['Pseudo']) . '.<br> Cliquez sur les liens suivants pour vous déconnecter ou modifier votre profil :</p>';
    echo '<div class="link_nav" style="justify-content:center;"><a href="../app/login.php?action=modif">Modifier mon profil</a> - <a href="../app/login.php?action=deconnexion">Me déconnecter</a></div>';
} else {
    echo '<p style="text-align:center;">Cliquez sur le lien suivant pour accéder à la page de connexion : <a href="../app/login.php">Se rendre sur la page</a></p>';
}

?>
