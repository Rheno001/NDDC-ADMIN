import { useReducer, useEffect, useState, useContext } from "react";
import { Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MenuList } from "./Menu";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";

interface MenuItem {
  title: string;
  to?: string;
  iconStyle?: JSX.Element;
  update?: string;
  hasMenu?: boolean;
  classsChange?: string;
  content?: MenuItem[];
}

interface State {
  active: string;
  activeSubmenu: string;
}

const reducer = (
  previousState: State,
  updatedState: Partial<State>
): State => ({
  ...previousState,
  ...updatedState,
});

const initialState: State = {
  active: "",
  activeSubmenu: "",
};

const SideBar: React.FC = () => {
  const [state, setState] = useReducer(reducer, initialState);
  const { setIconhover, setAuth } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("AUTH");
    setAuth(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const btn = document.querySelector(".nav-control") as HTMLDivElement | null;
    const mainWrapper = document.querySelector(
      "#main-wrapper"
    ) as HTMLDivElement | null;

    function toggleFunc() {
      mainWrapper?.classList.toggle("menu-toggle");
    }

    btn?.addEventListener("click", toggleFunc);
    return () => {
      btn?.removeEventListener("click", toggleFunc);
    };
  }, []);



  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  const handleMenuActive = (status: string) => {
    setState({ active: state.active === status ? "" : status });
  };

  const handleSubmenuActive = (status: string) => {
    setState({ activeSubmenu: state.activeSubmenu === status ? "" : status });
  };

  let path = window.location.pathname;
  path = path.split("/").pop() || "";

  useEffect(() => {
    MenuList.forEach((data: MenuItem) => {
      data.content?.forEach((item) => {
        if (path === item.to) {
          setState({ active: data.title });
        }
        item.content?.forEach((ele) => {
          if (path === ele.to) {
            setState({ activeSubmenu: item.title, active: data.title });
          }
        });
      });
    });
  }, [path]);

  function hoverHandler() {
    if (
      document.body.getAttribute("data-sidebar-style")?.includes("icon-hover")
    ) {
      setIconhover(true);
    } else {
      setIconhover(false);
    }
  }
  return (
    <div
      className={`dlabnav`}
      onMouseEnter={hoverHandler}
      onMouseLeave={() => setIconhover(false)}
    >
      <div className="dlabnav-scroll">
        <ul className="metismenu" id="menu">
          {MenuList.map((data: MenuItem, index: number) => {
            const menuClass = data.classsChange;
            if (menuClass === "menu-title") {
              return (
                <li className={menuClass} key={index}>
                  {data.title}
                </li>
              );
            } else {
              return (
                <li
                  className={`${state.active === data.title ? "mm-active" : ""
                    }`}
                  key={index}
                >
                  {data.content && data.content.length > 0 ? (
                    <>
                      <Link
                        to="#"
                        className="has-arrow"
                        onClick={() => handleMenuActive(data.title)}
                      >
                        {data.iconStyle}
                        <span className="nav-text">{data.title}</span>
                        {data.update && (
                          <span className="ms-1 badge badge-xs style-1 badge-danger">
                            {data.update}
                          </span>
                        )}
                      </Link>
                      <Collapse in={state.active === data.title}>
                        <ul
                          className={`${menuClass === "mm-collapse" ? "mm-show" : ""
                            }`}
                        >
                          {data.content.map((item, idx) => (
                            <li
                              key={idx}
                              className={`${state.activeSubmenu === item.title
                                ? "mm-active"
                                : ""
                                }`}
                            >
                              {item.content && item.content.length > 0 ? (
                                <>
                                  <Link
                                    to={item.to || "#"}
                                    className={item.hasMenu ? "has-arrow" : ""}
                                    onClick={() =>
                                      handleSubmenuActive(item.title)
                                    }
                                  >
                                    {item.title}
                                  </Link>
                                  <Collapse
                                    in={state.activeSubmenu === item.title}
                                  >
                                    <ul
                                      className={`${menuClass === "mm-collapse"
                                        ? "mm-show"
                                        : ""
                                        }`}
                                    >
                                      {item.content.map((subItem, subIdx) => (
                                        <li key={subIdx}>
                                          <Link
                                            className={`${path === subItem.to
                                              ? "mm-active"
                                              : ""
                                              }`}
                                            to={subItem.to || "#"}
                                          >
                                            {subItem.title}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </Collapse>
                                </>
                              ) : (
                                <Link
                                  to={item.to || "#"}
                                  className={`${path === item.to ? "mm-active" : ""
                                    }`}
                                >
                                  {item.title}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </>
                  ) : (
                    <Link
                      to={data.to || "#"}
                      className={`${path === data.to ? "mm-active" : ""}`}
                    >
                      {data.iconStyle}
                      <span className="nav-text">{data.title}</span>
                    </Link>
                  )}
                </li>
              );
            }
          })}
        </ul>

        <div className="px-4 mt-4">
          <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 text-white" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>

        <div className="copyright">
          <p>
            <strong>NDDC Admin Dashboard</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
