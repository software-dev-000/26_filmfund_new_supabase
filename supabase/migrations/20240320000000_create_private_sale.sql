DROP TABLE IF EXISTS private_sale;

create table private_sale (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  wallet_address text not null,
  token_amount integer not null,
  quote_amount integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  transaction_hash text
);

-- Add indexes
create index private_sale_user_id_idx on private_sale(user_id);
create index private_sale_wallet_address_idx on private_sale(wallet_address); 

-- Add RLS policies
alter table private_sale enable row level security;

-- Allow users to view their own purchases
create policy "Users can view their own purchases"
on private_sale for select
using (auth.uid() = user_id);

-- Allow users to insert their own purchases
create policy "Users can insert their own purchases"
on private_sale for insert
with check (auth.uid() = user_id);

-- Allow admins to view all purchases
create policy "Users can view all purchases"
on private_sale for select
using (auth.uid() = user_id);
