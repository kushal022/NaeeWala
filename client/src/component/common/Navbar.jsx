import { useState } from "react";
import { Link, Links, NavLink } from "react-router-dom";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import LanguageSelect from "./LanguageSelect";
// import LanguageSelect from "./LanguageSelect";

const Navbar = () => {
  const navdata = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    { name: "Notification", link: "/notification" },
  ];
  const linkClass =
    "block py-2 px-3 text-black hover:text-blue-600 font-medium";

  return (
    <nav className="backdrop-blur-md bg-white/20 shadow-md sticky top-0 z-50 font-poppins text-black ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
 {/* Logo */}
            <div>
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyLogo
          </Link>
            </div>
         

          <div className="flex md:space-x-8 ">
            {navdata.map((item, index) => (
              <NavLink key={index} to={item.link} className={linkClass}>
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="relative ">
           <SearchOutlinedIcon className="absolute top-3 right-5 "/>
            <label htmlFor="" className="text-xl">Search</label>
            <input type="text" className="border rounded-3xl m-2 py-1 px-4" />
          </div>
          {/* <div><LanguageSelect/>
          </div> */}
          <div>
            <button className="border rounded px-2 m-2 ">
               Login</button>
            <button className="border rounded px-2 -2">Create account</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
