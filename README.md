# About this Project
# Frameworks - Libraries
Below are some major libs being used.  
expressjs  
mongodb  
mongoose  
axios  
jsonwebtoken  
bcrypt

# Mongoose
is being used to interact with mongodb server

# Authentication Flow
`/register`  
User registers with email, password  
accessToken, refreshToken will also be returned

`/login`  
user logins with email, password  
accessToken, refreshToken will also be returned


`AccessToken` & `RefreshToken` will be used to access  
the rest of the APIs.

# JWT Authentication
`/auth/login` -> returns accessToken to be used  
`/auth/register` -> registers and returns tokens  
`/auth/token` -> accepts refreshToken|email and returns a new accessToken  
`/auth/logout` -> deletes the refreshToken