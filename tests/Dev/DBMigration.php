<?php
namespace App\Tests\Dev;

/**
 * DBMigration
 */
class DBMigration extends \App\Controllers\ControllerBase
{
    // 根据表名获取对象
    protected function get_object($table_name, $db)
    {
        $obj = null;
        switch ($table_name) {
            case 'folder':
                $obj = new \App\Migrations\Folder($table_name, $db->schema());
                break;
            case 'file_info':
                $obj = new \App\Migrations\FileInfo($table_name, $db->schema());
                break;
            case 'tag':
                $obj = new \App\Migrations\Tag($table_name, $db->schema());
                break;
            case 'file_tag_map':
                $obj = new \App\Migrations\FileTagMap($table_name, $db->schema());
                break;
            case 'upload_cache':
                $obj = new \App\Migrations\UploadCache($table_name, $db->schema());
                break;
            case 'user':
                $obj = new \App\Migrations\User($table_name, $db->schema());
                break;
            case 'open_asset':
                $obj = new \App\Migrations\OpenAsset($table_name, $db->schema());
                break;
            case 'operation':
                $obj = new \App\Migrations\Operation($table_name, $db->schema());
                break;
            case 'role':
                $obj = new \App\Migrations\Role($table_name, $db->schema());
                break;
            case 'operation_role_map':
                $obj = new \App\Migrations\OperationRoleMap($table_name, $db->schema());
                break;
            case 'user_role_map':
                $obj = new \App\Migrations\UserRoleMap($table_name, $db->schema());
                break;
            case 'app_object':
                $obj = new \App\Migrations\AppObject($table_name, $db->schema());
                break;
            case 'file_version':
                $obj = new \App\Migrations\FileVersion($table_name, $db->schema());
                break;
            case 'file_type':
                $obj = new \App\Migrations\FileType($table_name, $db->schema());
                break;
            case 'water_mark':
                $obj = new \App\Migrations\WaterMark($table_name, $db->schema());
                break;
            case 'user_scheme':
                $obj = new \App\Migrations\UserScheme($table_name, $db->schema());
                break;
            case 'recycle':
                $obj = new \App\Migrations\Recycle($table_name, $db->schema());
                break;
            case 'search':
                $obj = new \App\Migrations\SearchKey($table_name, $db->schema());
                break;
            # add <table name> with extra `case` here
            default:
                if (empty($table_name)) {
                    $obj = 'parameter [table] not provided';
                } else {
                    $obj = sprintf('table [%s] not supportted', $table_name);
                }
                break;
        }

        return $obj;
    }

    // 创建表
    public function up(\Slim\Http\Request $request, \Slim\Http\Response $response, $args = [])
    {
        $table_name = array_get($args, 'table', null);
        if(empty($table_name)) {
            $params = $request->getParams();
            $table_name = array_get($params, 'table');
        }
        $db = $this->ci->get('db');
        $obj = $this->get_object($table_name, $db);
        if ($obj instanceof \App\Migrations\Base) {
            if (!$obj->exists()) {
                $obj->up();
                $response->getBody()->write(sprintf('create table [%s] ok', $table_name));
            } else {
                $response->getBody()->write(sprintf('table [%s] existed', $table_name));
            }
        } else {
            $response->getBody()->write($obj);
        }

        return $response;
    }

    // 销毁表
    public function down(\Slim\Http\Request $request, \Slim\Http\Response $response, $args = [])
    {
        $table_name = array_get($args, 'table', null);
        if(empty($table_name)) {
            $params = $request->getParams();
            $table_name = array_get($params, 'table');
        }
        $db = $this->ci->get('db');
        $obj = $this->get_object($table_name, $db);
        if ($obj instanceof \App\Migrations\Base) {
            if ($obj->exists()) {
                $obj->down();
                $response->getBody()->write(sprintf('drop table [%s] ok', $table_name));
            } else {
                $response->getBody()->write(sprintf('table [%s] not exists', $table_name));
            }
        } else {
            $response->getBody()->write($obj);
        }

        return $response;
    }
}