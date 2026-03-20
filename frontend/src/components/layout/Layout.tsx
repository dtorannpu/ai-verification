import { Outlet } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <main style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
