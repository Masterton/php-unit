<?php
/**
 * 根据键从数组中获取元素
 *
 * @param $array 数组
 * @param $key   键
 * @param 默认值    default [null]
 *
 * @return mixed
 */
if (!function_exists('array_get')) {
    function array_get($array, $key, $default = null)
    {
        if (is_array($array) && array_key_exists($key, $array)) {
            return $array[$key];
        }

        return $default;
    }
}
/**
 * 判断字符串是否是数字
 *
 * @param $str 字符串
 */
if (!function_exists('text_is_digital')) {
    function text_is_digital($str)
    {
        return preg_match('/^\d+$/', $str);
    }
}
/**
 * 文本加密
 *
 * @param $str 文本
 * @param $secret 混淆字符串
 * @param $rand 混淆次数
 */
function text_encrypt($str, $secret = 'author is gsw945 of cloudkz', $rand = 5)
{
    $result = strval(md5($str)) . $secret;
    for ($i = 0; $i < $rand; $i++) {
        if ($i % 2 == 0) {
            $result = sha1($result);
        }
    }
    return md5($result);
}

/**
 * 获取对称加密
 *
 * @param $secret 密钥
 * @return \phpseclib\Crypt\AES
 */
function getAESCrypt($secret)
{
    $crypto = new \phpseclib\Crypt\AES(\phpseclib\Crypt\AES::MODE_CBC);
    $symkey = generateSymmetricKey($secret, 32);
    $crypto->setKey($symkey);
    $crypto->setIV(str_repeat("\0", $crypto->getBlockLength() >> 3));
    $crypto->enablePadding();

    return $crypto;
}

/**
 * 生成对称密钥
 *
 * @param $str    生成秘钥的字符串
 * @param $length 密钥长度
 */
function generateSymmetricKey($str, $length)
{
    $symkey = '';
    $sequence = 0;
    while (strlen($symkey) < $length) {
        $temp = pack('Na*', $sequence++, $str);
        $symkey .= \ParagonIE\ConstantTime\Hex::decode(sha1($temp));
    }

    return substr($symkey, 0, $length);
}

/**
 * 获取完整的绝对路径(去掉路径中的'./'和'../')
 *
 * @param $path 给定的路径 (例如: __DIR__ . '/../public/upload', 得到'/home/user/path/run/public/upload')
 */
function full_path($path)
{
    $DS = DIRECTORY_SEPARATOR;
    $path = explode($DS, $path);
    $new = [];
    foreach ($path as $dir) {
        if (!strlen($dir)) {
            continue;
        }
        switch ($dir) {
            case '..':
                array_pop($new);
            case '.':
                break;
            default:
                $new[] = $dir;
                break;
        }
    }

    return $DS.implode($DS, $new);
}

/**
 * 合并路径
 *
 * @param $path1 路径1
 * @param $path2 路径2
 */
function merge_path($path1, $path2)
{
    $DS = DIRECTORY_SEPARATOR;
    // windows 带有驱动器盘符，暂未考虑(只考虑linux)
    while (ends_with($path1, $DS) && strlen($path1) > 0) {
        $path1 = substr($path1, 0, -1);
    }
    while (starts_with($path2, $DS) && strlen($path2) > 0) {
        $path2 = substr($path2, 1);
    }
    $paths = [];
    if (!empty($path1)) {
        $paths[] = $path1;
    }
    if (!empty($path2)) {
        $paths[] = $path2;
    }

    return implode($DS, $paths);
}

/**
 * 合并url地址
 *
 * @param $url1 路径1
 * @param $url2 路径2
 */
function merge_url($url1, $url2)
{
    while (ends_with($url1, '/') && strlen($url1) > 0) {
        $url1 = substr($url1, 0, -1);
    }
    while (starts_with($url2, '/') && strlen($url2) > 0) {
        $url2 = substr($url2, 1);
    }
    $paths = [];
    if (!empty($url1)) {
        $paths[] = $url1;
    }
    if (!empty($url2)) {
        $paths[] = $url2;
    }

    return implode('/', $paths);
}

/**
 * 判断字符串是否以某一子字符串开头
 *
 * @param $haystack 字符串
 * @param $needle   子字符串
 */
if (!function_exists('starts_with')) {
    function starts_with($haystack, $needle)
    {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
    }
}
/**
 * 判断字符串是否以某一子字符串结尾
 *
 * @param $haystack 字符串
 * @param $needle   子字符串
 */
if (!function_exists('ends_with')) {
    function ends_with($haystack, $needle)
    {
        // search forward starting from end minus needle length characters
        return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos(
                    $haystack,
                    $needle,
                    $temp
                ) !== false);
    }
}
/**
 * json_last_error_msg (PHP 5 >= 5.5.0, PHP 7)
 */
