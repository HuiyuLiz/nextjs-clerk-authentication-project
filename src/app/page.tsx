/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0Cvy4F5cQ47
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs";
import Header from "@/components/Header";

export default function HomePage() {
  const { userId }: { userId: string | null } = auth();

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col bg-gray-100">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
                src="/images/main.jpg"
                width={550}
                height={550}
                alt="Picture of the building web"
              />
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold sm:text-5xl xl:text-5xl/none">
                    The complete platform for building the Web
                  </h1>
                  <p className="md:text-md max-w-[600px] text-gray-500 dark:text-gray-400">
                    Give your team the toolkit to stop configuring and start
                    innovating. Securely build, deploy, and scale the best web
                    experiences.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href={userId ? "/dashboard" : "/sign-up"}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
