import type { AppProps } from "next/app";
import DemoSwitcher from "../components/DemoSwitcher";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollToTop from "../components/ScrollToTop";
import "../index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <DemoSwitcher />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
