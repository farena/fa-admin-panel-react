import { useId, useState } from "react";
import { NavLink } from "react-router";
import { useClassParser } from "~/hooks/useClassParser";
import { menus, type Menu } from "~/menus";

function MenuRow({ menu }: { menu: Menu }) {
  const menuId = useId();

  const closeSubmenus = () => {
    const others = document.querySelectorAll("ul.menu > li > ul");
    others.forEach((x) => x.classList.remove("opened"));
  };
  const sortByTitle = (submenus: Menu[]): Menu[] => {
    return submenus.sort((a, b) => {
      return a.title > b.title ? 1 : -1;
    });
  };
  const parseSubmenuIcon = (submenu: Menu) => {
    return submenu.title
      .toUpperCase()
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("");
  };
  const toggleTarget = (id: typeof menuId) => {
    const t = document.getElementById(id);
    if (!t) return;

    const canOpen = !t.classList.contains("opened");
    closeSubmenus();

    if (canOpen) t.classList.add("opened");
  };

  if (!menu.children?.length) {
    return (
      <li>
        <NavLink
          className={useClassParser({ disabled: !menu.to })}
          to={menu.to || "/"}
          onClick={closeSubmenus}
        >
          <div className="icon">
            <i className={menu.icon} />
          </div>
          {menu.title}
        </NavLink>
      </li>
    );
  }

  return (
    <>
      <li>
        <ul id={menuId}>
          {sortByTitle(menu.children).map((submenu, smi) => (
            <li key={smi}>
              <NavLink
                className={useClassParser({
                  disabled: !submenu.to,
                })}
                to={submenu.to || "#"}
              >
                <span className="icon">{parseSubmenuIcon(submenu)}</span>
                {submenu.title}
              </NavLink>
            </li>
          ))}
        </ul>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            toggleTarget(menuId);
          }}
        >
          <i className={`icon ${menu.icon}`} />
          {menu.title}
          {menu.children && menu.children.length && (
            <i className="fa-solid fa-angle-right arrow" />
          )}
        </a>
      </li>
    </>
  );
}

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="brand">
        <img src="/img/logo.svg" className="brand-logo" alt="" />
        <h1>QUARTZ</h1>
      </div>
      <ul className="menu">
        {menus.map((menu, i) => (
          <MenuRow menu={menu} key={i} />
        ))}
      </ul>
    </div>
  );
}
