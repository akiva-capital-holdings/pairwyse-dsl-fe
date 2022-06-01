/* eslint-disable arrow-body-style */
import { lazy } from 'react'

const Transaction = lazy(() => import('../components/transaction'))
const Home = lazy(() => import('../components/home'))

const privateRoutes = [
    {
        component: Transaction,
        path: '/',
    },
    {
        component: Home,
        path: '/create-agreement',
    },
]

export default privateRoutes
