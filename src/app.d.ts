// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type Article = {
		id: number;
		documentId: string;
		title: string;
		slug: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};

	type Page = {
		id: number;
		documentId: string;
		title: string;
		subTitle: string;
		description: string;
		slug: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
	};
}

export {};
