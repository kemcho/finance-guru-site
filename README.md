# finance-guru-site

1. Steps to local setup
    git clone https://github.com/kemcho/finance-guru-site.git
    git clone git@github.com:kemcho/finance-guru-site.git
2. cd Devconnector
3. npm install
4. npm install --save-dev nodemon
5. cd client npm install
6. create a new mongo-db in mlab
6. Add keys.js file in config folder to your mongoURI that you get from mlab (e.g. entry below, change the mongodb:... and ... from the two fields)
    module.exports = {mongoURI: "mongodb:...",mySecretKey: "..."};
7. issue this command "npm run dev" (from Devconnector folder) and your server and client will be running

:)


