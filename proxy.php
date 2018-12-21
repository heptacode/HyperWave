<?
// if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
//     header('HTTP/1.0 403 Forbidden');
//     exit('<meta http-equiv="refresh" content="0;url=/">');
// }
date_default_timezone_set('KST');
$connect = mysqli_connect('localhost:3307', 'sunrin', 'AccountForSunrin', 'sunrin') or exit(false);
$sever = 'https://hyperwave.hyunwoo.org/';

switch ($_POST['do']) {
    case 'register':
        if (!$_POST['uId'] || !$_POST['uPw']) {
            mysqli_close($connect);
            exit(false);
        }
        strChk($_POST['uId']);
        $query = "SELECT uId FROM hyperwave_accounts WHERE uId = '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['uId']) {
                mysqli_close($connect);
                exit(false);
            }
        }
        $query = "INSERT INTO hyperwave_accounts VALUES (
            NULL, /* id */
            '" . date('Y-m-d H:i:s') . "', /* tsp */
            '" . $_POST['uId'] . "', /* uId */
            '" . $_POST['uPw'] . "', /* uPw */
            '" . $_POST['level'] . "', /* level */
            '0', /* highScore */
            '', /* code */
            '0', /* readyState */
            '', /* job */
            '10' /* hp */
            )";
        $result = mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($result ? true : false);

    case 'signIn':
        if (!$_POST['uId'] || !$_POST['uPw']) {
            mysqli_close($connect);
            exit(false);
        }
        strChk($_POST['uId']);
        $query = "SELECT uId, uPw FROM hyperwave_accounts WHERE uId = '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uPw'] == $data['uPw']) {
                mysqli_close($connect);
                exit(true);
            }
        }
        mysqli_close($connect);
        exit(false);

    case 'queCreate':
        $query = "SELECT code FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['code'] == $data['code']) {
                mysqli_close($connect);
                exit(false);
            }
        }
        $query = "UPDATE hyperwave_accounts SET code = '" . $_POST['code'] . "' WHERE uId = '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        
        $playerArray = array(
            0 => array(
                "uId" => $_POST['uId'],
                "job" => $_POST['job'],
                "readyState" => $_POST['readyState'],
                "wave" => 1,
                "hp" => 0,
                "killCnt" => 0
                )
        );
        $query = "INSERT INTO hyperwave_games VALUES (
            NULL, /* id */
            '" . $_POST['code'] . "', /* code */
            '" . $_POST['uId'] . "', /* host */
            '', /* map */
            0, /* status */
            '" . json_encode($playerArray) . "' /* player */
            )";
        $result2 = mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($result && $result2 ? true : false);

    case 'queJoin':
        $query = "SELECT uId, code FROM hyperwave_accounts WHERE code = '" . $_POST['code'] . "' AND uId != '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        $cnt = 0;
        while (mysqli_fetch_array($result)) {
            $cnt++;
        }
        if ($cnt <= 4) {
            $query = "UPDATE hyperwave_accounts SET code = '" . $_POST['code'] . "' WHERE uId = '" . $_POST['uId'] . "'";
            $result = mysqli_query($connect, $query);
            if (!$result) {
                mysqli_close($connect);
                exit(0);
            }
            $query = "SELECT host, player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
            $result = mysqli_query($connect, $query);
            $data = mysqli_fetch_array($result);
            $host = $data['host'];
            $player = json_decode($data['player'], true);
            $playerArray = array(
                "uId" => $_POST['uId'],
                "job" => $_POST['job'],
                "readyState" => $_POST['readyState'],
                "wave" => 1,
                "hp" => 0,
                "killCnt" => 0
            );
            array_push($player, $playerArray);
            $query = "UPDATE hyperwave_games SET player = '" . json_encode($player) . "' WHERE code = '" . $_POST['code'] . "'";
            mysqli_query($connect, $query);
            mysqli_close($connect);
            exit($host);
        } else {
            mysqli_close($connect);
            exit(1);
        }
        mysqli_close($connect);
        exit(0);

    case 'queLeave':
        $query = "SELECT host, player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            if ($_POST['uId'] == $data['host']) {
                $query = "UPDATE hyperwave_accounts SET code = '' WHERE uId = '" . $_POST['uId'] . "'";
                mysqli_query($connect, $query);
                $query = "DELETE FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
                mysqli_query($connect, $query);
                mysqli_close($connect);
                exit(true);
            } else {
                $player = json_decode($data['player'], true);
                for($i = 0; $i <=3; $i++){
                    if($player[$i]['uId'] == $_POST['uId'])
                        break;
                }
                array_splice($player, $i, 1);
                $query = "UPDATE hyperwave_games SET player = '" . json_encode($player) . "' WHERE code = '" . $_POST['code'] . "'";
                mysqli_query($connect, $query);

                $query = "UPDATE hyperwave_accounts SET code = '' WHERE uId = '" . $_POST['uId'] . "'";
                mysqli_query($connect, $query);
                mysqli_close($connect);
                exit(true);
            }
        }
        mysqli_close($connect);
        exit(false);

    case 'fetchLevel':
        $query = "SELECT level FROM hyperwave_accounts WHERE uId = '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            mysqli_close($connect);
            exit($data['level']);
        }
        mysqli_close($connect);
        exit(false);

    case 'fetchHighScore':
        $query = "SELECT highScore FROM hyperwave_accounts WHERE uId = '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            mysqli_close($connect);
            exit($data['highScore']);
        }
        mysqli_close($connect);
        exit(false);

    case 'fetchPlayer':
        $query = "SELECT player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        while ($data = mysqli_fetch_array($result)) {
            mysqli_close($connect);
            exit($data['player']);
        }
        mysqli_close($connect);
        exit($result ? true : false);

    case 'updateHp':
        $query = "SELECT player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $player = json_decode($data['player'], true);
        for($i = 0; $i <=3; $i++){
            if($player[$i]['uId'] == $_POST['uId'])
                break;
        }
        $player[$i]['hp'] = $_POST['hp'];
        $query = "UPDATE hyperwave_accounts SET player = '" . $_POST['hp'] . "' WHERE code='" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($result ? true : false);

    case 'updateLevel':
        $query = "SELECT level FROM hyperwave_accounts WHERE uId = '" . $_POST['uId'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $data = json_decode($data['level'], true);
        $data[$_POST['job']]++;

        $query = "UPDATE hyperwave_games SET player = '" . json_encode($data) . "' WHERE code='" . $_POST['code'] . "'";
        mysqli_query($connect, $query);
        mysqli_close($connect);
        exit;

    case 'updateWave':
        $query = "SELECT player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $player = json_decode($data['player'], true);
        for($i = 0; $i <=3; $i++){
            if($player[$i]['uId'] == $_POST['uId'])
                break;
        }
        $player[$i]['wave']++;
        $query = "UPDATE hyperwave_games SET player = '" . json_encode($player) . "' WHERE code='" . $_POST['code'] . "'";
        mysqli_query($connect, $query);
        mysqli_close($connect);
        exit;

    case 'updatePlayer':
        $query = "UPDATE hyperwave_games SET
            player = '" . $_POST['player'] . "'
            WHERE code='" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($result ? true : false);

    case 'updateJob':
        $query = "SELECT player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $player = json_decode($data['player'], true);
        for($i = 0; $i <=3; $i++){
            if($player[$i]['uId'] == $_POST['uId'])
                break;
        }
        $player[$i]['job'] = $_POST['job'];
        $query = "UPDATE hyperwave_games SET player = '" . json_encode($player) . "' WHERE code='" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($result ? true : false);

    case 'updateReadyState':
        $query = "SELECT player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $player = json_decode($data['player'], true);
        for($i = 0; $i <=3; $i++){
            if($player[$i]['uId'] == $_POST['uId'])
                break;
        }
        $player[$i]['readyState'] = $_POST['readyState'] == "true" ? 1 : 0;
        $query = "UPDATE hyperwave_games SET player = '" . json_encode($player) . "' WHERE code='" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($result ? true : false);

    case 'gameStart':
        $query = "SELECT player FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $player = json_decode($data['player'], true);
        for($i = 0; $i <=3; $i++){
            $player[$i]['readyState'] = 0;
        }
        $query = "UPDATE hyperwave_games SET player = '" . json_encode($player) . "' WHERE code='" . $_POST['code'] . "'";
        mysqli_query($connect, $query);

        $query = "UPDATE hyperwave_games SET status = 1 WHERE code='" . $_POST['code'] . "'";
        mysqli_query($connect, $query);
        mysqli_close($connect);
        exit;
    
    case 'fetchGameState':
        $query = "SELECT status FROM hyperwave_games WHERE code = '" . $_POST['code'] . "'";
        $result = mysqli_query($connect, $query);
        $data = mysqli_fetch_array($result);
        $status = $data['status'];
        $query = "UPDATE hyperwave_games SET status = 0 WHERE code='" . $_POST['code'] . "'";
        mysqli_query($connect, $query);
        mysqli_close($connect);
        exit($status ? true : false);

    default:
        exit(false);
}

function strChk($str)
{
    $deny = [
        "guest",
        "test",
        "hyperwave",
        "hyunwoo",
    ];
    for ($i = 0; $i < count($deny); $i++) {
        if (strpos(strtolower($str), $deny[$i]) !== false) {
            exit(false);
        }
    }
}
