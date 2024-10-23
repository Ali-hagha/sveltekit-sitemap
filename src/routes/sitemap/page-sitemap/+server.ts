import { error } from '@sveltejs/kit';

const strapiBaseUrl = 'http://localhost:5656/api';

export const GET = async () => {
	const pages = await getPages();

	const xmlSitemap = generateSitemap(pages);

	return new Response(xmlSitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

async function getPages() {
	const pagesRes = await fetch(
		`${strapiBaseUrl}/pages?sort=publishedAt:desc&pagination[limit]=10000`
	);

	if (!pagesRes.ok) {
		error(500, 'Failed to fetch pages');
	}

	const pageData = await pagesRes.json();
	const pagePosts = pageData.data as Article[];
	return pagePosts;
}

function generateSitemap(pages: Article[]) {
	const urls = pages
		.map((page) => {
			const lastmod = new Date(page.updatedAt).toISOString().split('T')[0];
			return `
    <url>
        <loc>https://operavps.com${page.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
    </url>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="http://192.168.50.105:5174/sitemap/sitemap-styles"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
</urlset>`;
}
