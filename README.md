
# Police Record Check System zambia 
contributors
marcus chongwani
Roy kamwanza
jackson njovu
elija nyameni
damian




## How can I edit this code?

There are several ways of editing this application.



Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment with Netlify

This project is configured for easy deployment to Netlify. Follow these steps to deploy:

1. Create a Netlify account if you don't have one already
2. Create a new site from Git
3. Connect your repository
4. Set the build command to `npm run build`
5. Set the publish directory to `dist`
6. Set up environment variables:
   - VITE_SUPABASE_URL - Your Supabase project URL
   - VITE_SUPABASE_ANON_KEY - Your Supabase anon/public key

Netlify automatically handles redirects for SPA routing through the provided `netlify.toml` configuration.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase for authentication, database, and storage

## Custom Domain Setup

To set up a custom domain with Netlify:

1. Go to your Netlify site dashboard
2. Navigate to Domain Settings
3. Click "Add custom domain"
4. Follow the instructions to verify and configure your domain

## I want to use a custom domain - is that possible?

We don't support custom domains (yet) on Lovable. If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: 
