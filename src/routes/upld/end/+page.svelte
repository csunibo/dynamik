<script lang="ts">
	import { get } from 'svelte/store';
	import UPLD from '$lib/upld.js';
    import { onMount } from 'svelte';


    // TODO: move this to a type section
    interface oAuthResponse {
        access_token: string;
        username: string;
        email: string;
        jwt_token: string;
    }
	const backendBase = 'https://130.136.3.76:8000';
    const backendCallback = `${backendBase}/oauth/redirect?code=`;

    let urlParams;
    $: code = '';
    $: accessToken = {} as oAuthResponse;
    onMount(() => {
        urlParams = new URLSearchParams(window.location.search);
        const paramCode = urlParams.get('code');
        if (paramCode) {
            code = paramCode;
            uploadFiles(code);
        } else {
            // TODO: handle error
            console.log('no code');
        }
        console.log(code);
        
    });
    // https://www.30secondsofcode.org/js/s/parse-or-serialize-cookie/
    const parseCookie = (str: string) =>
    str
    .split(';')
    .map((v) => v.split('='))
    .reduce(
        (acc, v) => {
            if (v.length < 2) return acc;
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        },
        {} as Record<string, string>
    );

    async function uploadFiles(code: string) {
        const backendUrl = `${backendCallback}${code}`;

        // Just used to set the cookie to the client
        // TODO: set to local storage so it is seen as logged!?
        // For credentials see https://stackoverflow.com/questions/22432616/why-is-the-browser-not-setting-cookies-after-an-ajax-request-returns
        const response = await fetch(backendUrl, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        // const cookie = parseCookie(response.headers.get('Set-Cookie') || '');
        // console.log(cookie)
        // if (!cookie.access_token) {
        //     console.log('no access token');
        //     //TODO: handle error
        //     return;
        // }

        accessToken = data;
        // accessToken.jwt_token = cookie.access_token;

        console.log(response.headers);

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
        const uploadResponse = await fetch(`${backendBase}/api/uploadfiles`, {
        	method: 'POST',
        	body: formData,
            // headers: {
            // 	Cookie: `access_token=${accessToken.jwt_token}`
            // },
            credentials: 'include'
        });
        console.log(await uploadResponse.text());
    }


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

    <p> uploading </p>
    <p> uploaded </p>
    <!-- <p style="color: red"> {error.message} </p> -->