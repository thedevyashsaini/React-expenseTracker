import React, { useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";

import Auth from "./components/UI/Auth";
import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";
import { fetchExpense, addExpense, deleteExpense } from "./utils";
import Alert from "./components/UI/Alert";
import MainPageHeader from "./components/UI/MainPageHeader";

const App = () => {
  const [expenses, setExpenses] = useState(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const [loginError, setAuthError] = useState({ error: false, message: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);

  const fetchExpenseHandler = async () => {
    const result = await fetchExpense(cookies);
    if (result.success) {
      setExpenses(result.expenses);
    } else {
      setAlert({
        type: "Error",
        message: "Error: " + result.message,
      });
      if (result.errorCode !== undefined) {
        if (result.errorCode === "fuck") {
          onLogout();
        }
      }
      console.log(result.message);
    }
  };

  if (cookies.user && expenses === null) {
    if (retry <= 2) {
      fetchExpenseHandler();
      setRetry((retry) => {return retry+1})
    }
  }

  const loginHandler = (username, password) => {
    const url = "/api/v1/auth/in/";
    const data = { username, password };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setAlert({ type: "Success", message: "Logged in successfully!" });
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 10);
          setTimeout(() => {
            setLoading(false);
            setCookie("user", result.token, { path: "/", expires });
          }, 2000);
        } else {
          console.log(result.message);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          setAuthError({ error: true, message: result.message });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setAuthError({ error: true, message: error });
      });
  };

  const signupHandler = (name, email, username, password) => {
    const url = "/api/v1/auth/up/";
    const data = {
      username: username,
      password: password,
      name: name,
      email: email,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setAlert({ type: "Success", message: "Signed up successfully!" });
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 10);
          setTimeout(() => {
            setLoading(false);
            setCookie("user", result.token, { path: "/", expires });
          }, 2000);
        } else {
          console.log(result.message);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          setAuthError({ error: true, message: result.message });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setAuthError({ error: true, message: error });
      });
  };

  const addExpenseHandler = async (expense) => {
    const year = new Date(expense.date).getFullYear();
    const result = await addExpense(expense, cookies);
    if (!result.success) {
      setAlert({ type: "Error", message: "Error: " + result.message });
      if (result.errorCode !== undefined) {
        if (result.errorCode === "fuck") {
          onLogout();
        }
      }
      console.log(result.message);
      return;
    }
    setAlert({ type: "Success", message: "Expense added successfully!" });
    setExpenses((prevExpenses) => {
      const updatedExpenses = { ...prevExpenses };
      if (updatedExpenses[year]) {
        updatedExpenses[year].unshift(expense);
      } else {
        updatedExpenses[year] = [expense];
      }
      return updatedExpenses;
    });
  };

  const changeClickHandler = () => {
    setIsLogin(!isLogin);
  };

  const deleteHandler = async (id, year) => {
    const result = await deleteExpense(id, year, cookies);
    if (!result.success) {
      setAlert({ type: "Error", message: "Error deleting: " + result.message });
      if (result.errorCode !== undefined) {
        if (result.errorCode === "fuck") {
          onLogout();
        }
      }
      console.log(result.message);
      return;
    }
    setAlert({ type: "Success", message: "Expense deleted successfully!" });
    setExpenses((prevExpenses) => {
      const updatedExpenses = { ...prevExpenses };
      updatedExpenses[year] = updatedExpenses[year].filter(
        (expense) => expense.id !== +id
      );
      return updatedExpenses;
    });
  };

  const setMessage = (message) => {
    setAlert({ type: "", message: message });
  };

  const onLogout = () => {
    document.getElementsByTagName("body")[0].classList.add("out");
    setTimeout(() => {
      document.getElementsByTagName("body")[0].classList.remove("in");
      setCookie("user", "", { path: "/" });
      setExpenses(null);
      setAuthError({ error: false, message: "" });
      setIsLogin(true);
      document.getElementById("root").style.setProperty("height", "100%")
    }, 100);
  };

  const loadingHandler = (loading) => {
    setLoading(loading);
  };

  return (
    <CookiesProvider>
      {alert.type !== "" ? (
        <Alert
          type={alert.type}
          message={alert.message}
          setMessage={setMessage}
        />
      ) : null}
      {!cookies.user ? (
        <Auth
          onSubmit={isLogin ? loginHandler : signupHandler}
          isLogin={isLogin}
          inValid={loginError}
          onChangeClick={changeClickHandler}
          isLoading={loadingHandler}
          loading={loading}
        />
      ) : (
        <div>
          {document.getElementsByTagName("body")[0].classList.remove("out")}
          {document.getElementsByTagName("body")[0].classList.add("in")}
          {document.getElementById("root").style.setProperty("height", "calc(100% - 140px)")}
          <MainPageHeader onLogout={onLogout}/>
          <NewExpense onNewExpenseData={addExpenseHandler} />
          {(expenses != null && Object.keys(expenses).length) > 0 ? (
            <Expenses expenses={expenses} onDeleteClick={deleteHandler} />
          ) : (
            <p style={{ textAlign: "center" }}>Start Adding Expenses Now!</p>
          )}
        </div>
      )}
    </CookiesProvider>
  );
};

export default App;
