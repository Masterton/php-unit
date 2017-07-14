<?php

namespace App\Middlewares;

use App\Models\User;
use EasyWeChat\Foundation\Application;

/**
 * 认证
 */
class Wechat extends Base {

    public function __invoke(\Slim\Http\Request $request, \Slim\Http\Response $response, callable  $next) {
        $config = $this->container->get('settings')['wechat'];
        $route = $request->getAttribute('route');
        if(empty($route)){
            $current_url = $request->getUri()->getPath();
        }else{
            $route_name = $route->getName();

            $router = $this->container->get('router');
            $current_url = $router->pathFor($route_name);
        }
        $app = new Application($config);
        $oauth = $app->oauth;
        $scopes = array_key_exists('scopes',$config['oauth']) ? $config['oauth']['scopes'] : ['snsapi_base'];

        if (is_string($scopes)) {
            $scopes = array_map('trim', explode(',', $scopes));
        }
        if (!array_key_exists('wechat_user',$_SESSION) || $_SESSION['wechat_user'] == null) {
            $params = $request->getParams();
            if (array_key_exists('code',$params) && array_key_exists('state',$params)) {
                $_SESSION['wechat_user'] = $oauth->user()->getOriginal();
                $_SESSION['openid'] = $_SESSION['wechat_user']['openid'];
            }else{
                // 得到用户所用的访问路由.所构建的参数.
                $current_url = $request->getUri()->getScheme() . '://' .$request->getUri()->getHost() . $current_url;
                $redirect_url = $oauth->scopes($scopes)->setRedirectUrl($current_url)->redirect()->getTargetUrl();
                $response->getBody()->rewind();
                return $response->withHeader('Location', $redirect_url)->withStatus(301);
            }
        }
        // 这里是跳转连接.
        if(!$this->check_permission() && strpos($current_url,'login') === false){
            $response->getBody()->rewind();
            return $response->withRedirect('/login')->withStatus(301);
        }
        $response = $next($request, $response);
        return $response;
    }


    public function check_permission(){
        $user = User::where(['wechat'=>$_SESSION['openid']])->first();
        if($user){
            $_SESSION['user_info'] = $user->toArray();
            return true;
        }else{
            return false;
        }
    }

}