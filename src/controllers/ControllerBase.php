<?php
namespace App\Controllers;

use Illuminate\Database\Eloquent\Builder;

/**
 * ControllerBase
 * @property Builder $db
 */
class ControllerBase
{
    protected $container;

    public function __construct(\Interop\Container\ContainerInterface $ci)
    {
        $this->container = $ci;
        $this->container->get('db');
    }

    /**
     * 获取正确的值.
     * @param $key
     * @param $param
     * @param array $args
     * @return mixed|null
     */
    public function filter_param($key,$param,$args = []){
        if(array_key_exists($key,$param)){
            return $param[$key];
        }
        if($args){
            if(array_key_exists($key,$args)){
                return array_get($args,$key,null);
            }
        }
        return null;
    }

}