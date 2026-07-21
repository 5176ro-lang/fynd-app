DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS swaps CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    zip_code VARCHAR(10),
    neighborhood VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    listing_type VARCHAR(10) NOT NULL DEFAULT 'item'
        CHECK (listing_type IN ('item', 'service')),
    listing_mode VARCHAR(10) NOT NULL DEFAULT 'swap'
        CHECK (listing_mode IN ('swap', 'free')),
    looking_for TEXT,
    photo_url VARCHAR(500),
    hashtags TEXT[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (status IN ('available', 'pending', 'swapped')),
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT max_three_hashtags CHECK (array_length(hashtags, 1) IS NULL OR array_length(hashtags, 1) <= 3)
);

CREATE TABLE swaps (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offered_listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
    offer_description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'proposed'
        CHECK (status IN ('proposed', 'accepted', 'declined', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT offer_present CHECK (offered_listing_id IS NOT NULL OR offer_description IS NOT NULL)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    swap_id INTEGER NOT NULL REFERENCES swaps(id) ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (swap_id, reviewer_id)
);

CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_swaps_listing_id ON swaps(listing_id);
CREATE INDEX idx_swaps_requester_id ON swaps(requester_id);
CREATE INDEX idx_swaps_offered_listing_id ON swaps(offered_listing_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_swap_id ON reviews(swap_id);