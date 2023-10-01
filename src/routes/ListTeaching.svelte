<script lang="ts">
    import type { PageData } from './$types';
	import type { Teaching } from '$lib/teachings';
    import { base } from '$app/paths';
    
    export let data: PageData
    export let activeYears: Teaching[]
    export let optionalCourseView: boolean
</script>

<ul class="menu p-2">
    {#each data.course.years.filter(year => year.teachings.some(teaching => (optionalCourseView && teaching.optional) || (!optionalCourseView && !teaching.optional))) as year}
        <li class="menu-title">
            <span class="text-2xl mt-5 italic">{year.year} anno {optionalCourseView ? 'facoltativi' : ''}</span>
        </li>
        <div class="divider mt-0"></div>
        <div class="flex flex-row flex-wrap">
            {#each year.teachings as teaching}
                {@const disabled = !activeYears.includes(teaching)}
                {@const href = base + '/' + teaching.url}
                {#if (!optionalCourseView && !teaching.optional) || (optionalCourseView && teaching.optional)}
                    <a href={disabled ? null : href} class="text-center text-lg">
                        {#if teaching.name}
                            <li class="flex flex-row xs:flex-1 justify-center border-base-content items-center m-2 border-2 rounded-md join">
                                <a href={disabled ? null : href} class="text-center text-lg join-item">
                                    {teaching.name ? teaching.name : teaching.url}
                                </a>
                                {#if teaching.telegram}
                                    <a href="https://t.me/{teaching.telegram}" class="text-center text-lg join-item border-l-2">👥</a>
                                {/if}
                            </li>
                        {/if}
                    </a>
                {/if}
            {/each}
        </div>
    {/each}
</ul>
