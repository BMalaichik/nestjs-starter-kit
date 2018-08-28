# PostgreSQL Docker Image
Docker image for Application database

This image runs PostgreSQL and creates app database and number of users:
- `postgres` - DB root
- `app`

To run it locally just use `docker-compose`:

```bash
$ docker-compose up
```

That's all, you can connect to the running DB using `psql`, [DataGrip](https://www.jetbrains.com/datagrip/) or any other tools.

##### Checking installation with `psql`
To use `psql` client, you need Postgres installed locally. Check out [this guide](https://www.codefellows.org/blog/three-battle-tested-ways-to-install-postgresql) for platform-dependent recommendations, but it should be as simple as an `apt-get install postgresql` on Linux, `brew install postgres` on OSX, or a binary download on Windows (make sure it is Postgres = 9.5).

Once properly installed, connecting to the DB server should be as simple as `psql -h localhost -U app`. Verify that things are OK with something like `SELECT version();` command. `\q` to quit.
