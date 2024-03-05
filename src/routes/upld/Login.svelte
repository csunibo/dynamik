<script lang="ts">
	export let show: boolean;

	function handleClick() {
		show = !show;
	}
</script>

<button
	class="fixed inset-0 cursor-default flex items-center justify-center z-50 backdrop-blur-sm {show
		? 'hidden'
		: ''}"
	on:click={handleClick}
>
	<div
		class="relative bg-accent rounded-xl shadow-xl bg-opacity-90 backdrop-blur backdrop-filter w-max p-8 m-auto"
	>
		<div class="space-y-4">
			<h2 class="mb-8 text-2xl text-content font-bold">
				Log in to upload <br />
				your files on GitHub
			</h2>
		</div>
		<div class="mt-10 grid space-y-4">
			<button
				class="group h-12 px-6 border-2 border-base-300 rounded-full transition duration-300 hover:border-accent-200 bg-neutral hover:bg-primary focus:bg-accent/50 active:bg-accent"
				><a
					href="https://github.com/login/oauth/authorize?client_id=Iv1.8b86c79d96cfb064&redirect_uri=http://localhost:5173/upld/end&scope=read:user,user:email"
				>
                <!-- TODO: dovremmo mettere client token id,redirect uri nelle variabili d'ambiente quando lo facciamo per bene. -->
					<div class="relative flex items-center space-x-4 justify-center">
						<span
							class="text-2xl group-hover:text-neutral transition duration-300 icon-[akar-icons--github-fill]"
						></span>
						<span
							class="block font-bold tracking-wide text-base-content text-sm transition duration-300 group-hover:text-neutral sm:text-base"
							>Continue with Github
						</span>
					</div>
				</a>
			</button>
		</div>
	</div>
</button>
