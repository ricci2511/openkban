# openkban
This project is still early in development. It will take some time until I release the first stable version. I'm learning most of the tech used in this project as I keep building the app.

## Instructions
1. Clone the repo and cd into it:

    ```
    git clone https://github.com/ricci2511/openkban.git
    cd openkban
    ```
2. Create a `.env` file with the contents of `.env.example`. The example file includes instructions that should be followed before proceeding (getting keys for OAuth providers).
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
