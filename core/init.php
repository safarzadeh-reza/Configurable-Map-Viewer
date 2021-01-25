<?php
include 'database/connection.php';
include 'classes/user.php';
include 'classes/follow.php';
include 'classes/tweet.php';

global $pdo;

session_start();

$getFromU = new User($pdo);
$getFromT = new Tweet($pdo);
$getFromF = new Follow($pdo);

define("BASE_URL", "http://172.16.0.14:8080/cmv/")

?>