import React, { createContext, useMemo, useState, useContext, ReactNode } from "react";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type SelectedMenu = {
  id: MenuIds;
};

type MenuSelected = {
  selectedMenu: SelectedMenu;
};

type MenuAction = {
  onSelectedMenu: (selectedMenu: SelectedMenu) => void;
};

type PropsProvider = {
  children: ReactNode;
};

const initialSelectedMenu: SelectedMenu = { id: "first" };

const MenuSelectedContext = createContext<MenuSelected | undefined>(undefined);
const MenuActionContext = createContext<MenuAction | undefined>(undefined);

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>(initialSelectedMenu);

  const menuContextAction: MenuAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected: MenuSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext<MenuAction>(
    MenuActionContext as React.Context<MenuAction>
  )!;
  const { selectedMenu } = useContext<MenuSelected>(
    MenuSelectedContext as React.Context<MenuSelected>
  )!;

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title} {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}