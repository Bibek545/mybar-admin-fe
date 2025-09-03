import React from 'react'
import LoginPage from '../pages/LoginPage.jsx'
import { Routes, Route } from 'react-router-dom'
import  ProtectedRoute  from '../components/ProtectedRoute.jsx'
import DefaultLayout from '../layout/DefaultLayout.jsx'
import DashbaordPage from '../pages/DashboardPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import BookingsPage from '../pages/BookingsPage.jsx'
import { MenuPage } from '../pages/MenuMangagementPage.jsx'
import EventsPage from '../pages/EventManagementPage.jsx'
import UsersPage from '../pages/UserManagementPage.jsx'
import AdminUserPage from '../pages/adminUserPage.jsx'
// import MenuPage from '../pages/MenuMangagementPage.jsx'

const AppRoutes = () => {
  return (
   <Routes>
    <Route path='/login' element={<LoginPage/>}></Route>
    <Route path='/' element={
        <ProtectedRoute>
            <DefaultLayout>
                <DashboardPage />
            </DefaultLayout>
        </ProtectedRoute>
    }
    />
    <Route path='/booking' element={
        <ProtectedRoute>
            <DefaultLayout>
                <BookingsPage/>
            </DefaultLayout>
        </ProtectedRoute>
    }
    />
    <Route path='/menu' element={
        <ProtectedRoute>
            <DefaultLayout>
                <MenuPage/>
            </DefaultLayout>
        </ProtectedRoute>
    }
    />
    <Route path='/events' element={
        <ProtectedRoute>
            <DefaultLayout>
                <EventsPage/>
            </DefaultLayout>
        </ProtectedRoute>
    }
    />
        <Route path='/users' element={
        <ProtectedRoute>
            <DefaultLayout>
                <UsersPage/>
            </DefaultLayout>
        </ProtectedRoute>
    }
    />

    <Route path='/profile' element = {
        <ProtectedRoute>
            <DefaultLayout>
                <AdminUserPage />
            </DefaultLayout>
        </ProtectedRoute>
    }
    />
   </Routes>
  )
}

export default AppRoutes