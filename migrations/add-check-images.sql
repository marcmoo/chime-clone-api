-- Run on production MySQL before deploying new backend code
-- Database: chime_production

ALTER TABLE transactions ADD COLUMN frontImageUrl VARCHAR(255) NULL;
ALTER TABLE transactions ADD COLUMN backImageUrl VARCHAR(255) NULL;
