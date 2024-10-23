// src/routes/sitemap.xsl/+server.js
export const GET = async () => {
	const xsltContent = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

    <xsl:template match="/">
        <html>
            <head>
                <title>Sitemap Index</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        padding: 10px;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    a {
                        text-decoration: none;
                        color: #1a73e8;
                    }
                </style>
            </head>
            <body>
                <h1>Sitemap Index</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Sitemap URL</th>
                            <th>Last Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="//sitemap:sitemap">
                            <tr>
                                <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                                <td><xsl:value-of select="sitemap:lastmod"/></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;

	return new Response(xsltContent, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
