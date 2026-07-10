#!/bin/bash

# Generate random DB name starting with simpl-dev- and 6 random alphanumeric characters
RANDOM_SUFFIX=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 6)
DB_NAME="simpl-dev-$RANDOM_SUFFIX"

# Generate random user and password
DB_USER="simpl-user-$RANDOM_SUFFIX"
DB_PASS=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 12)

echo "Setting up MongoDB..."
echo "Database: $DB_NAME"
echo "User: $DB_USER"

# Create user and database
mongosh --eval "db.getSiblingDB('$DB_NAME').createUser({user: '$DB_USER', pwd: '$DB_PASS', roles: [{role: 'readWrite', db: '$DB_NAME'}]})"

# Insert initial data to ensure DB is created and visible
mongosh --eval "db.getSiblingDB('$DB_NAME').test_data.insertOne({name: 'Initial Data', createdAt: new Date()})"

# Update or create .env file with the new connection strings
CONN_STR="mongodb://$DB_USER:$DB_PASS@localhost:27017/$DB_NAME?replicaSet=rs0"

echo "Updating .env file..."
if [ -f .env ]; then
    # Comment out lines that are going to be altered
    sed -i "s|^PRISMA_DB_URL=|# PRISMA_DB_URL=|" .env
    sed -i "s|^MONGODB_CONNECTION_STRING=|# MONGODB_CONNECTION_STRING=|" .env
    sed -i "s|^DB_NAME=|# DB_NAME=|" .env
fi

# Add new credentials
echo "PRISMA_DB_URL=\"$CONN_STR\"" >> .env
echo "MONGODB_CONNECTION_STRING=\"$CONN_STR\"" >> .env
echo "DB_NAME=\"$DB_NAME\"" >> .env

echo "Database setup completed successfully."
