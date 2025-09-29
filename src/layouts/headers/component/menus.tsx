import React from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";

const Menus = () => {
  return (
    <>
      {menu_data.map((menu) => (
          <li key={menu.id} className="nav-item">
            <Link 
              className="nav-link" 
              href={menu.sub_menus ? menu.sub_menus[0].link : 
                    menu.mega_menus ? menu.mega_menus[0].sub_menus[0].link : 
                    '/contact'} 
              role="button"
            >
              {menu.title}
            </Link>
          </li>
        )
      )}
    </>
  );
};

export default Menus;
