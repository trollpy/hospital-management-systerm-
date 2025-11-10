'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { useConvexQuery } from '@/hooks/useConvex'
import { api } from '../../../../convex/_generated/api'
import { useState } from 'react'
import { Search, Filter, Plus, Package, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react'

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  
  const { data: inventory, isLoading } = useConvexQuery(api.inventory.list)

  // Mock inventory data
  const mockInventory = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      sku: 'MED-001',
      category: 'medication',
      quantity: 45,
      reorderLevel: 20,
      unit: 'tablets',
      costPrice: 0.05,
      sellingPrice: 0.15,
      expiryDate: '2024-12-31',
      supplier: 'PharmaCorp',
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      sku: 'MED-002',
      category: 'medication',
      quantity: 12,
      reorderLevel: 25,
      unit: 'capsules',
      costPrice: 0.08,
      sellingPrice: 0.25,
      expiryDate: '2024-10-15',
      supplier: 'MediSupply',
    },
    {
      id: '3',
      name: 'Surgical Gloves',
      sku: 'SUP-001',
      category: 'supplies',
      quantity: 8,
      reorderLevel: 10,
      unit: 'pairs',
      costPrice: 0.25,
      sellingPrice: 0.75,
      expiryDate: '2025-06-30',
      supplier: 'MedEquip',
    },
    {
      id: '4',
      name: 'Syringe 5ml',
      sku: 'SUP-002',
      category: 'supplies',
      quantity: 150,
      reorderLevel: 50,
      unit: 'pieces',
      costPrice: 0.12,
      sellingPrice: 0.35,
      expiryDate: '2024-08-20',
      supplier: 'HealthSupplies',
    },
  ]

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return 'out-of-stock'
    if (quantity <= reorderLevel) return 'low'
    return 'adequate'
  }

  const getStockColor = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'danger'
      case 'low': return 'warning'
      case 'adequate': return 'success'
      default: return 'default'
    }
  }

  const getStockText = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'Out of Stock'
      case 'low': return 'Low Stock'
      case 'adequate': return 'In Stock'
      default: return status
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiry <= thirtyDaysFromNow
  }

  const tabs = [
    { id: 'all', label: 'All Items', badge: mockInventory.length },
    { id: 'low-stock', label: 'Low Stock', badge: 8 },
    { id: 'expiring', label: 'Expiring Soon', badge: 3 },
    { id: 'medication', label: 'Medication', badge: 24 },
    { id: 'supplies', label: 'Supplies', badge: 15 },
  ]

  const lowStockItems = mockInventory.filter(item => getStockStatus(item.quantity, item.reorderLevel) === 'low')
  const expiringItems = mockInventory.filter(item => isExpiringSoon(item.expiryDate))

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600">Manage medication and supply inventory</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">31</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search inventory by name, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          defaultTab="all"
        />

        {/* Inventory Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Expiry