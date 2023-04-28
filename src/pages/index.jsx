import Head from 'next/head'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import ObjectiveCard from '@/components/ObjectiveCard/objectiveCard'
import { Row, Col } from 'react-bootstrap'
import styles from '@/styles/home.module.css'
import OverallProgress from '@/components/OverallProgress/overallProgress'
import DetailedProgress from '@/components/DetailedProgress/detailedProgress'
import Teams from '@/components/Teams/Teams'
import VisualProgress from '@/components/VisualProgress/visualProgress'
import Cookies from 'js-cookie'
import { useQuery } from 'react-query'
import { getStats } from '@/services/api'
import useBoundStore from '@/store';
import NotFound from '@/components/NotFound/NotFound'
import { useRouter } from 'next/router'

export default function Home() {

	const userData = Cookies.get('accessToken');
	console.log(userData);
	const router = useRouter();

	const activeOrganization = useBoundStore((state) => state.activeOrganization)
	const [actOrg, setActOrg] = useState(false);

	useEffect(() => {
		if (activeOrganization && Object.keys(activeOrganization).length > 0) {
			setActOrg(activeOrganization)
		}
	}, [activeOrganization])


	const { data, isLoading, refetch } = useQuery('getStats', () => getStats(actOrg?.organization?.id), {
		enabled: false,
		onSuccess: (data) => {
			console.log(data)
		}
	})

	useEffect(() => {
		if (actOrg && Object.keys(actOrg).length > 0) {
			refetch()
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
				<DashboardLayout screen={"home"}>
					{!actOrg && Object?.keys(actOrg)?.length === 0 && <NotFound
						title={"No Active Organization Found"}
						desc={"You are not part of any organazation to access this featue. Ask your manager to invite you or create your own organization."}
						btnText={"Create Organization"}
						onClick={() => router.push('/organization')}
					/> ||
						<>
							<OverallProgress progressData={data} />
							<Row>
								<Col lg={8} xs={12} >
									<VisualProgress progressData={data} />
								</Col>
								<Col lg={4} xs={12} >
									<Teams />
								</Col>
							</Row>
							<DetailedProgress />
						</>
					}

				</DashboardLayout>
			</main>
		</>
	)
}
