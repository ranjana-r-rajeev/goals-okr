import React, { useState, useEffect } from 'react'
import styles from './Peoplestable.module.css';
import clsx from 'clsx';
import IconButton from '../IconButton/IconButton';
import { MdModeEditOutline } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import CustomButton from '../CustomButton/customButton';
import moment from 'moment';
import styled from '@emotion/styled';
import InvitePeopleModal from '../Modals/InvitePeopleModal';
import { changeRole, deleteUser } from '@/services/api';
import { useQuery } from 'react-query';
import ConfirmModal from '../Modals/ConfirmModal';

const SingleTr = ({ item, index, orgid, cb, roles }) => {

          const [role, setRole] = useState('');
          const [confirm, setConfirm] = useState(false);
          const [deleteConfirm, setDeleteConfirm] = useState(false);

          const { data: roleData, isLoading: roleLoading, refetch: roleRefetch } = useQuery('changeRole', () => changeRole(item?.user?.id, { role, orgid }), {
                    enabled: false,
                    cacheTime: 0,
                    onSuccess: () => {
                              cb()
                              setConfirm(false)
                    }
          })

          const { data: deleteData, isLoading: deleteLoading, refetch: deleteRefetch } = useQuery('deleteUser', () => deleteUser( orgid, item?.user?.id), {
                    enabled: false,
                    cacheTime: 0,
                    onSuccess: () => {
                              cb()
                              setDeleteConfirm(false)
                    }
          })

          useEffect(() => {
                    if (role != '') {
                              setConfirm(true)
                    }
          }, [role])


          return (
                    <tr className={styles.tbodyTrWrapper}>
                              <ConfirmModal 
                                        show={confirm}
                                        setShow={setConfirm}
                                        onContinue={()=>roleRefetch()}
                                        onClose={()=>setRole('')}
                              />
                              <ConfirmModal 
                                        show={deleteConfirm}
                                        setShow={setDeleteConfirm}
                                        onContinue={()=>deleteRefetch()}
                              />
                              <td>{item?.user?.firstName} {item?.user?.lastName}</td>
                              <td>{moment(item?.createdAt).format('DD/MM/YYYY')}</td>
                              <td>{item?.user?.email}</td>
                              <td>{item?.role}
                                        {
                                                  item?.role != "Owner" && roles == "Owner" &&
                                                  <>
                                                            <ContextMenuTrigger id={"role" + index} mouseButton={0}>
                                                                      {/* id should be unique */}
                                                                      <IconButton Icon={MdModeEditOutline} onClick={() => { }} />
                                                                      {/* <BsThreeDotsVertical size={20} role="button" className='ms-3 ms-md-1 me-1 me-md-5' /> */}
                                                            </ContextMenuTrigger>
                                                            <ContextMenu id={"role" + index} rtl={true} >
                                                                      <MenuItem data={{ foo: 'Manager' }} onClick={() => setRole("Manager")}>
                                                                                Manager
                                                                      </MenuItem>
                                                                      <MenuItem data={{ foo: 'Employee' }} onClick={() => setRole("Employee")}>
                                                                                Employee
                                                                      </MenuItem>
                                                            </ContextMenu>
                                                  </>

                                        }
                              </td>
                              {item?.role != "Owner" && roles == "Owner" &&
                                        <td><IconButton Icon={MdDelete} onClick={() => setDeleteConfirm(true)} className={"redBtn"} /></td>
                              }
                              {item?.role == "Owner" && roles == "Owner" && <td> - </td> }
                    </tr>
          )
}

const PeoplesTable = ({ peoples, cb, invitedPeople, role, orgid }) => {
          const [show, setShow] = useState(false);

          return (
                    <PeopleWrapper className="mt-2" >
                              <InvitePeopleModal show={show} setShow={setShow} cb={cb} />
                              <div className="d-flex top-heading justify-content-between align-items-center">
                                        <p className={styles.heading}>People in organization</p>
                                        {
                                                  role == "Owner" &&
                                                  <CustomButton className={"cb px-5"} text={"Invite People"} nofilled onClick={() => setShow(true)} />
                                        }
                              </div>
                              <div style={{ overflow: 'auto' }} >
                                        <table className={clsx(styles.tableWrapper, 'mt-3')} >
                                                  <thead className={styles.theadWrapper}  >
                                                            <tr className={styles.theadTrWrapper}>
                                                                      <th>Name</th>
                                                                      <th>Date of join</th>
                                                                      <th>Email</th>
                                                                      <th>Role</th>
                                                                      {
                                                                                role == "Owner" &&
                                                                                <th>Actions</th>
                                                                      }
                                                            </tr>
                                                  </thead>
                                                  <tbody className={styles.tbodyWrapper}>
                                                            {
                                                                      peoples.map((item, index) => (
                                                                                <SingleTr item={item} index={index} orgid={orgid} cb={cb} roles={role} />
                                                                      ))
                                                            }
                                                  </tbody>
                                        </table>
                              </div>

                              {
                                        role == "Owner" && invitedPeople && invitedPeople?.length > 0 &&
                                        <>
                                                  <div className="d-flex top-heading justify-content-between mt-5">
                                                            <p className={styles.heading}>Invited people</p>
                                                  </div>
                                                  <div style={{ overflow: 'auto' }} >
                                                            <table className={clsx(styles.tableWrapper, 'mt-3')} >
                                                                      <thead className={styles.theadWrapper}  >
                                                                                <tr className={styles.theadTrWrapper}>
                                                                                          <th style={{ width: '40%' }} >Email</th>
                                                                                          <th>Status</th>
                                                                                          <th>Date of invitation</th>
                                                                                </tr>
                                                                      </thead>
                                                                      <tbody className={styles.tbodyWrapper}>
                                                                                {
                                                                                          invitedPeople.map((item, index) => (
                                                                                                    <tr className={styles.tbodyTrWrapper}>
                                                                                                              <td>{item?.email}</td>
                                                                                                              <td>{item?.status}</td>
                                                                                                              <td>{moment(item?.createdAt).format('DD/MM/YYYY')}</td>
                                                                                                    </tr>
                                                                                          ))
                                                                                }
                                                                      </tbody>
                                                            </table>
                                                  </div>
                                        </>
                              }

                    </PeopleWrapper>
          )
}

export default PeoplesTable

const PeopleWrapper = styled.div`
          .cb{
                    width : max-content;
          }
`