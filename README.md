# 12-MySQL-Homework-Employee-Tracker

Employee Tracker is an application that allows the user to keep create, read, update, and delete data related to specific employees. When starting up the application the user has the option of viewing all employees, viewing employees by department, adding an employee, remove employees, add departments, and add roles. The program uses a MySQL database to store information for the user. When the user chooses an option the corresponding table appears in the terminal.

## Instructions
Database schema containing three tables:
* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
  
This is a command-line application that allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

- - -
## Submission:

* The URL of the GitHub repository: https://github.com/aliciagorton/12-MySQL-Homework-Employee-Tracker.git

* A video demonstrating the entirety of the app's functionality:
https://drive.google.com/file/d/1saHWtXqdTRzArG1hNZn7ELLKHA5OUFDs/view?usp=sharing

- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.
