const fetchExpense = async (cookies) => {
    const url = "/api/v1/expense/fetch/";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${cookies.user}`,
        },
    });
    const result = await response.json();
    return result;
};

const addExpense = async (expense, cookies) => {
    const url = "/api/v1/expense/insert/";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookies.user}`
        },
        body: JSON.stringify(expense),
    });
    const result = await response.json();
    return result;
};

const deleteExpense = async (id, year, cookies) => {
    const url = "/api/v1/expense/delete/";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookies.user}`,
        },
        body: JSON.stringify({ id: id, year: year }),
    });
    const result = await response.json();
    return result;
};

export { fetchExpense, addExpense, deleteExpense };