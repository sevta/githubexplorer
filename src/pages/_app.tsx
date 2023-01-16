import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { AppProps } from "next/app";
import Head from "next/head";
export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          focusRingStyles: {
            // reset styles are applied to <button /> and <a /> elements
            // in &:focus:not(:focus-visible) selector to mimic
            // default browser behavior for native <button /> and <a /> elements
            resetStyles: () => ({ outline: "none" }),

            // styles applied to all elements expect inputs based on Input component
            // styled are added with &:focus selector
            styles: (theme) => ({
              outline: `2px solid ${theme.colors[theme.primaryColor][5]}`,
            }),

            // focus styles applied to components that are based on Input
            // styled are added with &:focus selector
            inputStyles: (theme) => ({
              outline: `2px solid ${theme.colors[theme.primaryColor][5]}`,
            }),
          },
        }}
      >
        <NotificationsProvider>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
