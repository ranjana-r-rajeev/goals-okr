import React, { useState, useEffect } from 'react'
import ModalWrapper from './ModalWrapper'
import { Modal } from 'react-bootstrap'
import styles from './okrModal.module.css'
import { AiOutlineClose } from 'react-icons/ai'
import Custom_dropdown from '../CustomInput/custom_dropdown'
import CustomButton from '../CustomButton/customButton'
import Custom_input from '../CustomInput/custom_input'
import { Row, Col } from 'react-bootstrap'
import { getAvailablePeople, addPeople, getPeople } from '@/services/api'
import { useQuery } from 'react-query'

const AddPeople = ({ show, setShow, edit, orgid, cb, item, teamid, options }) => {

     const [name, setName] = useState(edit ? item?.name : '');
     const [nameError, setNameError] = useState('');
     // const [options, setOptions] = useState([]);

     const handleClose = () => setShow(false);

     const { isLoading: addLoading, refetch: addRefetch } = useQuery('addPeople', () => addPeople(teamid, orgid, { userid : name?.map((item)=>item?.value) }), {
          enabled: false,
          cacheTime: 0,
          onSuccess: () => {
               cb();
          }
     })

     // const { data = [], isLoading, refetch } = useQuery('getPeople', () => getPeople(orgid), {
     //      enabled: false,
     //      onSuccess: (data) => {
     //           console.log(data)
     //           const opt = data.map((item, index) => {
     //                return {
     //                     label: `${item?.user?.id} ${item?.user?.firstName} ${item?.user?.lastName}`,
     //                     value: item?.user?.id
     //                }
     //           })
     //           setOptions(opt)
     //      }
     // })

     // const { data = [], isLoading, refetch } = useQuery('getAvailablePeople', () => getAvailablePeople(orgid), {
     //      enabled: false,
     //      onSuccess: (data) => {
     //           console.log(data)
     //           const opt = data.map((item, index) => {
     //                return {
     //                     label: `${item?.user?.id} ${item?.user?.firstName} ${item?.user?.lastName}`,
     //                     value: item?.user?.id
     //                }
     //           })
     //           setOptions(opt)
     //      }
     // })

     // useEffect(() => {
     //      if (orgid) {
     //           refetch()
     //      }
     // }, [orgid])

     return (
          <ModalWrapper size={'lg'} show={show} setShow={setShow} >
               <div className={styles.closeButton} >
                    <AiOutlineClose size={25} role={"button"} onClick={handleClose} />
               </div>
               <div className="px-2 px-md-4 py-4" >
                    <h4 className='mb-4' >{edit ? 'Remove ' : 'Add '}People</h4>

                    <Custom_dropdown
                         title={"Select people"}
                         value={name}
                         setValue={setName}
                         isMulti
                         required
                         placeholder={"Select people"}
                         styleInside={{ borderRadius: '10px !important' }}
                         error={nameError}
                         setError={setNameError}
                         options={options}
                    />

               </div>
               <Modal.Footer className={styles.footer} >
                    <div>
                         <CustomButton className="px-5" text={edit ? "Remove People" : "Add People"} onClick={() => {
                              if(name && name.length > 0){
                                   addRefetch()
                              } else{
                                   setNameError("Select at least one people")
                              }
                         }} loading={addLoading} />
                    </div>
                    <div></div>
               </Modal.Footer>
          </ModalWrapper>
     )
}

export default AddPeople