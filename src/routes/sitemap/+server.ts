import { error } from '@sveltejs/kit';

const strapiBaseUrl = 'http://localhost:5656/api';

export const GET = async () => {
	const latestBlogArticle = await getLatestBlogArticle();
	const latestDocArticle = await getLatestDocArticle();
	const latestPage = await getLatestPage();

	const xmlSitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
	<?xml-stylesheet type="text/xsl" href="http://192.168.50.105:5174/sitemap/index-styles"?>
	<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${
		latestBlogArticle
			? `<sitemap>
      		<loc>/sitemap/blog-sitemap</loc>
      		<lastmod>${latestBlogArticle.updatedAt}</lastmod>
   		</sitemap>`
			: ''
	}
	${
		latestDocArticle
			? `<sitemap>
      		<loc>/sitemap/doc-sitemap</loc>
      		<lastmod>${latestDocArticle.updatedAt}</lastmod>
   		</sitemap>`
			: ''
	}
	${
		latestPage
			? `<sitemap>
      		<loc>/sitemap/page-sitemap</loc>
      		<lastmod>${latestPage.updatedAt}</lastmod>
   		</sitemap>`
			: ''
	}
	</sitemapindex>
	`;

	return new Response(xmlSitemapIndex, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

async function getLatestBlogArticle() {
	const blogRes = await fetch(
		`${strapiBaseUrl}/blog-articles?sort=publishedAt:desc&pagination[limit]=1`
	);

	if (!blogRes.ok) {
		error(500, 'Failed to fetch blog posts');
	}

	const blogData = await blogRes.json();
	const blogPosts = blogData.data as Article[];
	return blogPosts[0];
}

async function getLatestDocArticle() {
	const docRes = await fetch(
		`${strapiBaseUrl}/doc-articles?sort=publishedAt:desc&pagination[limit]=1`
	);

	if (!docRes.ok) {
		error(500, 'Failed to fetch doc posts');
	}

	const docData = await docRes.json();
	const docPosts = docData.data as Article[];
	return docPosts[0];
}

async function getLatestPage() {
	const pageRes = await fetch(`${strapiBaseUrl}/pages?sort=publishedAt:desc&pagination[limit]=1`);

	if (!pageRes.ok) {
		console.log(pageRes);
		error(500, 'Failed to fetch page data');
	}

	const pageData = await pageRes.json();
	const pages = pageData.data as Page[];
	return pages[0];
}
