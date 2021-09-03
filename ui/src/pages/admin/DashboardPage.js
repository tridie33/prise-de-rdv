import { Box, Text } from "@chakra-ui/react";

import { useFetch } from "../../common/hooks/useFetch";
import { KpisComponent } from "./KpiContainer";
import { RequestsBoardComponent } from "./RequestsBoardComponent";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, loading] = useFetch("api/appointment/appointments/details?limit=500");
  const appointments = data === null ? [] : data.appointments;

  return (
    <Box px={[5, 5, 10, 40]} py={6}>
      <Text textStyle="h4" fontWeight="500">
        Tableau de bord
      </Text>
      {loading && "Chargement des données..."}
      {data && (
        <>
          <KpisComponent />
          <RequestsBoardComponent appointments={appointments} />
        </>
      )}
    </Box>
  );
};
