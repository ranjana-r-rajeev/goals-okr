import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import DashboardLayout from '@/layout/DashboardLayout'
import styles from '@/styles/Objectives.module.css'
import { Row, Col } from 'react-bootstrap'
import CustomButton from '@/components/CustomButton/customButton'
import { MdAddTask } from 'react-icons/md'
import ObjectiveList from '@/components/ObjectiveList/objectiveList'
import CreateObjective from '@/components/Modals/CeateObjective'
import NotFound from '@/components/NotFound/NotFound'
import useBoundStore from '@/store';
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getTeams } from '@/services/api'
import TeamCard from '@/components/TeamCard/TeamCard'

const Objectives = () => {
      const activeOrganization = useBoundStore((state) => state.activeOrganization)
      const [actOrg, setActOrg] = useState(false);

      const { data = [], isLoading: objLoading, refetch } = useQuery('getTeams', () => getTeams(actOrg?.organization?.id), {
            enabled: false,
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

      const router = useRouter();
      return (
            <>
                  <Head>
                        <title>Create Next App</title>
                        <meta name="description" content="Generated by create next app" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/favicon.ico" />
                  </Head>
                  <main>
                        <DashboardLayout screen={"objectives"}>
                              {
                                    actOrg && Object.keys(actOrg).length > 0 &&
                                    <>
                                          <div className={'d-flex align-items-center justify-content-between'} >
                                                <p className='heading' >Select Team</p>
                                          </div>
                                          <Row className="mt-2" >
                                                {
                                                      data.map((item, index) =>
                                                            <Col xxxl={2} xl={3} lg={4} md={4} sm={6} xs={12} className="my-3" >
                                                                  <TeamCard item={item} index={index} role={actOrg?.role} orgid={actOrg?.organization?.id} cb={() => refetch()} screen="objectives" />
                                                            </Col>)
                                                }
                                                {
                                                      data?.length == 0 && (actOrg.role != "Employee" &&
                                                            <NotFound
                                                                  title={"No Teams Found"}
                                                                  desc={"To start creating objectives you should create a team first"}
                                                                  btnText={"Create Team"}
                                                                  onClick={() => router.push('/teams')}
                                                            /> ||
                                                            <NotFound
                                                                  title={"No Teams Found"}
                                                                  desc={"Ask your manager to create a team to start working on objectives"}
                                                            />
                                                      )
                                                }
                                          </Row>
                                    </> ||
                                    <NotFound
                                          title={"No Active Organization Found"}
                                          desc={"You are not part of any organazation to access this featue. Ask your manager to invite you or create your own organization."}
                                          btnText={"Create Organization"}
                                          onClick={() => router.push('/organization')}
                                    />
                              }

                        </DashboardLayout>
                  </main>
            </>
      )
}

export default Objectives
