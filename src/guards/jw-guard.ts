import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRedisGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;

    if (!auth) throw new UnauthorizedException('Missing authorization header');

    const token = auth.replace('Bearer', '');
    let decoded: any;
    try {
      decoded = this.jwt.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    //Verify that the token still exists in redis

    const storedToken = await this.cache.get(`auth:${decoded.sub}`);

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Token revoked or invalid');
    }

    request.user = decoded;

    return true;
  }
}
