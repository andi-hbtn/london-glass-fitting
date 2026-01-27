import { Controller, Post, Body, Res, Get, Req, Param, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response, Request } from 'express';
import { ServiceHandler } from "../errorHandler/service.error";
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @Post('register')
    public async register(@Body() bodyParam: RegisterDto, @Res({ passthrough: true }) response: Response): Promise<UserEntity> {
        try {
            const { user, token } = await this.authService.registerUser(bodyParam);
            response.cookie('jwt', token, { httpOnly: true });
            return user;
        } catch (error) {
            throw new ServiceHandler(error.response, error.status);
        }
    }

    //httpOnly cohen vetem nga fronti por nuk aksesohen nga fronti per arsye sigurie sepse nese e kan bejne cte duan me TOKEN
    //duhet qe te marrim cookie nga Fronti per ne backend dhe kjo behete me passthrough: true
    @Post('login')
    public async login(@Body() bodyParam: LoginDto, @Res({ passthrough: true }) response: Response) {
        try {
            const { user, token } = await this.authService.loginUser(bodyParam);
            response.cookie('jwt', token, { httpOnly: true });
            return user;
        } catch (error) {
            throw new ServiceHandler(error.response, error.status);
        }
    }

    @Post('logout')
    public logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');
        return { "message": "success", "status": 201 };
    }

    @Get('checkUser')
    public async checkAuthUser(@Req() request: Request): Promise<UserEntity[]> {
        try {
            const id = await this.authService.authUserId(request);
            return await this.authService.getUserById(id);
        } catch (error) {
            throw new ServiceHandler(error.response, error.status);
        }
    }

    @Post('forgot-password')
    public async forgotPassword(@Body() { email }: ForgotPasswordDto) {
        try {
            const user = await this.authService.getUserByEmail(email);
            const resetToken = await this.authService.createPasswordResetToken(user);
            await this.authService.sendPasswordResetEmail(user.email, resetToken);
            return {
                message: 'Password reset link sent to your email',
                status: HttpStatus.OK
            };
        } catch (error) {
            throw new ServiceHandler(error.message, error.status);
        }
    }

    @Post('reset-password/:token')
    public async resetPassword(
        @Param('token') token: string,
        @Body() { newPassword }: ResetPasswordDto
    ) {
        try {
            return await this.authService.handlePasswordReset(token, newPassword);
        } catch (error) {
            throw new ServiceHandler(error.message, error.status);
        }
    }
}