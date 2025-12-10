-- Performance indexes for vouchers and transactions

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vouchers_composite 
ON vouchers (state, expires_at, created_at) 
WHERE state IN ('issued', 'handed_over');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_composite
ON transactions (sender_id, created_at, status);