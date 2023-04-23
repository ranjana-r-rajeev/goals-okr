import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import DashboardLayout from '@/layout/DashboardLayout'
import CustomButton from '@/components/CustomButton/customButton'
import useBoundStore from '@/store';
import styled from '@emotion/styled'
import CreateTeam from '@/components/Modals/CreateTeam'
import NotFound from '@/components/NotFound/NotFound'
import { useQuery } from 'react-query'
import { getTeams } from '@/services/api'
import Loader from '@/components/Loader/Loader'
import TeamCard from '@/components/TeamCard/TeamCard'

const Team = () => {

      const router = useRouter();
      const activeOrganization = useBoundStore((state) => state.activeOrganization)
      const [show, setShow] = useState(false);
      const [actOrg, setActOrg] = useState(false);

      const { data = [], isLoading, refetch } = useQuery('getTeams', () => getTeams(actOrg?.organization?.id), {
            enabled: false,
            onSuccess: () => {
                  setShow(false)
            }
      })

      useEffect(() => {
            if (activeOrganization && Object.keys(activeOrganization).length > 0) {
                  setActOrg(activeOrganization)
            }
      }, [activeOrganization])

      useEffect(() => {
            if (actOrg && Object.keys(actOrg).length > 0) {
                  refetch();
            }
      }, [actOrg])

      return (
            <>
                  <Head>
                        <title>Create Next App</title>
                        <meta name="description" content="Generated by create next app" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/favicon.ico" />
                  </Head>
                  <main>
                        <DashboardLayout screen={"teams"}>
                              {
                                    isLoading &&
                                    <Loader />
                              }
                              <CreateTeam show={show} setShow={(v) => setShow(v)} screen={"teams"} orgid={actOrg?.organization?.id} cb={() => refetch()} />
                              {!actOrg && Object?.keys(actOrg)?.length === 0 && <NotFound
                                    title={"No Active Organization Found"}
                                    desc={"You are not part of any organazation to access this featue. Ask your manager to invite you or create your own organization."}
                                    btnText={"Create Organization"}
                                    onClick={() => router.push('/organization')}
                              /> ||
                                    <>
                                          {
                                                actOrg?.role != "Employee" &&
                                                <div className={'d-flex align-items-center justify-content-between'} >
                                                      <div className={'d-flex link align-items-center'} >
                                                            <CustomButton text={"Create Team"} className={'px-4'} nofilled onClick={() => setShow(true)} />
                                                      </div>
                                                      <div>
                                                            <p>sort By</p>
                                                      </div>
                                                </div>
                                          }

                                          {
                                                !isLoading && data.length == 0 && (actOrg?.role != "Employee" &&
                                                <div style={{ position: "relative", minHeight: '65vh' }} >
                                                      <NotFound
                                                            title={"No Teams found"}
                                                            desc={"Click the button below to add your first objective"}
                                                            btnText={"Create Team"}
                                                            onClick={() => setShow(true)}
                                                      />
                                                </div> ||
                                                      <div style={{ position: "relative", minHeight: '65vh' }} >
                                                            <NotFound
                                                                  title={"No Teams found"}
                                                                  desc={"Ask your manager to create team"}
                                                            />
                                                      </div>
                                                ) ||
                                                <Row className="mt-3" >
                                                      {
                                                            data.map((item, index) =>
                                                                  <Col xxxl={2} xl={3} lg={4} md={4} sm={6} xs={12} className="my-3" >
                                                                        <TeamCard item={item} index={index} role={actOrg?.role} orgid={actOrg?.organization?.id} cb={() => refetch()} />
                                                                  </Col>)
                                                      }
                                                </Row>
                                          }
                                    </>

                              }

                        </DashboardLayout>
                  </main>
            </>
      )
}

export default Team
