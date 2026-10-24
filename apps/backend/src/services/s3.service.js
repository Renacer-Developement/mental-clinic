const crypto = require('crypto');

// Minimal S3 upload (PutObject with AWS Signature V4) — enough for article covers, without
// pulling in the AWS SDK. Configured by COVERS_S3_BUCKET, COVERS_S3_REGION,
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and, for a CDN or custom domain in front of
// the bucket, COVERS_PUBLIC_URL.

const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();

const s3Config = () => {
    const bucket = process.env.COVERS_S3_BUCKET;
    const region = process.env.COVERS_S3_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!bucket || !region || !accessKeyId || !secretAccessKey) return null;
    const host = `${bucket}.s3.${region}.amazonaws.com`;
    return {
        bucket, region, accessKeyId, secretAccessKey, host,
        publicUrl: (process.env.COVERS_PUBLIC_URL || `https://${host}`).replace(/\/$/, ''),
    };
};

/** Uploads `body` to `key` (e.g. "covers/slug.webp"); returns its public URL. */
async function putObject(key, body, contentType, cacheControl = 'public, max-age=31536000, immutable') {
    const cfg = s3Config();
    if (!cfg) throw new Error('S3 is not configured (COVERS_S3_BUCKET, COVERS_S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)');
    if (!/^[a-z0-9/._-]+$/.test(key)) throw new Error(`unsafe S3 key: ${key}`);

    const now = new Date();
    const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); // 20261024T120000Z
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = sha256(body);
    const headers = {
        'cache-control': cacheControl,
        'content-type': contentType,
        host: cfg.host,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
    };
    const signedHeaders = Object.keys(headers).sort().join(';');
    const canonicalRequest = [
        'PUT', `/${key}`, '',
        Object.keys(headers).sort().map(h => `${h}:${headers[h]}\n`).join(''),
        signedHeaders, payloadHash,
    ].join('\n');
    const scope = `${dateStamp}/${cfg.region}/s3/aws4_request`;
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
    const signingKey = hmac(hmac(hmac(hmac(`AWS4${cfg.secretAccessKey}`, dateStamp), cfg.region), 's3'), 'aws4_request');
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const res = await fetch(`https://${cfg.host}/${key}`, {
        method: 'PUT',
        headers: {
            ...headers,
            Authorization: `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
        },
        body,
    });
    if (!res.ok) throw new Error(`S3 PUT ${key}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    return `${cfg.publicUrl}/${key}`;
}

module.exports = { s3Config, putObject };
