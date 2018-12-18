<?
if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    header('HTTP/1.0 403 Forbidden');
    die('<meta http-equiv="refresh" content="0;url=/">');
}
date_default_timezone_set('KST');
$connect = mysqli_connect('localhost:3307', 'sunrin', 'AccountForSunrin', 'sunrin') or exit(false);
$sever = 'https://hyperwave.hyunwoo.org/';

switch ($_POST['do']) {
    case 'register':
        if (!$_POST['uId'] || !$_POST['uPw']) {
            die(false);
        }
        $overlap = false;
        $query = "SELECT uId FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId']) {
                exit(false);
            }
        }
        $query = "INSERT INTO hyperwave_accounts VALUES (NULL, '" . $_POST['uId'] . "', '" . $_POST['uPw'] . "' , '" . date('Y-m-d H:i:s') . "')";
        $result = mysqli_query($connect, $query);
        exit($result);

    case 'signIn':
        if (!$_POST['uId'] || !$_POST['uPw']) {
            exit(false);
        }
        $query = "SELECT * FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId'] && $_POST['uPw'] == $data['uPw']) {
                exit(true);
            }
        }
        exit(false);

    case 'queCreate':
        $query = "SELECT code FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['code'] == $data['code']) {
                exit(true);
            }
        }
        $query = "UPDATE hyperwave_accounts SET code = '" . $_POST['code'] . "' WHERE uId = '" . $_POST['uId'] . "'";
        mysqli_query($connect, $query);
        exit(false);

    case 'fetchLevel':
        $query = "SELECT * FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_COOKIE['uId'] == $data['uId']) {
                exit($data['lvl']);
            }
        }
        exit(false);

    case 'fetchHighScore':
        $query = "SELECT * FROM hyperwave_accounts";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_COOKIE['uId'] == $data['uId']) {
                exit($data['highscore']);
            }
        }
        exit(false);

    case 'fetchData':
        $query = "SELECT * FROM hyperwave_game";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId']) {
                $dataArray = array(
                    'map' => $data['map'],
                    'wave' => $data['wave'],
                    'hp' => $data['hp'],
                    'job' => $data['job'],
                    'playerPosX' => $data['playerPosX'],
                    'playerPosY' => $data['playerPosY'],
                    'playerRot' => $data['playerRot'],
                    'leftHandPosX' => $data['leftHandPosX'],
                    'leftHandPosY' => $data['leftHandPosY'],
                    'leftHandRot' => $data['leftHandRot'],
                    'rightHandPosX' => $data['rightHandPosX'],
                    'rightHandPosY' => $data['rightHandPosY'],
                    'rightHandRot' => $data['rightHandRot']
                );
                exit(json_encode($dataArray));
            }
        }
        exit;

    case 'updateData':
        $query = "UPDATE hyperwave_game SET
            wave = '" . $_POST['wave'] . "',
            hp = '" . $_POST['hp'] . "',
            job = '" . $_POST['job'] . "',
            playerPosX = '" . $_POST['playerPosX'] . "',
            playerPosY = '" . $_POST['playerPosY'] . "',
            playerRot = '" . $_POST['playerRot'] . "',
            leftHandPosX = '" . $_POST['leftHandPosX'] . "',
            leftHandPosY = '" . $_POST['leftHandPosY'] . "',
            leftHandRot = '" . $_POST['leftHandRot'] . "',
            rightHandPosX = '" . $_POST['rightHandPosX'] . "',
            rightHandPosY = '" . $_POST['rightHandPosY'] . "',
            rightHandRot = '" . $_POST['rightHandRot'] . "',
            WHERE uId='" . $_POST['uId'] . "'";
        mysqli_query($connect, $query);
        exit;

    default:
        exit(false);
}
