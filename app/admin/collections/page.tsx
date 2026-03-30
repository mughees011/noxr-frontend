'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      
      const [collectionsData, productsData] = await Promise.all([
        adminApi.get('/api/collections/admin/all'),
        adminApi.get('/api/products')
      ])
      
      setCollections(Array.isArray(collectionsData) ? collectionsData : [])
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection? This cannot be undone.')) return

    await adminApi.delete(`/api/collections/${id}`)

    fetchData()
  }

  const toggleLive = async (collection: any) => {
    await adminApi.put(`/api/collections/${collection._id}`, { ...collection, isLive: !collection.isLive })

    fetchData()
  }

  const toggleFeatured = async (collection: any) => {
    await adminApi.put(`/api/collections/${collection._id}`, { ...collection, isFeatured: !collection.isFeatured })

    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <div style={{ flex: 1, padding: '48px 52px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p className="overline mb-3">Drops</p>
            <h1 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Collections
            </h1>
            <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>
              {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'}
            </p>
          </div>

          <button onClick={() => { setEditingCollection(null); setShowModal(true) }} className="btn-primary">
            <span>+ Create Collection</span>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection._id}
              collection={collection}
              onEdit={() => { setEditingCollection(collection); setShowModal(true) }}
              onDelete={() => handleDelete(collection._id)}
              onToggleLive={() => toggleLive(collection)}
              onToggleFeatured={() => toggleFeatured(collection)}
            />
          ))}
        </div>

        {collections.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.3)' }}>
              No collections yet. Create your first drop.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CollectionModal
          collection={editingCollection}
          products={products}
          onClose={() => { setShowModal(false); setEditingCollection(null) }}
          onSave={async (data: any) => {
  try {
    if (editingCollection) {
      await adminApi.put(`/collections/${editingCollection._id}`, data)
    } else {
      await adminApi.post(`/collections`, data)
    }

    setShowModal(false)
    setEditingCollection(null)
    fetchData()
  } catch (err) {
    console.error('Save error:', err)
    alert('Failed to save collection')
  }
}}
        />
      )}
    </div>
  )
}

