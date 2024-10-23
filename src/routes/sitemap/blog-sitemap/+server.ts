import { error } from '@sveltejs/kit';

const strapiBaseUrl = 'http://localhost:5656/api';

export const GET = async () => {
	const blogArticles = await getBlogArticles();

	const xmlSitemap = generateSitemap(blogArticles);

	return new Response(xmlSitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

async function getBlogArticles() {
	const blogRes = await fetch(
		`${strapiBaseUrl}/blog-articles?sort=publishedAt:desc&pagination[limit]=10000`
	);

	if (!blogRes.ok) {
		error(500, 'Failed to fetch blog posts');
	}

	const blogData = await blogRes.json();
	const blogPosts = blogData.data as Article[];
	return blogPosts;
}

function generateSitemap(blogs: Article[]) {
	const urls = blogs
		.map((blog) => {
			const lastmod = new Date(blog.updatedAt).toISOString().split('T')[0];
			return `
    <url>
        <loc>https://operavps.com/blog/${blog.slug}</loc>
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
