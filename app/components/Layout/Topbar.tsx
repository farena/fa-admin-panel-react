import { useEffect } from "react";
import { useLogoutMutation } from "~/store/api/auth";

export default function Topbar() {
  const [logOut] = useLogoutMutation();

  const closeSidebar = (e: MouseEvent) => {
    const sb = document.querySelector(".sidebar");
    if (!sb) return;

    if (sb.classList.contains("sidebar-open")) {
      if (!(e.target instanceof Element)) return;
      if (e.target.closest(".sidebar")) return;

      sb.classList.remove("sidebar-open");
    }
  };
  const openSidebar = () => {
    const sb = document.querySelector(".sidebar");
    if (!sb) return;

    sb.classList.add("sidebar-open");
  };
  const openSettings = () => {};

  useEffect(() => {
    document.addEventListener("click", closeSidebar);

    return () => {
      document.removeEventListener("click", closeSidebar);
    };
  }, []);

  return (
    <div className="topbar">
      <button
        className="btn btn-transparent menu-handler"
        onClick={openSidebar}
      >
        <i className="fa fa-bars"></i>
      </button>

      <ul className="topbar-buttons">
        <li onClick={openSettings}>
          <i className="fa-solid fa-user"></i>
          <div className="tooltip bottom-left">Profile</div>
        </li>
        <li onClick={() => logOut()}>
          <i className="fa-solid fa-power-off"></i>
          <div className="tooltip bottom-left">Logout</div>
        </li>
      </ul>
    </div>
  );
}
