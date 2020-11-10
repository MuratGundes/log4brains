import React from "react";
import Router from "next/router";
import { AdrLight } from "../../types";
import { Log4brainsMode, Log4brainsModeContext } from "../../contexts";
import { AdrBrowserLayout, AdrBrowserLayoutProps } from "./AdrBrowserLayout";

export function ConnectedAdrBrowserLayout(
  props: Omit<AdrBrowserLayoutProps, "adrs">
) {
  const mode = React.useContext(Log4brainsModeContext);
  const [adrs, setAdrsState] = React.useState<AdrLight[]>();
  const [routing, setRoutingState] = React.useState(false);

  Router.events.on("routeChangeStart", () => setRoutingState(true));
  Router.events.on("routeChangeComplete", () => setRoutingState(false));
  Router.events.on("routeChangeError", () => setRoutingState(false)); // TODO: show a modal?

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      setAdrsState(
        await (
          await fetch(
            mode === Log4brainsMode.preview ? "/api/adr" : "/data/adrs.json"
          )
        ).json()
      );
    })();
  }, [mode]);

  return <AdrBrowserLayout {...props} adrs={adrs} routing={routing} />;
}