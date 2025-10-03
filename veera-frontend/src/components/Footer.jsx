import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 p-4 mt-auto text-center">
      &copy; {new Date().getFullYear()} Veera Admin
    </footer>
  );
};

export default Footer;