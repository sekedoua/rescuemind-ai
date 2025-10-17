import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Sha256 } from '@aws-crypto/sha256-js';


const ddb = new DynamoDBClient({});
const region = process.env.AWS_REGION;
const endpoint = process.env.OPENSEARCH_ENDPOINT!; // https://...es.amazonaws.com
const index = process.env.OPENSEARCH_INDEX || 'incidents';


async function signedFetch(method: string, path: string, body?: string) {
const url = new URL(endpoint);
const req = new HttpRequest({ protocol: url.protocol, hostname: url.hostname, method, path, headers: { host: url.hostname, 'content-type': 'application/json' }, body });
const signer = new SignatureV4({ service: 'es', region, credentials: defaultProvider(), sha256: Sha256 });
const signed = await signer.sign(req);
const { response } = await new NodeHttpHandler().handle(signed);
const chunks: Buffer[] = []; for await (const c of response.body as any) chunks.push(c);
const txt = Buffer.concat(chunks).toString('utf-8');
try { return JSON.parse(txt); } catch { return { ok: true, raw: txt }; }
}


export const handler = async () => {
const scan = await ddb.send(new ScanCommand({ TableName: process.env.TABLE_INCIDENTS }));
const items = scan.Items || [];
const body = items.flatMap((doc:any) => [ JSON.stringify({ index: { _index: index } }), JSON.stringify(doc) ]).join('
') + '
';
await signedFetch('POST', '/_bulk', body);
return { indexed: items.length };
};