import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import DashboardLayout from '@/layout/DashboardLayout'
import { useQuery } from 'react-query'
import { getTeamByTeamId, getAllMyTeamObjectives } from '@/services/api'
import { useRouter } from 'next/router';
import Loader from '@/components/Loader/Loader'
import styled from '@emotion/styled'
import useBoundStore from '@/store';
import CreateObjective from '@/components/Modals/CeateObjective'
import CustomButton from '@/components/CustomButton/customButton'
import ObjectiveList from '@/components/ObjectiveList/objectiveList'
import NotFound from '@/components/NotFound/NotFound'

const TeamObjectives = () => {

          const router = useRouter();
          const { id } = router.query;
          const activeOrganization = useBoundStore((state) => state.activeOrganization)
          const [actOrg, setActOrg] = useState(false);
          const [show, setShow] = useState(false);

          const { isLoading, data, refetch } = useQuery('team' + id, () => getTeamByTeamId(id), {
                    onSuccess: () => {
                              setShow(false)
                    }
          })

          const { data: obj = [], isLoading: objLoading, refetch: getObjectives } = useQuery('getTeamObjectives', () => getAllMyTeamObjectives(id), {
                    enabled: false,
                    onSuccess: () => {
                              setShow(false);
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
                              getObjectives();
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
                                        <DashboardLayout screen={"objectives"} breadcrumb={data?.name}>
                                                  {
                                                            actOrg.role != "Employee" &&
                                                            <div className={'d-flex align-items-center justify-content-between'} >
                                                                      <CreateObjective show={show} setShow={(v) => setShow(v)} cb={() => getObjectives()} teamid={id} />
                                                                      <div className={'d-flex link align-items-center'} >
                                                                                <CustomButton text={"Add Objective"} className={'px-4'} nofilled onClick={() => setShow(true)} />
                                                                      </div>
                                                                      <div>
                                                                                <p>sort By</p>
                                                                      </div>
                                                            </div>
                                                  }
                                                  {
                                                            obj.length > 0 && actOrg.role == "Employee" &&
                                                            <div className={'d-flex align-items-center justify-content-between'} >
                                                                      <div className={'d-flex link align-items-center'} >
                                                                                <p className="heading" >Objectives</p>
                                                                      </div>
                                                                      <div>
                                                                                <p>sort By</p>
                                                                      </div>
                                                            </div>

                                                  }
                                                  {
                                                            obj.length == 0 && (actOrg.role != "Employee" &&
                                                                      <div style={{ minHeight: '65vh', position: 'relative' }} >
                                                                                <NotFound
                                                                                          title={"No Objective found"}
                                                                                          desc={"You can start creating an objective for your team"}
                                                                                          btnText={"Add Objective"}
                                                                                          onClick={() => setShow(true)}
                                                                                />
                                                                      </div> ||
                                                                      <div style={{ minHeight: '70vh', position: 'relative' }} >
                                                                                <NotFound
                                                                                          title={"No Objective found"}
                                                                                          desc={"No objectives found in this team"}
                                                                                />
                                                                      </div>
                                                            ) ||
                                                            <ObjectiveList actOrg={actOrg} screen={"objectives"} data={obj || []} cb={() => refetch()} id={id} />
                                                  }
                                        </DashboardLayout>
                              </main>
                    </>
          )
}

export default TeamObjectives