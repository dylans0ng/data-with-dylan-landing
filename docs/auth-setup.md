# Auth and Resource Access Setup

This app uses Vercel for hosting and API routes, Supabase for auth/private PDF storage, and optional Kit tagging.

## Local Development

For frontend-only work:

```txt
npm run dev
```

For the full local flow, including `/api/resource-download`,
`/api/subscribe-kit`, and `/api/sync-kit`:

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
ai-with-python-for-beginners/cheat-sheets/Call_Your_First_AI_Model_Cheat_Sheet.pdf
ai-with-python-for-beginners/guided-notes/Call_Your_First_AI_Model_in_Python_Guided_Notes.pdf
sql-fundamentals/cheat-sheets/SQL_Joins_Cheat_Sheet.pdf
```

In Supabase Auth, add your deployed Vercel URL and local dev URL to allowed redirect URLs. The callback path is:

```txt
/auth/callback
```

## Vercel

Add the environment variables above in your Vercel project settings. The `VITE_` values are used by the browser. The non-`VITE_` values are private and used only by Vercel API routes.

The backend routes are:

```txt
/api/account-exists
/api/resource-download
/api/subscribe-kit
/api/sync-kit
```

`/api/account-exists` uses the Supabase service role key server-side to show a
clear signup error when someone tries to create an account with an email that
already exists.

## Kit

Add these values locally and in Vercel:

```txt
KIT_API_KEY=
KIT_FORM_ID=
KIT_PYTHON_BASICS_TAG_ID=
KIT_SQL_TAG_ID=
KIT_V4_API_BASE_URL=https://api.kit.com/v4
```

`KIT_API_KEY` should be a Kit V4 API key from the Developer settings in your
Kit account. The app syncs confirmed, signed-in users to the `Python-Basics` tag
through `/api/sync-kit`. The homepage newsletter form syncs subscribers through
`/api/subscribe-kit` and applies the Python and/or SQL tag based on the selected
topics. `KIT_FORM_ID` should match the Kit form you used for the previous
homepage signup, so form confirmation and incentive email behavior is preserved.

If the Kit values are missing, account access still works and the authenticated
signup sync is skipped. The homepage form requires either the V4 values above or
the temporary V3 fallback values below.

For older ConvertKit V3 setups, the Kit routes still support these fallback
values during migration:

```txt
KIT_API_SECRET=
KIT_API_BASE_URL=https://api.convertkit.com/v3
VITE_CONVERTKIT_API_KEY=
VITE_CONVERTKIT_FORM_ID=
VITE_CONVERTKIT_PYTHON_TAG_ID=
VITE_CONVERTKIT_SQL_TAG_ID=
```

After the V4 route is verified in production, remove the `VITE_CONVERTKIT_*`
fallback values from Vercel so the browser no longer receives Kit API config.
