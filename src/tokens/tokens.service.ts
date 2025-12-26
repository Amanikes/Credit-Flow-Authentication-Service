import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {}
  
  
    async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {

        const tokenHash = await bcrypt.hash(refreshToken, process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 12);

        const tokenEntry = this.refreshTokenRepository.create({
            subject_id: userId,
            token_hash: tokenHash,
        });
        await this.refreshTokenRepository.save(tokenEntry);
    }
}
