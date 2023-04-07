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

const Objectives = () => {
      const [show, setShow] = useState(false);
      const activeOrganization = useBoundStore((state) => state.activeOrganization)
      const [actOrg, setActOrg] = useState(false);

      useEffect(() => {
            if(activeOrganization && Object.keys(activeOrganization).length > 0){
                  setActOrg(activeOrganization)
            }
      }, [activeOrganization])

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
                                                <CreateObjective show={show} setShow={(v) => setShow(v)} />
                                                <div className={'d-flex link align-items-center'} >
                                                      {/* <MdAddTask /> */}
                                                      <CustomButton text={"Add Objective"} className={'px-4'} nofilled onClick={() => setShow(true)} />
                                                      {/* <p ></p> */}
                                                </div>
                                                <div>
                                                      <p>sort By</p>
                                                </div>
                                          </div>
                                          <ObjectiveList />
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
