import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import bgImage from "./img.png"
const Loginsignup = () => {
  const [page, setPage] = useState("login");

  const switchPage = (target) => {
    setPage(target);
  };
  return (
     <div
      className="min-h-screen flex items-center justify-center  font-outfit relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <div className="w-full max-w-[980px] relative z-10">
        {page === "login" && <Login switchPage={switchPage} />}
        {page === "signup" && <Signup switchPage={switchPage} />}
        {page === "forgot" && <ForgotPassword switchPage={switchPage} />}
      </div>
    </div>
  
  );
}

export default Loginsignup
