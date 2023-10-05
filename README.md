# Dynamik

## Developing

Clone the repository, install dependencies and update git submodule:
```bash
pnpm install
git submodule init
git submodule update
```

Create a `.env` file coping `.env.example` or paste:

```bash
# .env
	VITE_UPLD_URL=''
```

start a development server:

```bash
pnpm dev
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

## Deployments

- Main: https://risorse.students.cs.unibo.it
- GitHub Pages (slower, no SSR): https://csunibo.github.io/dynamik/
- Vercel: https://dynamik.vercel.app/ (unadvertised)
