import "./MainPageHeader.css";

const MainPageHeader = () => {
  const reload = () => {
    window.location.reload();
  };

  return (
    <div className="main-page-header">
      <div class="header" onClick={reload}>
       <div class="logo">
          <img
            src="https://itc.gymkhana.iitb.ac.in/wncc/assets/images/logo-large.png"
            alt="logo"
            style={{width: "80%"}}
          />
        </div>
        <h2>
          Expense<span class="highlight">Tracker</span>
        </h2>
      </div>
    </div>
  );
};

export default MainPageHeader;
