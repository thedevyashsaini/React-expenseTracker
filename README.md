
# React - expenseTracker

A simple expense tracker made with PostgreSQL, Express, React and Node.js (PERN)

## Demo

Website Live Here: https://expenseTracker-TDS.onrender.com/

![Demo Pic](https://i.imgur.com/Oxf2L12.png)

## Features

- Login & SignUp
- Add New Expenses
- Filter Expenses by Year
- Monthly Expense Distribution Graph
- Delete Expenses


## Installation

Install required libraries in the root directory.

```bash
  $ npm install
  
```

Install required libraries in the Frontend directory.

```bash
  $ cd Frontend
  $ npm install
```

Create the production build of the Frontned.
```bash
  $ cd Frontend
  $ npm run build
```

Set environment variables.
On ubuntu you can set environment variables like this:
```bash 
  $ export conString=Your_PostgreSQL_Connetion_String
  $ export JWT_SECRET_KEY=Some_Secret_Password
```

## Usage

Run expenseTracker server
```bash
  $ npm start
  
```

## Authors

- [@TheDevyashSaini](https://www.github.com/thedevyashsaini)