if (!function_exists('json_last_error_msg')) {
    function json_last_error_msg()
    {
        if (!defined('JSON_ERROR_RECURSION')) {
            define('JSON_ERROR_RECURSION', 6);
        }
        if (!defined('JSONSON_ERROR_INF_OR_NAN')) {
            define('JSONSON_ERROR_INF_OR_NAN', 7);
        }
        if (!defined('JSONSON_ERROR_UNSUPPORTED_TYPE')) {
            define('JSONSON_ERROR_UNSUPPORTED_TYPE', 8);
        }
        $ERRORS = [
            JSON_ERROR_NONE                => 'No error',
            JSON_ERROR_DEPTH               => 'Maximum stack depth exceeded',
            JSON_ERROR_STATE_MISMATCH      => 'State mismatch (invalid or malformed JSON)',
            JSON_ERROR_CTRL_CHAR           => 'Control character error, possibly incorrectly encoded',
            JSON_ERROR_SYNTAX              => 'Syntax error',
            JSON_ERROR_UTF8                => 'Malformed UTF-8 characters, possibly incorrectly encoded',
            JSON_ERROR_RECURSION           => 'One or more recursive references in the value to be encoded PHP 5.5.0',
            JSONSON_ERROR_INF_OR_NAN       => 'One or more NAN or INF values in the value to be encoded    PHP 5.5.0',
            JSONSON_ERROR_UNSUPPORTED_TYPE => 'A value of a type that cannot be encoded was given',
        ];
        $error = json_last_error();

        return isset($ERRORS[$error]) ? $ERRORS[$error] : 'Unknown error';
    }
}
/**
 * 判断字符串是否是json格式
 *
 * @param $str 要判断的字符串
 */
function text_is_json($str)
{
    json_decode($str);
    $error = json_last_error();
    $msg = json_last_error_msg();

    return [
        'ok'    => ($error == JSON_ERROR_NONE),
        'error' => $msg,
    ];
}

function base_path($request)
{
    return rtrim(str_ireplace('index.php', '', $request->getUri()->getBasePath()), '/');
}

/**
 * 判断文本是否是email
 * $str
 */
function text_is_email($str) {
    return preg_match('/^[\w\-\.]{1,255}@[\w\-]{1,255}(\.[a-zA0Z]{2,10}){1,10}$/i', $str);
}

/**
 * 判断是否是手机号码
 */
function text_is_phone($str) {
    return preg_match('/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/i', $str);
}

/**
 * 判断字符串长度是否在指定范围内
 * @param $str 字符串
 * @param $min_len 最小长度
 * @param $max_len 最大长度
 * @param $trim 是否去掉字符串两端的空白字符 [false]
 * @return bool
 */
function text_in_range($str, $min_len=null, $max_len=null, $trim=false) {
    if(!isset($str)) {
        return false;
    }
    if($trim) {
        $str = trim($str);
    }
    $c = mb_strlen($str,'UTF-8');
    if(is_int($min_len)) {
        if($c < $min_len) {
            return false;
        }
    }
    if(is_int($max_len)) {
        if($c > $max_len) {
            return false;
        }
    }
    return true;
}

/**
 * 判断字符串是否不为空
 * @param $str 字符串
 * @param $trim 是否去掉字符串两端的空白字符 [false]
 * @return bool
 */
function text_required($str, $trim=false) {
    if(!isset($str)) {
        return false;
    }
    if($trim) {
        $str = trim($str);
    }
    return !empty($str);
}

/**
 * 获取唯一hash
 */
function unique_hash() {
    $rand = sprintf('?t=%.5f', microtime(true));
    $rand = uniqid($rand, true);
    $strs = [];
    for($i = 32; $i <= 126; $i++) { 
        $strs[] = chr($i);
    }
    $rand = str_shuffle(implode('-', $strs)) . $rand;
    return md5($rand);
}

/**
 * 获取(Laravel)Eloquent的sql语句
 */
function get_sql($builder, $array=false) {
    $query = str_replace(array('%', '?'), array('%%', '%s'), $builder->toSql());
    $bindings = $builder->getBindings();
    if($array) {
        return [
            'query' => $query,
            'bindings' => $bindings
        ];
    }
    return vsprintf($query, $bindings);
}

/**
 *　获取安全的文件名
 * @see: http://stackoverflow.com/questions/2021624/string-sanitizer-for-filename#answer-42058764
 */
function safe_filename($filename) {
    // sanitize filename
    $filename = preg_replace('|[\\\/\:\*\?\"\<\>\|]|','', $filename);
    $filename = preg_replace('|\.+|','.', $filename);
    // avoids ".", ".." or ".hiddenFiles"
    $filename = ltrim($filename, '.-');
    return $filename;
}

/**
 * 获取var_dump的结果
 */
function get_var_dump($var) {
    ob_start();
    var_dump($var);
    $dump_info = ob_get_contents();
    ob_end_clean();
    return $dump_info;
}

if(!function_exists('dump')){
    /**
     * 打印参数.
     */
    function dump(){
        echo '<pre>';
        $data = func_get_args();
        foreach($data as $value){
            var_dump($value);
        }
    }
}

if(!function_exists('get_type_child')){
    function get_type_child($types,$pid = 0){
        $data = [];
        foreach($types as $value){
            if($value['pid'] == $pid){
                array_push($data,$value);
            }
        }
        return $data;
    }
}
//if(!function_exists('get_child')){
//    function get_child($node,$nodes){
//        $data = get_type_child($nodes,$node['id']);
//        if(count($data) > 0){
//            foreach($data as $key=>$value){
//                $data['child'] = [];
//                array_push($data['child'],get_child($value,$nodes));
//            }
//        }
//        return $data;
//    }
//}

