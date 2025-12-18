import React from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";

const Menus = () => {
  return (
    <>
      {menu_data.map((menu) => (
        <li key={menu.id} className={`nav-item ${menu.sub_menus ? 'dropdown' : ''}`}>
          {menu.sub_menus && menu.sub_menus.length > 1 ? (
            <>
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                {menu.title}
              </a>
              <ul className="dropdown-menu">
                {menu.sub_menus.map((sub) => (
                  <li key={`${menu.id}-${sub.link}`}>
                    <Link href={sub.link} className="dropdown-item">
                      <span>{sub.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link 
              className="nav-link" 
              href={menu.sub_menus ? menu.sub_menus[0].link : 
                    menu.mega_menus ? menu.mega_menus[0].sub_menus[0].link : 
                    menu.link || '/contact'} 
              role="button"
            >
              {menu.title}
            </Link>
          )}
        </li>
      ))}
    </>
  );
};

export default Menus;
