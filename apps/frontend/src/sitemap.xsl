<?xml version="1.0" encoding="UTF-8"?>
<!-- Human-readable view of /sitemap.xml in the browser. Crawlers read the XML and ignore this. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  exclude-result-prefixes="s image">

  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="uk">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Карта сайту — doctor-skripnik.com.ua</title>
        <style>
          :root {
            --primary: #8f6b59; --accent-soft: #f4eae2; --cream: #fcf5ee;
            --heading: #2d2e2e; --text: #4a4542; --muted: #6f6762; --line: #eadccf;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0; background: var(--cream); color: var(--text);
            font: 15px/1.5 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .wrap { max-width: 1040px; margin: 0 auto; padding: 40px 16px 64px; }
          h1 {
            margin: 0 0 6px; color: var(--heading); font-weight: 600;
            font: 600 32px/1.2 'Source Serif 4', Georgia, serif;
          }
          .lead { margin: 0 0 24px; color: var(--muted); }
          .stats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
          .chip {
            background: #fff; border: 1px solid var(--line); border-radius: 999px;
            padding: 4px 12px; font-size: 13px;
          }
          .chip b { color: var(--primary); }
          .card { background: #fff; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 14px; text-align: left; vertical-align: middle; }
          th {
            background: var(--accent-soft); color: var(--muted); font-size: 12px;
            font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
          }
          tr + tr td { border-top: 1px solid var(--line); }
          tbody tr:hover { background: var(--cream); }
          td.num { color: var(--muted); width: 1%; font-variant-numeric: tabular-nums; }
          td.url a { color: var(--heading); text-decoration: none; word-break: break-all; }
          td.url a:hover { color: var(--primary); text-decoration: underline; }
          .img { display: flex; align-items: center; gap: 10px; margin-top: 6px; color: var(--muted); font-size: 13px; }
          .img img { width: 64px; height: 36px; object-fit: cover; border-radius: 6px; flex: none; }
          td.meta { color: var(--muted); white-space: nowrap; font-size: 13px; font-variant-numeric: tabular-nums; }
          footer { margin-top: 20px; color: var(--muted); font-size: 13px; }
          footer a { color: var(--primary); }
          @media (max-width: 640px) {
            .hide-sm { display: none; }
            h1 { font-size: 26px; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Карта сайту</h1>
          <p class="lead">Усі сторінки, які ми подаємо пошуковим системам. Оновлюється автоматично.</p>

          <div class="stats">
            <span class="chip">Сторінок: <b><xsl:value-of select="count(s:urlset/s:url)"/></b></span>
            <span class="chip">Статей: <b><xsl:value-of select="count(s:urlset/s:url[contains(s:loc, '/articles/') and not(contains(s:loc, '/articles/category/'))])"/></b></span>
            <span class="chip">Тестів: <b><xsl:value-of select="count(s:urlset/s:url[contains(s:loc, '/test/detail/')])"/></b></span>
            <span class="chip">Зображень: <b><xsl:value-of select="count(s:urlset/s:url/image:image)"/></b></span>
          </div>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Адреса</th>
                  <th class="hide-sm">Оновлено</th>
                  <th class="hide-sm">Пріоритет</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="num"><xsl:value-of select="position()"/></td>
                    <td class="url">
                      <a href="{s:loc}"><xsl:value-of select="substring-after(s:loc, '.com.ua')"/></a>
                      <xsl:for-each select="image:image">
                        <div class="img">
                          <img src="{image:loc}" alt="" loading="lazy"/>
                          <span><xsl:value-of select="image:title"/></span>
                        </div>
                      </xsl:for-each>
                    </td>
                    <td class="meta hide-sm">
                      <xsl:choose>
                        <xsl:when test="s:lastmod"><xsl:value-of select="s:lastmod"/></xsl:when>
                        <xsl:otherwise>—</xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="meta hide-sm"><xsl:value-of select="s:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Стандарт <a href="https://www.sitemaps.org/">sitemaps.org</a> ·
            <a href="/">На головну</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
