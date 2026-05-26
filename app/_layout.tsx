import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "Tarefas", drawerLabel: "Minhas Tarefas" }} />
      <Drawer.Screen name="sobre" options={{ title: "Sobre", drawerLabel: "Sobre" }} />
    </Drawer>
  );
}
