<?PHP

include_once "controller/lampada_controller.php";


//GET
if ($_SERVER['REQUEST_METHOD'] === "GET" and isset($_GET['name'])) {
    //v1
    if (isset($_GET['status']) and $_GET['status'] === "status") {
        $lampCon = new Lampada($_GET['name']);

        print_r(json_encode($lampCon->status(), true));
    }
    //v2
    if (isset($_GET['function']) and $_GET['function'] === "status") {
        $lampCon = new Lampada($_GET['name']);

        print_r(json_encode($lampCon->status(), true));
    }
}


try {
    //POST
    if ($_SERVER['REQUEST_METHOD'] === "POST") {

        //v1
        if (isset($_GET['name'], $_GET['status'])) {
            $lampCon = new Lampada($_GET['name']);
            print_r(json_encode($lampCon->on_off($_GET['status'])));
        }
        //v2
        if (isset($_GET['name'])) {
            $lampCon = new Lampada($_GET['name']);
            if (isset($_GET['color'])) {
                print_r(json_encode($lampCon->color("#".$_GET['color'])));
            }
            if (isset($_GET['intensity'])) {
                print_r(json_encode($lampCon->intensity($_GET['intensity'])));
            }
            if (isset($_GET['function'])) {
                print_r(json_encode($lampCon->function($_GET['function'])));
            }
            if (isset($_GET['turn_on_off'])) {
                print_r(json_encode($lampCon->turn_on_off($_GET['turn_on_off'])));
            }
            if (isset($_GET['duration'])) {
                print_r(json_encode($lampCon->duration($_GET['duration'])));
            }
        }
    }
} catch (\Throwable $th) {
    print_r(json_encode("erro"));
}
