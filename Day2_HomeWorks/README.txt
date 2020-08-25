/*
    All about Basic Auth. 
    Authorized Back End
    Create a Web Service that uses Basic Authentication
    Use custom authorization.
    Create in your database a "user" collection with username and password. Password must be encrypted in db.
    User's schema:
        - username
        - password
        - firstName
        - lastName
        - role ["user","admin"]
    Create a service test with the following endpoints:
    - Register (username, password): creates a new valid user
    - GET /users: returns list of users (admin only)
    - Single user's data can be visualized/edited/deleted by himself/herself only
*/