import React from "react";
import { Grid, Page } from "tabler-react";
import { UpdateAllParameterReferrers } from "../components/UpdateAllParameterReferrers";
import { BulkImport } from "../components/BulkImport";
import { ActivateAllCfaFormations } from "../components/ActivateAllCfaFormations";

export default () => (
  <Page>
    <Page.Main>
      <Page.Content>
        <BulkImport />
        <Grid.Row cards deck>
          <Grid.Col>
            <UpdateAllParameterReferrers />
          </Grid.Col>
          <Grid.Col>
            <ActivateAllCfaFormations />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </Page.Main>
  </Page>
);
