import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from 'src/users/JwtService';
import { Secret } from 'src/users/secret'; 

@Injectable()
export class JwtMiddleware extends AuthGuard('jwt') {
  private jwtService: JwtService;

  constructor() {
    super();
    this.jwtService = new JwtService(Secret.JWT_ACCESS_SECRET); 
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token JWT manquant ou mal formaté');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = this.jwtService.verify(token) as { role: string };

      if (decodedToken && (decodedToken.role === 'admin' || decodedToken.role === 'user')) {
        // L'utilisateur a un rôle admin ou user, autorise l'accès
        return true;
      } else {
        throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
      }
    } catch (error) {
      throw new UnauthorizedException(`Erreur lors de la validation du token JWT : ${error.toString()}`);
    }
  }
}
