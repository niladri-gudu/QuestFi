/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { timeout } from 'rxjs';

@Injectable()
export class IpfsService {
  private readonly pinataUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  async uploadJson(metadata: any): Promise<string> {
    const response = await axios.post(this.pinataUrl, metadata, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });
    return response.data.IpfsHash;
  }

  async fetchJson(metadataHash: string): Promise<any> {
    const cid = metadataHash.replace('ipfs://', '');

    const gateways = [
      'https://cloudflare-ipfs.com/ipfs/',
      'https://ipfs.io/ipfs/',
      'https://dweb.link/ipfs/',
      'https://gateway.pinata.cloud/ipfs/',
      'https://ipfs.fleek.co/ipfs/',
    ];

    for (const base of gateways) {
      try {
        const url = base + cid;

        const res = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        });

        return res.data;
      } catch (err) {
        console.warn(`IPFS gateway failed: ${base}`);
        continue;
      }
    }

    throw new Error('All IPFS gateways failed');
  }
}
