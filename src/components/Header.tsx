import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import MountainIcon from "@/components/MountainIcon";

const Header = () => {
  const { userId }: { userId: string | null } = auth();

  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between bg-white px-6 py-4 dark:bg-gray-800">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <MountainIcon className="h-6 w-6" />
          <span className="">Next.js Inc </span>
        </Link>
        <nav className="hidden gap-4 md:flex">
          <Link className="text-sm font-medium hover:underline" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline" href="/">
            About
          </Link>
          {!userId && (
            <Link
              className="text-sm font-medium hover:underline"
              href="/register"
            >
              Register
            </Link>
          )}
          {userId && (
            <Link
              className="text-sm font-medium hover:underline"
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}
        </nav>
        <nav className="gap-4 md:flex">
          {!userId && (
            <>
              <Button asChild variant={"outline"}>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </>
          )}
          <UserButton afterSignOutUrl="/" />
        </nav>
      </header>
    </div>
  );
};

export default Header;
