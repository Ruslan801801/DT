import { Injectable } from '@nestjs/common';
import { EcashToken } from './types';

/**
 * EcashService: skeleton по мотивам cashu-ts.
 * Здесь будут реализованы операции mint / split / combine / verify.
 */
@Injectable()
export class EcashService {
  async mint(amount: number): Promise<EcashToken> {
    // TODO: интеграция с реальным mint (или локальная эмиссия)
    throw new Error('EcashService.mint not implemented');
  }

  async split(token: EcashToken, target: number[]): Promise<EcashToken[]> {
    // TODO: split по мотивам cashu-ts (размен токена на несколько номиналов)
    return [];
  }

  async combine(tokens: EcashToken[]): Promise<EcashToken> {
    // TODO: combine — собрать несколько токенов в один
    throw new Error('EcashService.combine not implemented');
  }
}