import ChatIcon from "@/components/chat/ChatIcon";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
      <ChatIcon />
      <Footer />
    </main>
  );
}

export default layout;
