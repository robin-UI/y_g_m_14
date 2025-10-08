import SocketProvider from "@/providers/SocketProvider";
import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <section>{children}</section>;
    </SocketProvider>
  );
}

export default layout;
