//require in your dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({ 
    host: "localhost",
    port: "3306",
    user: "root",
    password: "123456",
    database: "employee_trackerDB"
})

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  firstPrompt();
});

function firstPrompt(){
  inquirer.prompt([
  {
    type: 'list',
    name:'userChoice',
    message: 'What would you like to do?',
    choices: [
    'View All Employees',
    'View Employees By Department',
    'Add Employee',
    'Remove Employee',
    'Update Employee Role',
    'Add Role',
    'Add Department',
    'Exit'
    ]
      
  }

  ]).then((res)=>{
    console.log(res.userChoice);
    switch(res.userChoice){
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'View Employees By Department':
        viewEmployeesByDepartment();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Remove Employee':
        removeEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Exit':
        database.end();
        break;
      }
      
    }).catch((err)=>{
  if(err)throw err;
  });
}

// EMPLOYEES

function viewAllEmployees() {
    let query = `SELECT 
                    employees.id, 
                    employees.first_name, 
                    employees.last_name, 
                    roles.title, 
                    department.name AS department, 
                    roles.salary, 
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employees
                LEFT JOIN roles
                    ON employees.role_id = roles.id
                LEFT JOIN department
                    ON department.id = roles.department_id
                LEFT JOIN employees manager
                    ON manager.id = employees.manager_id`
  
    database.query(query, (err, res)=>{
      if (err) throw err;
      console.table(res);
      initialPrompt();
    });
}

//VIEW EMPLOYEES BY DEPARTMENT
function viewEmployeesByDepartment(){
    let query =`SELECT 
                    department.id, 
                    department.name, 
                    roles.salary
                FROM employees
                LEFT JOIN roles 
                    ON employees.role_id = roles.id
                LEFT JOIN department
                    ON department.id = roles.department_id
                GROUP BY department.id, department.name`;
  
    database.query(query,(err, res)=>{
        if (err) throw err;
        const deptChoices = res.map((choices) => ({
            value: choices.id, name: choices.name
        }));
      console.table(res);
      getDept(deptChoices);
    });
}
//GET DEPARTMENT
function getDept(deptChoices){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Departments: ',
                choices: deptChoices
            }
        ]).then((res)=>{ 
        let query = `SELECT 
                        employees.id, 
                        employees.first_name, 
                        employees.last_name, 
                        roles.title, 
                        department.name
                    FROM employees
                    JOIN roles
                        ON employees.role_id = roles.id
                    JOIN department
                        ON department.id = roles.department_id
                    WHERE department.id = ?`
  
        database.query(query, res.department,(err, res)=>{
        if(err)throw err;
          initialPrompt();
          console.table(res);
        });
    })
}

//ADD AN EMPLOYEE
function addEmployee() {
    let query = `SELECT 
                    roles.id, 
                    roles.title, 
                    roles.salary 
                FROM roles`
  
    database.query(query,(err, res)=>{
      if(err)throw err;
      const roles = res.map(({ id, title, salary }) => ({
        value: id, 
        title: `${title}`, 
        salary: `${salary}`
      }));
  
      console.table(res);
      employeeRoles(roles);
    });
}
  
function employeeRoles(roles) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Employee First Name: "
        },
        {
          type: "input",
          name: "lastName",
          message: "Employee Last Name: "
        },
        {
          type: "list",
          name: "roleId",
          message: "Employee Role: ",
          choices: roles
        }
      ]).then((res)=>{
            let query = `INSERT INTO employees SET ?`
            database.query(query,{
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: res.roleId
            },(err, res)=>{
                if(err) throw err;
                initialPrompt();
          });
      });
}

//REMOVE EMPLOYEE
function removeEmployee() {
    let query =`SELECT
                    employees.id, 
                    employees.first_name, 
                    employees.last_name
                FROM employees`
  
    database.query(query,(err, res)=>{
      if(err)throw err;
      const employee = res.map(({ id, first_name, last_name }) => ({
        value: id,
        name: `${id} ${first_name} ${last_name}`
      }));
      console.table(res);
      getDelete(employee);
    });
}

function getDelete(employee){  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Employee To Be Deleted: ",
          choices: employee
        }
      ]).then((res)=>{
        let query = `DELETE FROM employees WHERE ?`;
        database.query(query, { id: res.employee },(err, res)=>{
          if(err) throw err;
          initialPrompt();
        });
      });
}

//UPDATE EMPLOYEE ROLE
function updateEmployeeRole(){
    let query = `SELECT 
                    employees.id,
                    employees.first_name, 
                    employees.last_name, 
                    roles.title, 
                    department.name, 
                    roles.salary, 
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employees
                JOIN roles
                    ON employees.role_id = roles.id
                JOIN department
                    ON department.id = roles.department_id
                JOIN employees manager
                    ON manager.id = employees.manager_id`
  
    database.query(query,(err, res)=>{
      if(err)throw err;
      const employee = res.map(({ id, first_name, last_name }) => ({
        value: id,
         name: `${first_name} ${last_name}`      
      }));
      console.table(res);
      updateRole(employee);
    });
}

function updateRole(employee){
    let query = `SELECT 
                    roles.id, 
                    roles.title, 
                    roles.salary 
                FROM roles`

    database.query(query,(err, res)=>{
      if(err)throw err;
      let roleChoices = res.map(({ id, title, salary }) => ({
        value: id, 
        title: `${title}`, 
        salary: `${salary}`      
      }));
      console.table(res);
      getUpdatedRole(employee, roleChoices);
    });
  }
  
function getUpdatedRole(employee, roleChoices) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: `Employee who's role will be Updated: `,
          choices: employee
        },
        {
          type: "list",
          name: "role",
          message: "Select New Role: ",
          choices: roleChoices
        },
      ]).then((res)=>{
        let query = `UPDATE employees SET role_id = ? WHERE id = ?`
        database.query(query,[ res.role, res.employee],(err, res)=>{
            if(err)throw err;
            initialPrompt();
          });
      });
}

//ADD ROLE
function addRole(){
    var query = `SELECT 
                    department.id, 
                    department.name, 
                    roles.salary
                FROM employees
                JOIN roles
                    ON employees.role_id = roles.id
                JOIN department
                    ON department.id = roles.department_id
                GROUP BY department.id, department.name`
  
    database.query(query,(err, res)=>{
      if(err)throw err;
      const department = res.map(({ id, name }) => ({
        value: id,
        name: `${id} ${name}`
      }));
      console.table(res);
      addToRole(department);
    });
}
  
function addToRole(department){
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Role title: "
        },
        {
          type: "input",
          name: "salary",
          message: "Role Salary: "
        },
        {
          type: "list",
          name: "department",
          message: "Department: ",
          choices: department
        },
      ]).then((res)=>{
        let query = `INSERT INTO roles SET ?`;
  
        database.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        },(err, res)=>{
            if(err) throw err;
            initialPrompt();
        });
    });
}

//ADD DEPARTMENT
function addDepartment(){
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Department Name: "
        }
      ]).then((res)=>{
        let query = `INSERT INTO department SET ?`;
        database.query(query, {name: res.name},(err, res)=>{
            if(err) throw err;
            //console.log(res);
            initialPrompt();
        });
    });
}