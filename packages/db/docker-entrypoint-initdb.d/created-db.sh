#!/bin/bash
echo "Checking if APP_PASS var is set"

if [ -z ${APP_PASS} ]; then
    echo "Environmetn variable APP_PASS must be set";
    exit 1;
fi

echo "Searching existing user";
userExists=`psql --username postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='app'"`
if [ -z ${userExists} ]; then
    echo "creating DB and user app..."
    createuser app
    createdb --owner=app app
    echo "User and DB creation completed successfully"
fi


echo "Installing pgcrypt extension"
psql --username postgres -d app -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

echo "=> Modifying 'app' user with a preset password in PostgreSQL: '$APP_PASS'"
psql --username postgres -d app -c "alter user app with password '$APP_PASS';"
