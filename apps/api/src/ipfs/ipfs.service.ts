/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

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

    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

    const response = await axios.get(gatewayUrl);

    return response.data;
  }
}
