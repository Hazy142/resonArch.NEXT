import Link from "next/link";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <>
      <nav className="topbar page-width">
        <Link className="brand" href="/">resonArch<span>.NEXT</span></Link>
        <Link className="ghost-link" href="/">← Public lab</Link>
      </nav>
      <AdminDashboard />
    </>
  );
}
