-- Add CHECK constraints to prevent negative balances
ALTER TABLE brands ADD CONSTRAINT brands_balance_non_negative CHECK (balance >= 0);
ALTER TABLE brands ADD CONSTRAINT brands_frozen_balance_non_negative CHECK (frozen_balance >= 0);
ALTER TABLE influencers ADD CONSTRAINT influencers_balance_non_negative CHECK (balance >= 0);

-- Add CHECK constraints on monetary fields
ALTER TABLE campaigns ADD CONSTRAINT campaigns_budget_min_positive CHECK (budget_min > 0);
ALTER TABLE campaigns ADD CONSTRAINT campaigns_budget_range CHECK (budget_max >= budget_min);
ALTER TABLE collaborations ADD CONSTRAINT collaborations_proposed_price_positive CHECK (proposed_price > 0);
ALTER TABLE transactions ADD CONSTRAINT transactions_amount_positive CHECK (amount > 0);
ALTER TABLE transactions ADD CONSTRAINT transactions_fee_non_negative CHECK (fee >= 0);
