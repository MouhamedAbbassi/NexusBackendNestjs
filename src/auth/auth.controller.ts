import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @UseGuards(AuthGuard('google'))
  @Get('login/google')
  async googleLogin() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleCallback(@Req() req: any, @Res() res: any) {
    // const accessToken = await this.authService.getToken({
    //   sub: req.user.id.toString(),
    //   username: req.user.displayName,
    // });
    // // Redirect to home page with the access token as a query parameter
    // return res.redirect(
    //   `http://localhost:5173/dashboard/home?token=${accessToken}`,
    // );

    const user = req.user
   const resl = await this.authService.loginWithGoogle({...user,role:"user"})
  const url = `http://localhost:5173/dashboard/profile?google-token=${resl.token}`
  // );`;
  return res.redirect(url);
  }

  @UseGuards(AuthGuard('github'))
  @Get('login/github')
  async githubLogin() {}

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  async githubCallback(@Req() req: any, @Res() res: any) {
    // const accessToken = await this.authService.getToken({
    //   sub: req.user.id.toString(),
    //   username: req.user.username,
    // });

    // const url = `http://localhost:5173/dashboard/home?github-token=${accessToken}&username=${req.user.username}`;
    // console.log(url);
    // // Redirect to home page with the access token as a query parameter
    // return res.redirect(url);

    const user = req.user
   const resultat = await this.authService.loginWithGitHub({...user,role:"user"})
  const url = `http://localhost:5173/dashboard/profile?github-token=${resultat.token}&username=${req.user.name}`;
  return res.redirect(url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('token-verify')
  async tokenInfo() {
    return 'Ok';
  }
}
