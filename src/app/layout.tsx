"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import SaveScrollPosition from "@/components/Common/SaveScrollPosition";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import Providers from "./providers";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathName = usePathname();

  const hideHeader = ["/sobre", "/info-page", "/guia", "/redes-sociais", "/servicos", "/contato"];
  const isPostPage = pathName?.startsWith('/post/');

  return (
    <html suppressHydrationWarning className="!scroll-smooth" lang="en">
      <body>
        <Providers>
          <div className="isolate">
            <SaveScrollPosition />
            {!hideHeader.includes(pathName) && !isPostPage && <Header />}

            {children}

            {/* <Footer /> */}
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