function CollectionCard({ collection, onEdit, onDelete, onToggleLive, onToggleFeatured }: any) {
  return (
    <div className="border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
      {/* Image */}
      <div className="relative bg-[#EDE7DC]" style={{ aspectRatio: '4/3' }}>
        {collection.heroImage && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${collection.heroImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {collection.isFeatured && (
            <span className="px-2 py-1 overline" style={{ backgroundColor: '#1A1208', color: '#F7F3ED', fontSize: '7px' }}>
              Featured
            </span>
          )}
          {!collection.isLive && (
            <span className="px-2 py-1 overline" style={{ backgroundColor: 'rgba(180,130,50,0.9)', color: '#F7F3ED', fontSize: '7px' }}>
              Hidden
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-light text-[#1A1208] mb-2" style={{ fontSize: '20px' }}>
          {collection.name}
        </h3>
        
        <p className="font-body font-light mb-3" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.45)', lineHeight: 1.6 }}>
          {collection.tagline || collection.shortDescription}
        </p>

        <div className="space-y-1 mb-4">
          <p className="font-body font-light" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.35)' }}>
            {collection.productCount || collection.productIds?.length || 0} products
          </p>
          {collection.season && (
            <p className="font-body font-light" style={{ fontSize: '10px', color: 'rgba(26,18,8,0.35)' }}>
              Season: {collection.season}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <button onClick={onEdit} className="btn-ghost flex-1" style={{ fontSize: '9px', padding: '8px' }}>
            Edit
          </button>
          <button onClick={onToggleLive} className="btn-ghost flex-1" style={{ fontSize: '9px', padding: '8px' }}>
            {collection.isLive ? 'Hide' : 'Go Live'}
          </button>
          <button onClick={onToggleFeatured} className="btn-ghost flex-1" style={{ fontSize: '9px', padding: '8px' }}>
            {collection.isFeatured ? 'Unfeature' : 'Feature'}
          </button>
          <button onClick={onDelete} className="btn-ghost" style={{ fontSize: '9px', padding: '8px', color: 'rgba(160,80,80,0.7)' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function CollectionModal({ collection, products, onClose, onSave }: any) {
  const [form, setForm] = useState(
    collection ?? {
      name: '',
      slug: '',
      tagline: '',
      description: '',
      shortDescription: '',
      heroImage: '',
      thumbnailImage: '',
      productIds: [],
      isLive: false,
      isFeatured: false,
      season: '',
      displayOrder: 0,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Auto-generate slug if empty
    if (!form.slug) {
      form.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }
    
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-[rgba(26,18,8,0.6)] flex items-center justify-center z-50 p-5" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-[#F7F3ED] max-w-[700px] w-full max-h-[90vh] overflow-y-auto p-10 relative">
        <button onClick={onClose} className="absolute top-5 right-5" style={{ fontSize: '24px', color: 'rgba(26,18,8,0.3)' }}>
          ×
        </button>

        <h2 className="font-display font-light text-[#1A1208] mb-8" style={{ fontSize: '32px' }}>
          {collection ? 'Edit Collection' : 'Create Collection'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Basic Information</p>
            
            <div className="space-y-5">
              <FormField
                label="Collection Name"
                value={form.name}
                onChange={(v: string) => setForm({ ...form, name: v })}
                placeholder="Winter Essentials 2026"
                required
              />

              <FormField
                label="Slug (URL)"
                value={form.slug}
                onChange={(v: string) => setForm({ ...form, slug: v })}
                placeholder="winter-essentials-2026 (auto-generated if empty)"
              />

              <FormField
                label="Tagline"
                value={form.tagline}
                onChange={(v: string) => setForm({ ...form, tagline: v })}
                placeholder="Core pieces for everyday wear"
              />

              <FormField
                label="Season"
                value={form.season}
                onChange={(v: string) => setForm({ ...form, season: v })}
                placeholder="Winter 2026"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Descriptions</p>
            
            <div className="space-y-5">
              <div>
                <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
                  Short Description <span style={{ color: 'rgba(160,80,80,0.6)' }}>*</span>
                </p>
                <textarea
                  required
                  value={form.shortDescription}
                  onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="A brief 1-2 sentence description..."
                  rows={2}
                  className="w-full bg-transparent border p-3 outline-none resize-none"
                  style={{
                    borderColor: 'rgba(26,18,8,0.2)',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    color: '#1A1208',
                  }}
                />
              </div>

              <div>
                <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
                  Full Description <span style={{ color: 'rgba(160,80,80,0.6)' }}>*</span>
                </p>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed description of the collection..."
                  rows={4}
                  className="w-full bg-transparent border p-3 outline-none resize-none"
                  style={{
                    borderColor: 'rgba(26,18,8,0.2)',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    color: '#1A1208',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Images</p>
            
            <div className="space-y-5">
              <FormField
                label="Hero Image URL"
                value={form.heroImage}
                onChange={(v: string) => setForm({ ...form, heroImage: v })}
                placeholder="https://..."
              />

              <FormField
                label="Thumbnail Image URL"
                value={form.thumbnailImage}
                onChange={(v: string) => setForm({ ...form, thumbnailImage: v })}
                placeholder="https://..."
              />

              {/* Image Preview */}
              {form.heroImage && (
                <div>
                  <p className="overline mb-2" style={{ color: 'rgba(26,18,8,0.35)' }}>Preview</p>
                  <div className="relative bg-[#EDE7DC]" style={{ aspectRatio: '4/3', maxWidth: '300px' }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url('${form.heroImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Assignment */}
          <div className="pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.1)' }}>
            <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.4)' }}>
              Assign Products ({form.productIds.length} selected)
            </p>
            <div className="max-h-[200px] overflow-y-auto border p-4 space-y-2" style={{ borderColor: 'rgba(26,18,8,0.15)' }}>
              {products.map((product: any) => (
                <label key={product._id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.productIds.includes(product._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm({ ...form, productIds: [...form.productIds, product._id] })
                      } else {
                        setForm({ ...form, productIds: form.productIds.filter((id: string) => id !== product._id) })
                      }
                    }}
                  />
                  <span className="font-body font-light" style={{ fontSize: '12px' }}>
                    {product.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <p className="overline mb-4" style={{ color: 'rgba(26,18,8,0.4)' }}>Settings</p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isLive}
                  onChange={e => setForm({ ...form, isLive: e.target.checked })}
                />
                <span className="font-body font-light" style={{ fontSize: '12px' }}>
                  Make live immediately
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                />
                <span className="font-body font-light" style={{ fontSize: '12px' }}>
                  Feature on homepage
                </span>
              </label>

              <FormField
                label="Display Order"
                type="number"
                value={form.displayOrder.toString()}
                onChange={(v: string) => setForm({ ...form, displayOrder: parseInt(v) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button type="submit" className="btn-primary flex-1">
              <span>{collection ? 'Save Changes' : 'Create Collection'}</span>
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, required, type = 'text' }: any) {
  return (
    <div>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
        {label} {required && <span style={{ color: 'rgba(160,80,80,0.6)' }}>*</span>}
      </p>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b outline-none"
        style={{
          borderColor: 'rgba(26,18,8,0.2)',
          padding: '12px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '14px',
          color: '#1A1208',
        }}
      />
    </div>
  )
}