create table profiles (
  id uuid primary key references auth.users on delete cascade,
  pro_until timestamptz,
  created_at timestamptz default now()
);
create table scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade,
  listening numeric, reading numeric, writing numeric, speaking numeric,
  overall numeric, test_type text,
  created_at timestamptz default now()
);
create table checks (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade,
  kind text check (kind in ('writing','speaking')),
  input_text text, result jsonb,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
alter table scores enable row level security;
alter table checks enable row level security;
create policy "own profile" on profiles for select using (auth.uid() = id);
create policy "own scores" on scores for all using (auth.uid() = user_id);
create policy "own checks" on checks for all using (auth.uid() = user_id);

create function public.handle_new_user() returns trigger as $$
begin insert into public.profiles (id) values (new.id); return new; end;
$$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
