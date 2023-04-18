import type { PageLoad } from './$types';
import type { File, Statik } from '$lib/api';
import { STATIK_URL } from '$lib/const';

type RecursiveStatik = Statik & {
	sub?: RecursiveStatik[];
};
async function getManifest(path: string): Promise<Statik> {
	const res = await fetch(STATIK_URL(path));
	if (!res.ok) {
		throw new Error(`Failed to load manifest at ${STATIK_URL(path)}`);
	}
	const manifest: Statik = await res.json();
	return manifest;
}

async function getRecursiveManifest(path: string): Promise<RecursiveStatik | undefined> {
	try {
		const manifest = await getManifest(path);

		let directoryManifests: RecursiveStatik[] = [];
		if (manifest.directories) {
			for (const dir of manifest.directories) {
				const newManifest = await getRecursiveManifest(path + '/' + dir.path);
				if (newManifest) directoryManifests.push(newManifest);
			}
		}

		return {
			...manifest,
			sub: directoryManifests
		};
	} catch (e) {
		return undefined;
	}
}

function recursivelyGetFiles(manifest: RecursiveStatik): File[] {
	const files = manifest.files?.map((file) => file) ?? [];
	const subFiles = manifest.sub?.map((sub) => recursivelyGetFiles(sub))?.flat() ?? [];
	return [...files, ...subFiles];
}

export const load = (async ({ fetch, params }) => {
	const path = params.dir ? params.dir + '/' + params.zfile : params.zfile;
	const manifest = await getManifest(path);

	// For each directory, recursively load the manifest
	const recursiveManifest = getRecursiveManifest(path);
	const allFiles = recursiveManifest.then((manifest) => manifest && recursivelyGetFiles(manifest));

	return {
		manifest,
		streaming: {
			allFiles
		}
	};
}) satisfies PageLoad;
