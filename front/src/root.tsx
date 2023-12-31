// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { Router } from "@solidjs/router";
import "./root.css";
import { AccountProvider } from "./context/account";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Bookatable</Title>
        <Meta charset="utf-8" />
        <link href='https://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet'></link>
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <ErrorBoundary>
          <AccountProvider>
            <Suspense fallback={<div>Loading</div>}>
                <Routes>
                  <FileRoutes />
                </Routes>
            </Suspense>
          </AccountProvider>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
