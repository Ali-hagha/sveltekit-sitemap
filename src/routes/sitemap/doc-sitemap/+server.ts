import { error } from '@sveltejs/kit';

const strapiBaseUrl = 'http://localhost:5656/api';

export const GET = async () => {
	const docArticles = await getDocArticles();

	const xmlSitemap = generateSitemap(docArticles);

	return new Response(xmlSitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

async function getDocArticles() {
	const docRes = await fetch(
		`${strapiBaseUrl}/doc-articles?sort=publishedAt:desc&pagination[limit]=10000`
	);

	if (!docRes.ok) {
		error(500, 'Failed to fetch doc posts');
	}

	const docData = await docRes.json();
	const docPosts = docData.data as Article[];
	return docPosts;
}

function generateSitemap(docs: Article[]) {
	const urls = docs
		.map((doc) => {
			const lastmod = new Date(doc.updatedAt).toISOString().split('T')[0];
			return `
    <url>
        <loc>https://operavps.com/doc/${doc.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="http://192.168.50.105:5174/sitemap/sitemap-styles"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
</urlset>`;
}
