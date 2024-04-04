import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class WakatimeService {
  async getCurrentUser(token: string): Promise<any> {
    const response = await axios.get(
      'https://wakatime.com/api/v1/users/current',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
