create table if not exists public.save_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  game_key text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, game_key)
);

alter table public.save_states enable row level security;

drop policy if exists "Players can read their own save states" on public.save_states;
create policy "Players can read their own save states"
on public.save_states
for select
using (auth.uid() = user_id);

drop policy if exists "Players can insert their own save states" on public.save_states;
create policy "Players can insert their own save states"
on public.save_states
for insert
with check (auth.uid() = user_id);

drop policy if exists "Players can update their own save states" on public.save_states;
create policy "Players can update their own save states"
on public.save_states
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.touch_save_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_save_state_updated_at on public.save_states;
create trigger touch_save_state_updated_at
before update on public.save_states
for each row
execute function public.touch_save_state_updated_at();
