import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Conteúdo",
    newTab: false,
    submenu: [
      {
        id: 61,
        title: "Sobre",
        path: "/",
        newTab: false,
      },
      {
        id: 62,
        title: "Agrovia Ensina",
        path: "/",
        newTab: false,
      }            
    ],
  },
  {
    id: 3,
    title: "Pessoas",
    newTab: false,
    submenu: [
      {
        id: 71,
        title: "Sobre",
        path: "/",
        newTab: false,
      }      
    ],
  },
  {
    id: 4,
    title: "Parceiros",
    path: "/",
    newTab: false,
  }
];
export default menuData;
