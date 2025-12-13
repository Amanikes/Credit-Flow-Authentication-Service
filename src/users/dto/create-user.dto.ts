
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsEmail()
    email: string;
    

    @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
    @IsString()
    @MinLength(6)
    password: string;

    // @ApiProperty({ example: 'user', description: 'The role of the user', enum: ['user', 'admin', 'business'] })
    // @IsString()
    // role: 'user' | 'admin' | 'business';
    
}
