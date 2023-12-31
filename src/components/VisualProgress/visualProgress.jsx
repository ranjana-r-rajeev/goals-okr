import React from 'react'
import styles from './visualProgress.module.css'
import { Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
          labels: ['Completed', 'In Progress', 'Overdue'],
          options: {
                    legend: {
                              display: false
                    },
          },
          datasets: [
                    {
                              label: 'Progress',
                              data: [40, 40, 20],
                              backgroundColor: [
                                        '#227820',
                                        '#ffa600',
                                        '#da2020',
                              ],
                              // borderColor: [
                              //           'rgba(255, 99, 132, 1)',
                              //           'rgba(54, 162, 235, 1)',
                              //           'rgba(255, 206, 86, 1)',
                              // ],
                              borderWidth: 1,
                    },
          ],
};

const VisualCard = ({data,title}) => {
          return(
                    <div className={styles.visualCard + ' my-3'} >
                              <p className="text-center mb-2" >{title}</p>
                              <Doughnut
                                        data={data}
                              />
                    </div>
          )
}

const VisualProgress = ({progressData}) => {
          const orgdata = {
                    ...data,
                    datasets : [
                              {
                                        ...data.datasets[0],
                                        data : [progressData?.totalsum || 0, progressData?.totalPending || 0, progressData?.totalDue || 0]
                              },
                    ]
          }
          const teamdata = {
                    ...data,
                    datasets : [
                              {
                                        ...data.datasets[0],
                                        data : [progressData?.t_totalsum || 0, progressData?.t_totalPending || 0, progressData?.t_totalDue || 0]
                              },
                    ]
          }
          const individualdata = {
                    ...data,
                    datasets : [
                              {
                                        ...data.datasets[0],
                                        data : [progressData?.u_totalsum || 0, progressData?.u_totalPending || 0, progressData?.u_totalDue || 0]
                              },
                    ]
          }
          return (
                    <div className="mt-4">
                              <p className={styles.heading}>Visual Progress</p>
                              <Row >
                                        <Col lg={4} xs={6} >
                                                  <VisualCard  data={orgdata} title={'Org Progress'} />
                                        </Col>
                                        <Col lg={4} xs={6} >
                                                  <VisualCard data={teamdata} title={'Team Progress'} />
                                        </Col>
                                        <Col lg={4} xs={6} >
                                                  <VisualCard data={individualdata} title={'Individual Progress'} />
                                        </Col>
                              </Row>
                    </div>
          )
}

export default VisualProgress