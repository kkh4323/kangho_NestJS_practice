import { Provider } from '../entities/provider.enum';

export class CreateUserDto {
  username: string;
  email: string;
  password?: string;
  phone?: string;
  provider?: Provider;
  profileImg?: string;
}
