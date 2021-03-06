import { Controller, Get, Post, Request, Response, Param, Next, HttpStatus, Body, HttpException, UseFilters } from '@nestjs/common';
import { CreateUserDTO } from './DTO/create-users.dto';
import { UsersService } from '../Users/Services/users.service';
import { ProductsService } from '../Products/Services/products.service'; 
import { CustomForbiddenException } from '../Shared/ExceptionFilters/forbidden.exception';
import { HttpExceptionFilter } from '../Shared/ExceptionFilters/http-exception.filter';
import { ValidationPipe } from '../Shared/Pipes/validation.pipe';
import { ParseIntPipe } from '../Shared/Pipes/parse-int.pipe';
@Controller()
// @UseFilters(new HttpExceptionFilter())
export class UsersController {
  // 依赖注入service，低耦合的做法
  constructor(private userService: UsersService, private productsService: ProductsService) {}

  @Get('users')
  // 使用express的参数
  async getAllUsers(@Request() req, @Response() res, @Next() next) {
    await this.userService.getAllUsers()
      .then((users) => {
        // 多钟Http的Status可以使用
        res.status(HttpStatus.OK).json(users);
      })
      .catch((error) => {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }

  @Get('users/:id')
  // 使用express的参数
  // @Param('id')可以直接抓取id参数
  getUser(@Response() res, @Param('id', new ParseIntPipe()) id) {
    // +id 是把string转成number
    this.userService.getUser(id)
      .then((user) => {
        res.status(HttpStatus.OK).json(user);
      })
      .catch((error) => {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }

  @Post('users')
  async addUser(@Response() res, @Body(new ValidationPipe()) createUserDTO: CreateUserDTO) {
    // 使用rx.js,回传可以做更多的资料处理
    await this.userService.addUser(createUserDTO).subscribe((users) => {
      res.status(HttpStatus.OK).json(users);
    })
  }

  @Get('testProducts')
  async testGetAllProducts(@Request() req, @Response() res, @Next() next) {
    await this.productsService.getAllProducts()
      .then((products) => {
        res.status(HttpStatus.OK).json(products)
      })
      .catch((error) => {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }

  @Get('getException')
  @UseFilters(new HttpExceptionFilter())
  async getException(@Request() req, @Response() res, @Next() next) {
    throw new CustomForbiddenException(); 
  }
}
