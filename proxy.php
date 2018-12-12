<?
// if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
//     header('HTTP/1.0 403 Forbidden');
//     die('<meta http-equiv="refresh" content="0;url=/">');
// }
date_default_timezone_set('KST');
$connect = mysqli_connect('localhost:3307', 'sunrin', 'AccountForSunrin', 'sunrin') or die(0);
$sever = 'https://hyperwave.hyunwoo.org/';

switch ($_POST['do']) {
    case 'register':
        if(!$_POST['uId'] || !$_POST['uPw']) die(false);
        $overlap = false;
        $query = "SELECT uId FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId']) {
                die(false);
            }
        }

        $query = "INSERT INTO hyperwave_accounts VALUES (NULL, '" . $_POST['uId'] . "', '" . $_POST['uPw'] . "' , '" . date('Y-m-d H:i:s') . "')";
        $result = mysqli_query($connect, $query);
        die($result);
        break;

    case 'signIn':
        if(!$_POST['uId'] || !$_POST['uPw']) die(false);
        $query = "SELECT * FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId'] && $_POST['uPw'] == $data['uPw']) {
                die(true);
            }
        }
        die(false);
        break;

    case 'update':

    default:
        return false;
}
