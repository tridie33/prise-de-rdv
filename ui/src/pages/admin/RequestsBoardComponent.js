import { Tbody, Tr, Thead, Td, Table, Flex, Box, Text } from "@chakra-ui/react";
import { AppointmentItemList } from "./AppointmentItemList";
import downloadFile from "../../common/utils/downloadFile";
import { Download } from "../../theme/components/icons";

/**
 * @description Appointments head table.
 * @param props
 * @returns {JSX.Element}
 */
export const RequestsBoardComponent = (props) => {
  /**
   * @description Downloads CSV file.
   * @returns {Promise<void>}
   */
  const download = () => downloadFile("/api/appointment/appointments/details/export", "rendez-vous.csv");

  return (
    <Box>
      <Flex bg="white" mt={10} border="1px solid #E0E5ED" borderBottom="none">
        <Text flex="1" fontSize="16px" p={5}>
          Rendez-vous
        </Text>
        <Download onClick={download} color="#9AA0AC" cursor="pointer" w="16px" h="16px" mt={6} mr={5} />
      </Flex>
      <Box border="1px solid #E0E5ED" overflow="auto" cursor="pointer">
        <Table w="300rem" bg="white">
          <Thead>
            <Tr color="#ADB2BC">
              <Td textStyle="sm">DATE</Td>
              <Td textStyle="sm">CANDIDAT</Td>
              <Td textStyle="sm">TÉLÉPHONE</Td>
              <Td textStyle="sm">EMAIL CANDIDAT</Td>
              <Td textStyle="sm">EMAIL CFA</Td>
              <Td textStyle="sm">ETABLISSEMENT</Td>
              <Td textStyle="sm">SIRET</Td>
              <Td textStyle="sm">FORMATION</Td>
              <Td textStyle="sm">CFD</Td>
              <Td textStyle="sm">SITE DE PROVENANCE</Td>
              <Td textStyle="sm">MAIL CANDIDAT</Td>
              <Td textStyle="sm">MAIL CFA</Td>
              <Td textStyle="sm">MOTIVATIONS DU CANDIDAT </Td>
              <Td textStyle="sm">CHAMPS LIBRE STATUT </Td>
              <Td textStyle="sm">CHAMPS LIBRE COMMENTAIRES </Td>
              <Td textStyle="sm">ACTIONS </Td>
            </Tr>
          </Thead>
          <Tbody>
            {props.appointments.map((appointment, index) => (
              <AppointmentItemList key={appointment._id} appointment={appointment} index={index} />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
