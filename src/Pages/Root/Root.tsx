import React from "react";
import Navbar from "../../Components/layout/Navbar";
import { Footer } from "../../Components/layout/Footer";
import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
