<?php

use PHPUnit\Framework\TestCase;
use App\Controllers\UserController;

class UserControllerTest extends TestCase
{
	public function testIndex()
	{
		$controller = new UserController();
		$this->assertEquals(20, $controller->index(4, 5));
	}

	public function testAdd()
	{
		$controller = new UserController();
		$this->assertEquals(9, $controller->add(4, 5));
	}
}