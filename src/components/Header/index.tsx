"use client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import menuData from "./menuData";

const Header = () => {
  const { data: session } = useSession();

  const pathUrl = usePathname();

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen((v) => !v);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => setSticky(window.scrollY >= 80);
  useEffect(() => {
    handleStickyNavbar();
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) =>
    setOpenIndex((i) => (i === index ? -1 : index));

  return (
    <>
      <header
        className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px]"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link
                href="/"
                className={`navbar-logo block w-full ${sticky ? "py-2" : "py-5"}`}
              >
                <Image
                  src={`/images/logo/logoh.png`}
                  alt="logo"
                  width={240}
                  height={30}
                  className="header-logo w-full"
                />
              </Link>
            </div>

            <div className="flex items-center justify-between px-4">
              <div>
                {/* Toggler */}
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-emerald-900 focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      navbarOpen ? "top-[7px] rotate-45" : ""
                    } ${pathUrl !== "/" && "!bg-dark"} ${
                      pathUrl === "/" && sticky ? "bg-dark" : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      navbarOpen ? "opacity-0" : ""
                    } ${pathUrl !== "/" && "!bg-dark"} ${
                      pathUrl === "/" && sticky ? "bg-dark" : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                      navbarOpen ? "top-[-8px] -rotate-45" : ""
                    } ${pathUrl !== "/" && "!bg-dark"} ${
                      pathUrl === "/" && sticky ? "bg-dark" : "bg-white"
                    }`}
                  />
                </button>

                {/* Menu */}
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 overflow-hidden lg:overflow-visible lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:gap-x-8 xl:gap-x-12">
                    {menuData.map((menuItem, index) =>
                      menuItem.path ? (
                        // ------ ITEM COM LINK ------
                        <li key={index} className="group relative">
                          {pathUrl !== "/" ? (
                            <Link
                              onClick={navbarToggleHandler}
                              scroll={false}
                              href={menuItem.path}
                              className={`ud-menu-scroll flex py-2 text-base text-dark group-hover:text-emerald-900 lg:inline-flex lg:px-0 lg:py-6 ${
                                pathUrl === menuItem?.path && "text-emerald-900"
                              }`}
                            >
                              {menuItem.title}
                            </Link>
                          ) : (
                            // MOBILE: texto escuro | DESKTOP: alterna por sticky
                            <Link
                              onClick={navbarToggleHandler}
                              scroll={false}
                              href={menuItem.path}
                              className={`ud-menu-scroll flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 text-dark ${
                                sticky
                                  ? "lg:text-dark group-hover:text-emerald-900"
                                  : "lg:text-white"
                              } ${pathUrl === menuItem?.path && sticky && "!text-emerald-900"}`}
                            >
                              {menuItem.title}
                            </Link>
                          )}
                        </li>
                      ) : (
                        // ------ ITEM PAI (SEM PATH) ------
                        <li className="submenu-item group relative" key={index}>
                          <button
                            onClick={() => handleSubmenu(index)}
                            className={`ud-menu-scroll flex items-center justify-between py-2 text-base text-dark lg:inline-flex lg:px-0 lg:py-6 ${
                              sticky
                                ? "lg:text-dark group-hover:text-emerald-900"
                                : "lg:text-white"
                            }`}
                          >
                            {menuItem.title}
                            <span className="pl-1">
                              <svg
                                className="duration-300 lg:group-hover:rotate-180"
                                width="16"
                                height="17"
                                viewBox="0 0 16 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </button>

                          {/* Submenu */}
                          <div
  className={`
    ${openIndex === index ? "block" : "hidden"}  /* mobile: abre/fecha por clique */
    w-full rounded-sm bg-white dark:bg-dark-2
    lg:block lg:absolute lg:left-0 lg:top-[110%] lg:mt-0 lg:w-[250px]
    lg:opacity-0 lg:invisible lg:shadow-lg
    lg:group-hover:visible lg:group-hover:opacity-100 lg:group-hover:top-full
  `}
>
  {menuItem?.submenu?.map((submenuItem: any, i: number) => (
    <Link
      href={submenuItem.path}
      key={i}
      onClick={() => {
        setNavbarOpen(false);
        setOpenIndex(-1);
      }}
      className={`block rounded px-4 py-[10px] text-sm ${
        pathUrl === submenuItem.path
          ? "text-emerald-900"
          : "text-body-color hover:text-emerald-900 dark:text-dark-6 dark:hover:text-emerald-900"
      }`}
    >
      {submenuItem.title}
    </Link>
  ))}
</div>

                        </li>
                      )
                    )}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">         
              <Link
                href="https://wa.me/5592991554925?text=Ol%C3%A1!%20Gostaria%20de%20receber%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os."
                className={`rounded-full px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${
                  sticky ? "bg-emerald-900 hover:bg-emerald-900/90" : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Contacte-nos
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
