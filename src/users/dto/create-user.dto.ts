
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    @Transform(({ value }) => value.trim())
    email: string;
    

    @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    password: string;

    // @ApiProperty({ example: 'user', description: 'The role of the user', enum: ['user', 'admin', 'business'] })
    // @IsString()
    // role: 'user' | 'admin' | 'business';
    
}
