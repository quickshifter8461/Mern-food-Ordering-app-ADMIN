import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../components/Auth/AuthRoutes'
import Navbar from '../components/Navbar/Navbar'
import Home from '../components/Home/Home'
import LoginCard from '../components/Auth/Login'
import UserProfile from '../components/Auth/AdminProfile'
import Edit from '../components/Profile/EditRoute'
import RestaurantPage from '../components/Dashboard/Restaurants'
import EditRestaurantForm from '../components/Dashboard/EditRestaurantForm'
import MenuPage from '../components/Dashboard/Menus'
import EditMenuItemForm from '../components/Dashboard/EditMenuItemForm'
import Orders from '../components/Dashboard/Orders'
import CouponPage from '../components/Dashboard/Coupons'


const AdminRoutes = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
            <Route path='/' element={<LoginCard/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/my-profile' element={<UserProfile/>}/>
            <Route path="/edit/profile" element={<Edit/>}/>
            <Route path='/restaurants' element={<RestaurantPage/>}/>
            <Route path='/edit/restaurants' element={<EditRestaurantForm/>}/>
            <Route path='/menus' element={<MenuPage/>}/>
            <Route path='/edit/menus' element={<EditMenuItemForm/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/coupons' element={<CouponPage/>}/>
        </Routes>
        <Auth/>
    </div>
  )
}

export default AdminRoutes