import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Player } from 'src/generated/prisma/client';
import { EmailAlreadyExistsError, InvalidCredentialsError } from './erros';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, email, password } = registerDto;

    const playerExists = await this.prismaService.player.findUnique({
      where: { email },
    });
    if (playerExists) {
      throw new EmailAlreadyExistsError(email);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPlayer = await this.prismaService.player.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return this.generateAuthResponse(newPlayer);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const player = await this.prismaService.player.findUnique({
      where: { email },
    });

    if (!player) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    return this.generateAuthResponse(player);
  }

  private async generateAuthResponse(player: Player): Promise<AuthResponseDto> {
    const payload = { sub: player.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      player: {
        id: player.id,
        name: player.name,
        email: player.email,
        score: player.score,
      },
    };
  }
}
