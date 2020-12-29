<?PHP

include_once "controller/lampada_controller.php";

//GET
    if ($_SERVER['REQUEST_METHOD'] === "GET" and isset($_GET['name'])) {
        if ($_GET['status'] = "status") {
            $lampCon = new Lampada($_GET['name']);

            print_r(json_encode($lampCon->status(), true));
        }
    }

//POST
    //on off
    if($_SERVER['REQUEST_METHOD'] === "POST"){
        if (isset($_GET['name'], $_GET['status'])) {
            $lampCon = new Lampada($_GET['name']);
            print_r(json_encode($lampCon->on_off($_GET['status'])));
        }
    }
    

?>