import { Outlet } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px",
      }}
    >
      <Header />

      <main style={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
