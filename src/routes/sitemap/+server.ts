import { error } from '@sveltejs/kit';

type Blog = {
	id: 141;
	documentId: string;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
};
// src/routes/sitemap-posts.xml/+server.js
export const GET = async () => {
	const response = await fetch('http://localhost:5656/api/blog-articles');

	if (!response.ok) {
		throw error(500, 'Failed to fetch blog posts');
	}

	const data = await response.json();
	const blogs = data.data as Blog[];

	const xmlSitemap = generateSitemap(blogs);

	return new Response(xmlSitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

function generateSitemap(blogs: Blog[]) {
	const urls = blogs
		.map((blog) => {
			const lastmod = new Date(blog.updatedAt).toISOString().split('T')[0];
			return `
    <url>
        <loc>https://your-domain.com/blog/${blog.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="http://192.168.50.105:5174/sitemap/styles"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
</urlset>`;
}
