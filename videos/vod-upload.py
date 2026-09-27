#!/usr/bin/env python3
"""Upload de vídeos para o ApsaraVideo VOD (Media Asset Management).
Fluxo: CreateUploadVideo (CLI) → PUT assinado no OSS com STS → aguarda processamento → URL de playback.
uso: vod-upload.py <json-do-create> <arquivo.mp4> <video_id>
"""
import base64, hashlib, hmac, json, sys, time, urllib.request

create = json.load(open(sys.argv[1]))
path = sys.argv[2]
video_id = sys.argv[3]

addr = json.loads(base64.b64decode(create['UploadAddress']))
auth = json.loads(base64.b64decode(create['UploadAuth']))

# o Endpoint vem com esquema ("https://oss-..."), e o host do OSS é {bucket}.{endpoint-sem-esquema}
endpoint = addr['Endpoint'].replace('https://', '').replace('http://', '').rstrip('/')
bucket, obj = addr['Bucket'], addr['FileName']
ak, sk, token = auth['AccessKeyId'], auth['AccessKeySecret'], auth['SecurityToken']

host = f'{bucket}.{endpoint}'
url = f'https://{host}/{obj}'

date = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime())
ctype = 'video/mp4'
data = open(path, 'rb').read()
md5 = base64.b64encode(hashlib.md5(data).digest()).decode()

string_to_sign = f'PUT\n{md5}\n{ctype}\n{date}\nx-oss-security-token:{token}\n/{bucket}/{obj}'
sig = base64.b64encode(hmac.new(sk.encode(), string_to_sign.encode(), hashlib.sha1).digest()).decode()

req = urllib.request.Request(url, data=data, method='PUT')
req.add_header('Date', date)
req.add_header('Content-Type', ctype)
req.add_header('Content-MD5', md5)
req.add_header('x-oss-security-token', token)
req.add_header('Authorization', f'OSS {ak}:{sig}')

with urllib.request.urlopen(req, timeout=600) as r:
    print(f'upload {path} → {r.status}')
print(f'video_id={video_id}')
