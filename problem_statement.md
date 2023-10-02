## Web Application Development
### RESTful API Requirements
- All API request/response payloads should be in JSON.
- No UI should be implemented for the application.
- As a user, I expect all API calls to return with a proper HTTP status code.
- As a user, I expect the code quality of the application to be maintained to the highest standards using the unit and/or integration tests.

### Bootstrapping Database
- The application is expected to automatically bootstrap the database at startup. Bootstrapping creates the schema, tables, indexes, sequences, etc., or updates them if their definition has changed.
- The database cannot be set up manually by running SQL scripts.
- It is highly recommended that you use ORM frameworks such as Hibernate (for java), SQLAlchemy (for python), and Sequelize (for Node.js).

### Users & User Accounts
- The web application will load account information from a CSV file from well known location `/opt/user.csv`.
- The application should load the file at startup and create users based on the information provided in the CSV file.
- The application should create new user account if one does not exist.
- If the account already exists, no action is required i.e. no updates.
- Deletion is not supported.
- Example CSV file can be downloaded from [here](https://fall2023.csye6225.cloud/assignments/a3/users.csv).
- The user's password must be hashed using BCrypt before it is stored in the database. Users should not be able to set values for account_created and account_updated. Any value provided for these fields must be ignored.

### Authentication Requirements
- The user must provide a basic authentication token when making an API call to the authenticated endpoint.
- The web application must only support Token-Based authentication and not Session Authentication.

### API Implementation

#### Note

In this assignment we are going to implement REST API to allow users to create assignments. The API specifications can be found here.

The authenticated user should be able to do the following:

- Create Assignment
- Any user can add a assignment.
- Assignment points must be between 1 and 10.
- Update Assignment
- Only the user who created the assignment can update the assignment.
- Users can use either the PUT API for updates.
- Delete Assignment
- Only the user who created the assignment can delete the assignment.
- Users should not be able to set values for assignment_created and assignment_updated. Any value provided for these fields must be ignored.

### Git & GitHub

#### GitHub Subscription
- All students will need to subscribe to the GitHub Team plan.

#### Create & Setup GitHub Repository
- Create a new private GitHub repository for web applications in the GitHub organization you created.
- The GitHub repository name must be webapp.
- Update README.md in your repository. Your readme file must contain the following:
- Prerequisites for building and deploying your application locally.
- Build and Deploy instructions for the web application.
- Fork the GitHub repository in your namespace. You will do all development work on your fork.
- All web application code should now be in this repository.
- Add appropriate .gitignore to your repository. A collection of useful .gitignore templates can be found here.

#### GitHub Repository Branch Protection Rules
- Learn more about protected branches.
- Implement Branch Protection Rules shown in the image below:

#### Implement Continuous Integration (CI) with GitHub Actions

- Add a GitHub Actions workflow to run the application integration tests for each pull request raised. A pull request can only be merged if the workflow executes successfully.
- Add Status Checks GitHub branch protection to prevent users from merging a pull request when the GitHub Actions workflow run fails.
- The CI check should run the integration tests you will implement as part of this assignment.

#### Implement Integration Tests

Implement integration (and not unit) tests for the /healtz endpoint. You only need to test for success criteria and not for the failure. This will require your GitHub action to install and setup an actual MySQL and PostgreSQL instance and provide configuration to the application to connect to it.

### Submission

- Create a folder with the naming convention firstname_lastname_neuid_## where ## is the assignment number.
- Copy complete code for the assignment into this folder.
- Create a create a zip of the firstname_lastname_neuid_## directory. The zip file should be firstname_lastname_neuid_##.zip.
- Now unzip the zip file in some other directory and confirm the content of the zip files.
- Upload the Zip to the correct assignment in Canvas.
- You are allowed to resubmit. If you think there may be an issue with the ZIP file, feel free to submit it again. Only the latest submission will be graded.

### Grading Guidelines

- Web Application Crash (20% Penalty)¶
- Application should not throw 500 Internal Server errors.
- Application should not require restart between API calls.
  
### Web Application (100%)
- Students will demo the assignment from Debian 12 VM running in Digital Ocean.