USE employee_trackerDB;

INSERT INTO department (name)
VALUES 
("Sales"), 
("Engineering"), 
("Finance"), 
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Lead", 100000, 1), 
("Salesperson", 80000, 1), 
("Lead Engineer", 150000, 2), 
("Software Engineer", 120000, 2), 
("Accountant", 125000, 3), 
("Legal Team Lead", 250000, 4), 
("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("Oscar", "Wilde", 1), 
("James", "Joyce", 2), 
("Clarice", "Lispector", 3),
("Jane", "Austen", 4), 
("George", "Orwell", 5), 
("Bell", "Hooks", 6), 
("Charles", "Dickens", 7), 
("Kurt", "Vonnegut", 5), 
("Maya", "Angelou", 4); 