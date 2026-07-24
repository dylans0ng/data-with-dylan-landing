create table if not exists public.account_email_deliveries (
  user_id uuid not null references auth.users (id) on delete cascade,
  template_version integer not null,
  recipient_email text not null,
  status text not null
    check (status in ('pending', 'failed', 'sent')),
  attempt_count integer not null default 0
    check (attempt_count >= 0),
  first_attempt_at timestamptz,
  last_attempt_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, template_version)
);

alter table public.account_email_deliveries enable row level security;

revoke all on table public.account_email_deliveries from public;
revoke all on table public.account_email_deliveries from anon, authenticated;
grant select, insert, update on table public.account_email_deliveries to service_role;

create or replace function public.set_account_email_delivery_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_account_email_delivery_updated_at
  on public.account_email_deliveries;

create trigger set_account_email_delivery_updated_at
before update on public.account_email_deliveries
for each row
execute function public.set_account_email_delivery_updated_at();
