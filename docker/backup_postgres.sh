#!/bin/bash

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/data/laguna/postgres/backups" # Ensure this directory exists
DB_NAME="laguna"
DB_USER="lagunaUser"
DB_PASSWORD="lagunaPassword"

mkdir -p "$BACKUP_DIR"

export PGPASSWORD="$DB_PASSWORD"

pg_dump -h laguna-pools-postgres-1 -U "$DB_USER" -F c "$DB_NAME" > "$BACKUP_DIR/$DB_NAME$TIMESTAMP.backup"

find "$BACKUP_DIR" -type f -name "*.backup" -mtime +7 -exec rm {} \;

unset PGPASSWORD
