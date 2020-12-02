import React from "react";
import { Page, Grid, StatsCard, Header, Table, Button } from "tabler-react";
import "./DashboardPage.css";
import { useFetch } from "../../common/hooks/useFetch";

export default () => {
  const [data, loading] = useFetch("api/entity/requests");
  console.log(data);

  return (
    <>
        {loading && "Chargement des données..."}
        {data && (
        <>
            <Header.H5>Liste des demandes</Header.H5>

                <Table>
                    <Table.Header>
                        <Table.ColHeader>candidat_id</Table.ColHeader>
                        <Table.ColHeader>cfa_pris_contact_candidat</Table.ColHeader>
                        <Table.ColHeader>cfa_pris_contact_candidat_date</Table.ColHeader>
                        <Table.ColHeader>created_at</Table.ColHeader>
                        <Table.ColHeader>date_de_reponse_cfa</Table.ColHeader>
                        <Table.ColHeader>email_premiere_demande_candidat_ouvert</Table.ColHeader>
                        <Table.ColHeader>email_premiere_demande_candidat_recu</Table.ColHeader>
                        <Table.ColHeader>email_premiere_demande_cfa_ouvert</Table.ColHeader>
                        <Table.ColHeader>email_premiere_demande_cfa_recu</Table.ColHeader>
                        <Table.ColHeader>etablissement_id</Table.ColHeader>
                        <Table.ColHeader>formation_id</Table.ColHeader>
                        <Table.ColHeader>last_update_at</Table.ColHeader>
                        <Table.ColHeader>motivations</Table.ColHeader>
                        <Table.ColHeader>numero_de_la_demande</Table.ColHeader>
                        <Table.ColHeader>referrer</Table.ColHeader>
                        <Table.ColHeader>statut_general</Table.ColHeader>
                        <Table.ColHeader>actions</Table.ColHeader>
                    </Table.Header>
                    <Table.Body>
                        {data.requests.map((request)=>{
                            return (
                                <Table.Row>
                                    <Table.Col>{request.candidat_id}</Table.Col>
                                    <Table.Col>{request.cfa_pris_contact_candidat}</Table.Col>
                                    <Table.Col>{request.cfa_pris_contact_candidat_date}</Table.Col>
                                    <Table.Col>{request.created_at}</Table.Col>
                                    <Table.Col>{request.date_de_reponse_cfa}</Table.Col>
                                    <Table.Col>{request.email_premiere_demande_candidat_ouvert}</Table.Col>
                                    <Table.Col>{request.email_premiere_demande_candidat_recu}</Table.Col>
                                    <Table.Col>{request.email_premiere_demande_cfa_ouvert}</Table.Col>
                                    <Table.Col>{request.email_premiere_demande_cfa_recu}</Table.Col>
                                    <Table.Col>{request.etablissement_id}</Table.Col>
                                    <Table.Col>{request.formation_id}</Table.Col>
                                    <Table.Col>{request.last_update_at}</Table.Col>
                                    <Table.Col>{request.motivations}</Table.Col>
                                    <Table.Col>{request.numero_de_la_demande}</Table.Col>
                                    <Table.Col>{request.referrer}</Table.Col>
                                    <Table.Col>{request.statut_general}</Table.Col>
                                    <Table.Col>
                                        <Button color="primary">Edit</Button>
                                    </Table.Col>
                                </Table.Row>
                            );
                        })}
                        
                    </Table.Body>
                </Table>

        </>
        )}
    </>
  );
};