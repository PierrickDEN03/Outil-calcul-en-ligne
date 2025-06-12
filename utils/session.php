<?php
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

//On conserve juste le premier paramètre $action dans l'url
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'javascript:history.back()';
$cleanUrl = preg_replace('/&.*/', '', $referer);

echo '<a href="' . htmlspecialchars($cleanUrl) . '" class="back-link">← Page précédente</a>';

if (!empty($_SESSION)) {
    echo '<p style="text-align:center;">Vous êtes connecté(e) en tant que ' . $_SESSION['Pseudo'] . '.<br> Cliquez sur les liens suivants pour vous déconnecter ou modifier votre profil :</p>';
    echo '<div class="link_nav" style="justify-content:center;"><a href="../app/login.php?action=modif">Modifier mon profil</a> - <a href="../app/login.php?action=deconnexion">Me déconnecter</a></div>';
} else {
    echo '<p style="text-align:center;">Cliquez sur le lien suivant pour accéder à la page de connexion : <a href="../app/login.php">Se rendre sur la page</a></p>';
}
?>
