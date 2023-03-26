import { Header, Footer } from "./";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
