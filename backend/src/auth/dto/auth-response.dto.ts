export class PlayerResponse {
  id!: string;
  name!: string;
  email!: string;
  score!: number;
}

export class AuthResponseDto {
  access_token!: string;
  player!: PlayerResponse;
}