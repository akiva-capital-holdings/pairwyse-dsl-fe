/* eslint-disable arrow-body-style */
import { lazy } from 'react'

const ConnectWallet = lazy(() => import('../components/connectWallet'))

const routes = [
    {
        component: ConnectWallet,
        path: '/',
    },
]

export default routes
