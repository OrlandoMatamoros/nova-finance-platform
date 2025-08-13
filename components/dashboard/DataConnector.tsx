'use client'

import React, { useState, useCallback } from 'react'
import { 
  Upload, FileSpreadsheet, Database, CheckCircle, 
  AlertCircle, Loader, Download, Link2, 
  TrendingUp, FileText, X, Eye
} from 'lucide-react'

interface DataFile {
  id: string
  name: string
  type: 'csv' | 'excel' | 'json'
  size: number
  uploadDate: Date
  status: 'processing' | 'ready' | 'error'
  rows?: number
  columns?: string[]
  preview?: any[]
  mapping?: DataMapping
}

interface DataMapping {
  date: string
  sales: string
  costs: string
  customers?: string
  items?: string
}

interface POSConnection {
  type: 'square' | 'clover' | 'toast' | 'shopify' | 'quickbooks'
  status: 'connected' | 'disconnected' | 'syncing'
  lastSync?: Date
  recordsImported?: number
}

interface DataConnectorProps {
  onDataImport?: (data: any) => void
}

const DataConnector: React.FC<DataConnectorProps> = ({ onDataImport }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'connect' | 'history'>('upload')
  const [uploadedFiles, setUploadedFiles] = useState<DataFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [currentFile, setCurrentFile] = useState<DataFile | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mapping, setMapping] = useState<DataMapping>({
    date: '',
    sales: '',
    costs: '',
    customers: '',
    items: ''
  })

  const [posConnections] = useState<POSConnection[]>([
    { type: 'square', status: 'disconnected' },
    { type: 'clover', status: 'disconnected' },
    { type: 'toast', status: 'disconnected' },
    { type: 'shopify', status: 'disconnected' },
    { type: 'quickbooks', status: 'disconnected' }
  ])

  // Manejo de Drag & Drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.type === 'text/csv' || 
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.name.endsWith('.csv') || 
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls')) {
        
        await processFile(file)
      } else {
        alert(`Archivo no soportado: ${file.name}`)
      }
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    
    const fileId = Date.now().toString()
    const newFile: DataFile = {
      id: fileId,
      name: file.name,
      type: file.name.endsWith('.csv') ? 'csv' : 'excel',
      size: file.size,
      uploadDate: new Date(),
      status: 'processing'
    }
    
    setUploadedFiles(prev => [...prev, newFile])
    
    // Simular procesamiento del archivo
    setTimeout(() => {
      // Simular datos parseados
      const mockData = generateMockData()
      
      const processedFile: DataFile = {
        ...newFile,
        status: 'ready',
        rows: mockData.length,
        columns: Object.keys(mockData[0]),
        preview: mockData.slice(0, 5)
      }
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? processedFile : f)
      )
      setCurrentFile(processedFile)
      setIsProcessing(false)
      
      // Auto-detectar columnas
      autoDetectColumns(processedFile.columns || [])
    }, 2000)
  }

  const generateMockData = () => {
    const data = []
    const startDate = new Date('2024-01-01')
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      data.push({
        fecha: date.toISOString().split('T')[0],
        ventas_totales: 3000 + Math.random() * 2000,
        costos_alimentos: 900 + Math.random() * 400,
        costos_personal: 800 + Math.random() * 300,
        clientes_atendidos: Math.floor(50 + Math.random() * 50),
        ticket_promedio: 35 + Math.random() * 15,
        productos_vendidos: Math.floor(100 + Math.random() * 100)
      })
    }
    
    return data
  }

  const autoDetectColumns = (columns: string[]) => {
    const newMapping: DataMapping = {
      date: '',
      sales: '',
      costs: '',
      customers: '',
      items: ''
    }
    
    columns.forEach(col => {
      const colLower = col.toLowerCase()
      if (colLower.includes('fecha') || colLower.includes('date')) {
        newMapping.date = col
      } else if (colLower.includes('venta') || colLower.includes('sale') || colLower.includes('revenue')) {
        newMapping.sales = col
      } else if (colLower.includes('costo') || colLower.includes('cost')) {
        newMapping.costs = col
      } else if (colLower.includes('cliente') || colLower.includes('customer')) {
        newMapping.customers = col
      } else if (colLower.includes('producto') || colLower.includes('item')) {
        newMapping.items = col
      }
    })
    
    setMapping(newMapping)
  }

  const handleImport = () => {
    if (currentFile && currentFile.preview) {
      // Transformar datos según el mapeo
      const transformedData = currentFile.preview.map(row => ({
        date: row[mapping.date],
        sales: parseFloat(row[mapping.sales]) || 0,
        costs: parseFloat(row[mapping.costs]) || 0,
        customers: parseInt(row[mapping.customers || '']) || 0,
        items: parseInt(row[mapping.items || '']) || 0
      }))
      
      onDataImport?.(transformedData)
      
      // Mostrar confirmación
      alert('Datos importados exitosamente')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getPOSLogo = (type: string) => {
    const logos: Record<string, string> = {
      square: '⬜',
      clover: '🍀',
      toast: '🍞',
      shopify: '��️',
      quickbooks: '📘'
    }
    return logos[type] || '📱'
  }

  return (
    <div className="space-y-6">
      {/* Header con Tabs */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl 
                      rounded-2xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Conector de Datos</h3>
                <p className="text-white/60 text-sm">Importa y sincroniza tus datos</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Cargar Archivo
            </button>
            <button
              onClick={() => setActiveTab('connect')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'connect'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Link2 className="w-4 h-4 inline mr-2" />
              Conectar POS
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Historial
            </button>
          </div>
        </div>

        {/* Tab: Upload */}
        {activeTab === 'upload' && (
          <div className="p-6">
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
            >
              <FileSpreadsheet className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/80 font-medium mb-2">
                Arrastra tus archivos aquí
              </p>
              <p className="text-white/60 text-sm mb-4">
                Soportamos CSV, Excel (.xlsx, .xls)
              </p>
              <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                             rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer 
                             inline-block">
                <input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                Seleccionar Archivos
              </label>
            </div>

            {/* Archivo Actual */}
            {currentFile && (
              <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{currentFile.name}</p>
                      <p className="text-white/60 text-sm">
                        {currentFile.rows} filas • {currentFile.columns?.length} columnas • 
                        {' '}{formatFileSize(currentFile.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-white/80" />
                    </button>
                    <button
                      onClick={() => setCurrentFile(null)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                </div>

                {/* Mapeo de Columnas */}
                <div className="mb-4">
                  <h4 className="text-white/80 text-sm font-medium mb-3">
                    Mapeo de Columnas
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(mapping).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-white/60 text-xs block mb-1 capitalize">
                          {key.replace('_', ' ')}
                        </label>
                        <select
                          value={value}
                          onChange={(e) => setMapping(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                   text-white text-sm focus:bg-white/20 focus:border-white/40"
                        >
                          <option value="">Seleccionar...</option>
                          {currentFile.columns?.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview de Datos */}
                {showPreview && currentFile.preview && (
                  <div className="mb-4">
                    <h4 className="text-white/80 text-sm font-medium mb-3">
                      Vista Previa
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            {currentFile.columns?.map(col => (
                              <th key={col} className="text-left text-white/60 p-2">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentFile.preview.slice(0, 5).map((row, i) => (
                            <tr key={i} className="border-b border-white/5">
                              {currentFile.columns?.map(col => (
                                <td key={col} className="text-white/80 p-2">
                                  {typeof row[col] === 'number' 
                                    ? row[col].toFixed(2) 
                                    : row[col]
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Botón Importar */}
                <button
                  onClick={handleImport}
                  disabled={!mapping.date || !mapping.sales}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white 
                           rounded-xl font-medium hover:shadow-lg transition-all 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importar Datos
                </button>
              </div>
            )}

            {/* Procesando */}
            {isProcessing && (
              <div className="mt-6 bg-white/5 rounded-xl p-8 text-center">
                <Loader className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                <p className="text-white/80 font-medium">Procesando archivo...</p>
                <p className="text-white/60 text-sm mt-1">Esto puede tomar unos segundos</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Connect POS */}
        {activeTab === 'connect' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posConnections.map(connection => (
                <div
                  key={connection.type}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getPOSLogo(connection.type)}</span>
                      <div>
                        <h4 className="text-white font-medium capitalize">
                          {connection.type}
                        </h4>
                        <p className={`text-xs ${
                          connection.status === 'connected' 
                            ? 'text-green-400' 
                            : 'text-white/60'
                        }`}>
                          {connection.status === 'connected' ? 'Conectado' : 'Desconectado'}
                        </p>
                      </div>
                    </div>
                    {connection.status === 'connected' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>

                  {connection.status === 'connected' ? (
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs">
                        Última sincronización: {connection.lastSync?.toLocaleString()}
                      </p>
                      <p className="text-white/60 text-xs">
                        Registros: {connection.recordsImported?.toLocaleString()}
                      </p>
                      <button className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 
                                       text-red-400 rounded-lg text-sm font-medium transition-all">
                        Desconectar
                      </button>
                    </div>
                  ) : (
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 
                                     text-white rounded-lg text-sm font-medium transition-all">
                      Conectar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    Sincronización Automática
                  </p>
                  <p className="text-white/60 text-xs">
                    Una vez conectado, tus datos se sincronizarán automáticamente cada hora. 
                    También puedes forzar una sincronización manual en cualquier momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: History */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="space-y-3">
              {uploadedFiles.map(file => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl 
                           hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-white/60 text-xs">
                        {file.uploadDate.toLocaleString()} • {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'ready' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {file.status === 'processing' && (
                      <Loader className="w-5 h-5 text-yellow-400 animate-spin" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                </div>
              ))}
              
              {uploadedFiles.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No hay archivos en el historial</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataConnector
