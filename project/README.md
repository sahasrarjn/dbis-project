Steps to setup:
1. To set up the database, first run the command  `psql -h server_hostname -f DDL.sql database_name;` (server_hostname will typically be 0.0.0.0 if running on local machine, otherwise enter appropriate value)
2. Go to data directory and run `bash gen.sh`
3. Run `python3 insert.py > InsertData.sql`
4. Run the following to insert data into database `psql -h server_hostname -f InsertData.sql database_name;`