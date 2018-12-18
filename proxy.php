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
        $query = "SELECT uId FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId']) {
                exit(false);
            }
        }
        $query = "INSERT INTO hyperwave VALUES (
            NULL, /* id */
            '" . date('Y-m-d H:i:s') . "', /* tsp */
            '" . $_POST['uId'] . "', /* uId */
            '" . $_POST['uPw'] . "', /* uPw */
            NULL, /* lvl */
            NULL, /* highScore */
            NULL, /* code */
            NULL, /* readyState */
            NULL, /* map */
            NULL, /* job */
            NULL, /* wave */
            NULL, /* hp */
            NULL, /* playerPosX */
            NULL, /* playerPosY */
            NULL, /* playerRot */
            NULL, /* leftHandPosX */
            NULL, /* leftHandPosY */
            NULL, /* leftHandRot */
            NULL, /* rightHandPosX */
            NULL, /* rightHandPosY */
            NULL /* rightHandRot */
            )";
        $result = mysqli_query($connect, $query);
        exit($result);

    case 'signIn':
        if (!$_POST['uId'] || !$_POST['uPw']) {
            exit(false);
        }
        $query = "SELECT * FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId'] && $_POST['uPw'] == $data['uPw']) {
                exit(true);
            }
        }
        exit(false);

    case 'queCreate':
        $query = "SELECT code FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['code'] == $data['code']) {
                exit(true);
            }
        }
        $query = "UPDATE hyperwave SET code = '" . $_POST['code'] . "' WHERE uId = '" . $_POST['uId'] . "'";
        mysqli_query($connect, $query);
        exit(false);
    
    case 'queJoin':
        $query = "SELECT code FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['code'] == $data['code']) {
                exit(true);
            }
        }
        $query = "UPDATE hyperwave SET code = '" . $_POST['code'] . "' WHERE uId = '" . $_POST['uId'] . "'";
        mysqli_query($connect, $query);
        exit(false);

    case 'fetchLevel':
        $query = "SELECT * FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_COOKIE['uId'] == $data['uId']) {
                exit($data['lvl']);
            }
        }
        exit(false);

    case 'fetchHighScore':
        $query = "SELECT * FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_COOKIE['uId'] == $data['uId']) {
                exit($data['highscore']);
            }
        }
        exit(false);

    case 'fetchData':
        $query = "SELECT * FROM hyperwave";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId']) {
                $dataArray = array(
                    'map' => $data['map'],
                    'wave' => intval($data['wave']),
                    'hp' => intval($data['hp']),
                    'job' => $data['job'],
                    'playerPosX' => floatval($data['playerPosX']),
                    'playerPosY' => floatval($data['playerPosY']),
                    'playerRot' => floatval($data['playerRot']),
                    'leftHandPosX' => floatval($data['leftHandPosX']),
                    'leftHandPosY' => floatval($data['leftHandPosY']),
                    'leftHandRot' => floatval($data['leftHandRot']),
                    'rightHandPosX' => floatval($data['rightHandPosX']),
                    'rightHandPosY' => floatval($data['rightHandPosY']),
                    'rightHandRot' => floatval($data['rightHandRot'])
                );
                exit(json_encode($dataArray));
            }
        }
        exit;
    
    case 'updateReadyState':
        $query = "UPDATE hyperwave SET readyState = '" . $_POST['readyState'] . "' WHERE uId='" . $_POST['uId'] . "'";
        mysqli_query($connect, $query);
        exit;

    case 'updateData':
        $query = "UPDATE hyperwave SET
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
