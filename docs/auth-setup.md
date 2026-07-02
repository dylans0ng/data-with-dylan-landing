# Auth and Resource Access Setup

This app uses Vercel for hosting and API routes, Supabase for auth/private PDF storage, and optional Kit tagging.

## Local Development

For frontend-only work:

```txt
npm run dev
```

For the full local flow, including `/api/resource-download` and `/api/sync-kit`:

```txt
npm run dev:vercel
```

The first `npm run dev:vercel` run may ask you to log in to Vercel and link the local folder to your Vercel project.

## Supabase

Create a Supabase project and add these values locally and in Vercel:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_RESOURCE_BUCKET=resources
```

Create a private storage bucket named `resources`.

Upload the full PDFs with these paths:

```txt
python-fundamentals/cheat-sheets/Python_Variables_Data_Types_Cheat_Sheet.pdf
python-fundamentals/cheat-sheets/Python_Conditional_Logic_Cheat_Sheet.pdf
python-fundamentals/cheat-sheets/Python_For_While_Loops_Cheat_Sheet.pdf
python-fundamentals/cheat-sheets/Python_Lists_Sets_Tuples_Cheat_Sheet.pdf
python-fundamentals/cheat-sheets/Python_Dictionaries_Cheat_Sheet.pdf
python-fundamentals/cheat-sheets/Python_File_IO_Cheat_Sheet.pdf
python-fundamentals/cheat-sheets/Python_Dictionaries_to_Pandas_DataFrames_Cheat_Sheet.pdf
python-fundamentals/guided-notes/Python_Variables_Guided_Notes.pdf
python-fundamentals/guided-notes/Python_Conditional_Logic_Guided_Notes.pdf
python-fundamentals/guided-notes/Python_For_While_Loops_Guided_Notes.pdf
python-fundamentals/guided-notes/Python_Lists_Sets_Tuples_Guided_Notes.pdf
python-fundamentals/guided-notes/Python_Dictionaries_Guided_Notes.pdf
python-fundamentals/guided-notes/Python_File_IO_Guided_Notes.pdf
python-fundamentals/guided-notes/Python_Pandas_DataFrames_Guided_Notes.pdf
```

In Supabase Auth, add your deployed Vercel URL and local dev URL to allowed redirect URLs. The callback path is:

```txt
/auth/callback
```

## Vercel

Add the environment variables above in your Vercel project settings. The `VITE_` values are used by the browser. The non-`VITE_` values are private and used only by Vercel API routes.

The backend routes are:

```txt
/api/resource-download
/api/sync-kit
```

## Kit

Add these values locally and in Vercel:

```txt
KIT_API_SECRET=
KIT_PYTHON_BASICS_TAG_ID=
KIT_API_BASE_URL=https://api.convertkit.com/v3
```

The app syncs signed-in users to the `Python-Basics` tag through `/api/sync-kit`. If the Kit values are missing, account access still works and the sync is skipped.
