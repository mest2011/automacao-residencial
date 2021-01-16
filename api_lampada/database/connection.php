<?php
class Db
{
    // private $DB_PORT = '127.0.0.1:3306';
    // private $DB_USER = 'root';
    // private $DB_PASSWORD = 'root';
    // private $DB_DATABASE = 'IOT';

    private $DB_PORT = '45.13.252.148:3306';
    private $DB_USER = 'u292793146_iot';
    private $DB_PASSWORD = 'X34xznz7a^';
    private $DB_DATABASE = 'u292793146_iot';



    function connect()
    {
        $conn = mysqli_connect($this->DB_PORT, $this->DB_USER, $this->DB_PASSWORD) or die("Erro na conexão: " . mysqli_error($conn));

        mysqli_select_db($conn, $this->DB_DATABASE) or die("Erro ao selecionar o banco: " . mysqli_error($conn));

        return $conn;
    }

    function close($conn){
        mysqli_close($conn);
    }
}


?>