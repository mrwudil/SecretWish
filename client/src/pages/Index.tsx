import { useAuth } from "@/hooks/use-auth";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import { Nav } from "@/components/ui-elements";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      {isAuthenticated ? <Dashboard /> : <Landing />}
    </>
  );
}
