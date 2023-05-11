<?php
include("conexao.php");

$email = $_POST["email"];
$nome = $_POST["nome"];
$senha = $_POST["senha"];
$cpf = $_POST["cpf"];

$sql = "INSERT INTO usuarios (email, nome, senha, cpf) VALUES ('$email', '$nome', '$senha', '$cpf')";

if (mysqli_query($conexao, $sql)) {
    echo "Cadastro realizado com sucesso!";
} else {
    echo "Erro ao cadastrar: " . mysqli_error($conexao);
}

mysqli_close($conexao);
?>