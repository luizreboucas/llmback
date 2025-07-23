import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("getCsrfToken")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/save")
  async saveData(@Body() Data: any) {
    const apiEndpoint = process.env.API_ENDPOINT;
    if (!apiEndpoint) {
      throw new Error("API_ENDPOINT environment variable is not defined.");
    }

    // 1. GET para buscar o token e cookies de sessão
    const getResponse = await axios.get(apiEndpoint, {
      headers: {
        Authorization: `Basic ${process.env.CREDENCIAIS_SAP}`,
        "X-CSRF-Token": "fetch"
      }
    });

    const csrfToken = getResponse.headers['x-csrf-token'];
    const cookies = getResponse.headers['set-cookie'];

    // 2. POST usando o token e os cookies
    const response = await axios.post(apiEndpoint, Data, {
      headers: {
        Authorization: `Basic ${process.env.CREDENCIAIS_SAP}`,
        "X-CSRF-Token": csrfToken,
        Cookie: cookies ? cookies.join('; ') : ''
      }
    });
    return response.data;
  }
}
