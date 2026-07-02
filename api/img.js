// 이미지 프록시 — szwego CDN → 동일 오리진 (Web Share용 CORS 해제)
// v10 사진공유 모듈 전용. 허용 호스트: *.szwego.com
export default async function handler(req, res) {
  const u = req.query.u;
  if (!u) return res.status(400).send('missing u');
  let url;
  try { url = new URL(u); } catch (e) { return res.status(400).send('bad url'); }
  if (!/(^|\.)szwego\.com$/.test(url.hostname)) return res.status(403).send('forbidden host');
  try {
    const r = await fetch(url.toString(), { headers: { 'Referer': 'https://www.wecatalog.cn/', 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' } });
    if (!r.ok) return res.status(502).send('upstream ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(buf);
  } catch (e) {
    return res.status(502).send('fetch fail');
  }
}
