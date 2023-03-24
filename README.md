# Openkban
Openkban (i know, not the most creative name) is a open source kanban web app built with nextjs, with "most" of the features you would expect.
This project is still early in development. My main motivation is to improve my developer skills, but aside from that I'm trying to build a modern, free and open source kanban web app for everyone.

## Getting started
1. Clone the repo and cd into it:

    ```
    git clone https://github.com/ricci2511/openkban.git
    cd openkban
    ```
2. Create a `.env` file with the contents of `.env.example`. The example file includes instructions that should be followed before proceeding (getting keys for OAuth providers).

    ```
    cp .env.example .env
    ```
3. Install dependencies:

    ```
    npm install
    ```
4. Run mysql and redis containers:

    ```javascript
    // pass the -d flag if you don't want to see docker logs
    docker-compose up
    ```
5. If you are running the containers for the first time you need to synchronize the mysql schema with the prisma schema:
    ```
    npx prisma db push
    ```
6. You are ready to run the app with:
    ```javascript
    // listening on localhost:3000
    npm run dev
    ```

## License
MIT
