# Auth Module

Provides **JWT**(JWS)-based authorization & authentication API.
Role-Permission based access.

Features:
 - **@Authroize** decorator - role-permission based access retristictions apply. Usage examples can be found in function description & UserController class
 - **Authentication Service** - Core logic
 - **Password Service** - Password Generation\Verifying API
 - **Current User Service** - API for retrieveing authenticated user info
 

 Uses internally **Permission Module** for managing permissions
