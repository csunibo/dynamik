<script lang="ts">
	import { get } from 'svelte/store';
	import UPLD from '$lib/upld.js';
	// console.log(data);
	// )
	const backendBase = 'http://130.136.3.76:8000';

	// redirect to my link pls
	const upldStore = get(UPLD);

	// const UPLD: string | null  = localStorage.getItem('upload');
	console.log(upldStore.repo + '---');

	const formData = new FormData();
	formData.append('repository', upldStore.repo);
	formData.append('path', upldStore.dir);

	upldStore.file.forEach((file, i) => {
		// Decode base 64 to file
		const newFile = new File([file], upldStore.file_name[i]);
		formData.append('files', newFile);
	});

	function uploadFiles() {
		const uploadResponse = fetch(`${backendBase}/api/uploadfiles`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(upldStore)
		});
		console.log(uploadResponse);
	}
	uploadFiles();

	// console.log(await uploadResponse.text());
	/**
    let params = new URLSearchParams();

    params.append('repository', upldStore.repo);
    params.append('branch_name', upldStore.branch);
    params.append('title', upldStore.title);

    const createPRResponse = await fetch(`${backendBase}/api/create-pr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `access_token=${accessToken.jwt_token}`,
        },
        body: params.toString(),
        credentials: 'include' 
    });

    console.log(await createPRResponse.text());
 */
</script>

<div>CIAO</div>
