'use client'
import { adminApi } from '@/lib/api'
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'

type Variant = { size: string; color: string; stock: number }
type ProductImage = { url: string; alt: string; color: string; position: number; isPrimary: boolean }

type Product = {
  _id?: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  compareAtPrice: number
  costPrice: number
  shortFabricNote: string
  editorialLine: string
  lowStockThreshold: number
  variants: Variant[]
  images: ProductImage[]
  details: { fabric: string; weight: string; fit: string; features: string[]; care: string[] }
  fitInfo: { height: string; chest: string; wearing: string }
  socialProof: { rating: number; reviewsCount: number; testimonials: string[] }
  technicalSpecs: { garmentCode: string; fabricOrigin: string; season: string }
  featured: boolean
  status: 'draft' | 'published'
  createdAt?: string
  updatedAt?: string
}

const CATEGORY_OPTIONS = ['Essentials', 'Premium', 'Archive', 'Outerwear', 'Bottoms', 'Accessories']

const emptyForm: Product = {
  name: '',
  slug: '',
  description: '',
  category: 'Essentials',
  price: 0,
  compareAtPrice: 0,
  costPrice: 0,
  shortFabricNote: '',
  editorialLine: '',
  lowStockThreshold: 5,
  variants: [],
  images: [{ url: '', alt: '', color: '', position: 0, isPrimary: true }],
  details: { fabric: '', weight: '', fit: '', features: [], care: [] },
  fitInfo: { height: '', chest: '', wearing: '' },
  socialProof: { rating: 4.8, reviewsCount: 0, testimonials: [] },
  technicalSpecs: { garmentCode: '', fabricOrigin: '', season: '' },
  featured: false,
  status: 'draft',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await adminApi.get('/products')
        if (!Array.isArray(data)) return
        setProducts(data.map(normalizeProduct))
      } catch {
        setProducts([])
      }
    })()
  }, [])

  const filteredProducts = useMemo(
    () => products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  )

  const allSelected = filteredProducts.length > 0 && filteredProducts.every(p => p._id && selectedIds.includes(p._id))

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([])
      return
    }
    setSelectedIds(filteredProducts.map(p => p._id).filter(Boolean) as string[])
  }

  const toggleOne = (id?: string) => {
    if (!id) return
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const handleDelete = async (id?: string) => {
    if (!id || !confirm('Delete this product?')) return
    await adminApi.delete(`/products/${id}`)

    setProducts(prev => prev.filter(p => p._id !== id))
    setSelectedIds(prev => prev.filter(x => x !== id))
  }

  const bulkUpdate = async (action: 'publish' | 'feature' | 'delete') => {
    const selected = products.filter(p => p._id && selectedIds.includes(p._id))
    if (!selected.length) return
    const token = localStorage.getItem('noxr_admin_token')

    if (action === 'delete' && !confirm(`Delete ${selected.length} products?`)) return

    for (const product of selected) {
      if (!product._id) continue
      if (action === 'delete') {
        await adminApi.delete(`/products/${product._id}`)

      } else {
        const payload =
          action === 'publish'
            ? { ...product, status: 'published' as const }
            : { ...product, featured: true }

        await adminApi.put(`/products/${product._id}`, payload)
      }
    }

    if (action === 'delete') {
      setProducts(prev => prev.filter(p => !p._id || !selectedIds.includes(p._id)))
    } else {
      setProducts(prev =>
        prev.map(p => {
          if (!p._id || !selectedIds.includes(p._id)) return p
          return action === 'publish' ? { ...p, status: 'published' } : { ...p, featured: true }
        }),
      )
    }
    setSelectedIds([])
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10">
        <div className="max-w-[2000px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 pb-4 border-b border-[rgba(26,18,8,0.08)] gap-3">
            <div>
              <p className="overline text-[rgba(26,18,8,0.4)] text-[8px]">Inventory</p>
              <h1 className="font-display font-light text-[clamp(32px,6vw,48px)] tracking-[-0.02em] text-[#1A1208] leading-none">Products</h1>
              <p className="text-[10px] text-[rgba(26,18,8,0.35)] mt-1">{filteredProducts.length} products</p>
            </div>
            <button className="btn-primary text-[9px]" onClick={() => setShowCreateModal(true)}>
              <span>+ Create</span>
            </button>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white/50 border border-[rgba(26,18,8,0.08)] rounded-lg">
              <span className="text-[9px] text-[rgba(26,18,8,0.5)] tracking-wide uppercase self-center">{selectedIds.length} selected</span>
              <button className="btn-ghost text-[8px] px-3 py-1" onClick={() => bulkUpdate('publish')}>Publish</button>
              <button className="btn-ghost text-[8px] px-3 py-1" onClick={() => bulkUpdate('feature')}>Feature</button>
              <button className="btn-ghost text-[8px] px-3 py-1" onClick={() => bulkUpdate('delete')}>Delete</button>
            </div>
          )}

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-[360px] bg-transparent border-b border-[rgba(26,18,8,0.2)] pb-2 mb-4 text-[12px] focus:outline-none focus:border-[#1A1208] transition"
          />

          <div className="bg-white/40 backdrop-blur-sm border border-[rgba(26,18,8,0.08)] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-[#F1EBE3] border-b border-[rgba(26,18,8,0.08)]">
                  <th className="overline text-[7px] p-3 text-left w-8"></th>
                  <th className="overline text-[7px] p-3 text-left min-w-[200px]">Product</th>
                  <th className="overline text-[7px] p-3 text-left min-w-[90px]">Category</th>
                  <th className="overline text-[7px] p-3 text-left min-w-[80px]">Price</th>
                  <th className="overline text-[7px] p-3 text-left min-w-[100px]">Variants</th>
                  <th className="overline text-[7px] p-3 text-left min-w-[60px]">Stock</th>
                  <th className="overline text-[7px] p-3 text-left min-w-[90px]">Status</th>
                  <th className="overline text-[7px] p-3 text-right min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => {
                  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
                  const colorCount = new Set(p.variants.map(v => v.color)).size
                  const sizeCount = new Set(p.variants.map(v => v.size)).size
                  return (
                    <tr key={p._id || i} className="border-t border-[rgba(26,18,8,0.06)] hover:bg-white/30 transition">
                      <td className="p-3">
                        <input type="checkbox" checked={Boolean(p._id && selectedIds.includes(p._id))} onChange={() => toggleOne(p._id)} className="cursor-pointer" />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-12 bg-[#EDE7DC] rounded overflow-hidden flex-shrink-0">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1A1208] text-[11px] truncate">{p.name}</p>
                            <p className="text-[9px] text-[rgba(26,18,8,0.35)] truncate">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-[10px] text-[rgba(26,18,8,0.6)]">{p.category}</td>
                      <td className="p-3 text-[10px] font-medium whitespace-nowrap">₨{p.price.toLocaleString()}</td>
                      <td className="p-3 text-[9px] text-[rgba(26,18,8,0.5)]">{colorCount}c · {sizeCount}s</td>
                      <td className="p-3 text-[10px] font-medium">{totalStock}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-[8px] tracking-[0.2em] uppercase rounded-full whitespace-nowrap ${
                          p.status === 'published' ? 'bg-[#E6EFE8] text-[#2F5E3B]' : 'bg-[#F3EAE3] text-[#7A5C46]'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button className="btn-ghost text-[8px] px-2 py-1 mr-1" onClick={() => setEditingProduct(p)}>Edit</button>
                        <button className="btn-ghost text-[8px] px-2 py-1" onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="cursor-pointer" />
            <span className="text-[10px] text-[rgba(26,18,8,0.5)]">Select all visible</span>
          </div>

          {showCreateModal && (
            <ProductModal
              mode="create"
              allProducts={products}
              onClose={() => setShowCreateModal(false)}
              onSave={async form => {
                const token = localStorage.getItem('noxr_admin_token')
                const payload = prepareForSave(form)
                const res = await adminApi.post('/products', payload)
                
                if (!res.ok) return alert('Failed to create product (slug may already exist).')
                const created = normalizeProduct(await res.json())
                setProducts(prev => [created, ...prev])
                setShowCreateModal(false)
              }}
            />
          )}

          {editingProduct && (
            <ProductModal
              mode="edit"
              product={editingProduct}
              allProducts={products}
              onClose={() => setEditingProduct(null)}
              onSave={async form => {
                const token = localStorage.getItem('noxr_admin_token')
                const payload = prepareForSave(form)
                const res = await adminApi.put(`/products/${editingProduct._id}`, payload)
                
                if (!res.ok) return alert('Failed to update product (slug may already exist).')
                const updated = normalizeProduct(await res.json())
                setProducts(prev => prev.map(p => (p._id === updated._id ? updated : p)))
                setEditingProduct(null)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ProductModal({ mode, product, allProducts, onClose, onSave }: { mode: 'create' | 'edit'; product?: Product; allProducts: Product[]; onClose: () => void; onSave: (product: Product) => void }) {
  const [form, setForm] = useState<Product>(product || emptyForm)
  const [sizesInput, setSizesInput] = useState((product ? [...new Set(product.variants.map(v => v.size))] : ['S', 'M', 'L', 'XL']).join('\n'))
  const [colorsInput, setColorsInput] = useState((product ? [...new Set(product.variants.map(v => v.color))] : ['Black']).join('\n'))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!product) return
    setForm(product)
  }, [product])

  useEffect(() => {
    if (mode === 'create' && form.name && !form.slug) {
      setForm(prev => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [form.name, form.slug, mode])

  useEffect(() => {
    const sizes = lines(sizesInput)
    const colors = lines(colorsInput).map(normalizeColor)
    setForm(prev => {
      const prevMap = new Map(prev.variants.map(v => [`${normalizeColor(v.color)}__${v.size}`, v.stock]))
      const next: Variant[] = []
      for (const color of colors) {
        for (const size of sizes) {
          next.push({ color, size, stock: prevMap.get(`${color}__${size}`) ?? 0 })
        }
      }
      return { ...prev, variants: next, images: prev.images.map(i => ({ ...i, color: i.color ? normalizeColor(i.color) : '' })) }
    })
  }, [sizesInput, colorsInput])

  const sizes = lines(sizesInput)
  const colors = lines(colorsInput).map(normalizeColor)

  const setStock = (color: string, size: string, stock: number) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map(v => (v.color === color && v.size === size ? { ...v, stock } : v)),
    }))
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,18,8,0.58)', backdropFilter: 'blur(7px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 60 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#F7F3ED', width: 'min(1120px, 100%)', maxHeight: '92vh', overflowY: 'auto', border: '0.5px solid rgba(26,18,8,0.1)', boxShadow: '0 26px 58px rgba(26,18,8,0.16)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
          <div>
            <p className="overline" style={{ color: 'rgba(26,18,8,0.45)', marginBottom: 8 }}>Product Editor</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 6 }}>{mode === 'create' ? 'Create Product' : 'Edit Product'}</h2>
            <p style={{ fontSize: 12, color: 'rgba(26,18,8,0.46)' }}>All product fields are preserved exactly; only presentation is refined.</p>
          </div>
          <button type="button" className="btn-ghost" style={{ fontSize: 10 }} onClick={onClose}>Close</button>
        </div>
        {error ? <p style={{ color: 'rgba(160,80,80,0.92)', fontSize: 11, background: 'rgba(160,80,80,0.07)', border: '0.5px solid rgba(160,80,80,0.22)', padding: '9px 10px', borderRadius: 8, marginBottom: 8 }}>{error}</p> : null}

        <form
          onSubmit={e => {
            e.preventDefault()
            const v = validate(form, allProducts)
            if (v) {
              setError(v)
              return
            }
            setError('')
            onSave(form)
          }}
          style={{ display: 'grid', gap: 14 }}
        >
          <Section title="Basic Information">
            <Grid>
              <Field label="Product Name"><input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))} required /></Field>
              <Field label="Slug"><input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: slugify(e.target.value) }))} required /></Field>
              <Field label="Category"><select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>{CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></Field>
              <Field label="Price"><input type="number" min={0} value={form.price} onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} /></Field>
              <Field label="Compare at price"><input type="number" min={0} value={form.compareAtPrice} onChange={e => setForm(prev => ({ ...prev, compareAtPrice: Number(e.target.value) }))} /></Field>
              <Field label="Cost price"><input type="number" min={0} value={form.costPrice} onChange={e => setForm(prev => ({ ...prev, costPrice: Number(e.target.value) }))} /></Field>
              <Field label="Short Fabric Note"><input value={form.shortFabricNote} onChange={e => setForm(prev => ({ ...prev, shortFabricNote: e.target.value }))} /></Field>
              <Field label="Editorial Line"><input value={form.editorialLine} onChange={e => setForm(prev => ({ ...prev, editorialLine: e.target.value }))} /></Field>
              <Field label="Low stock threshold"><input type="number" min={1} value={form.lowStockThreshold} onChange={e => setForm(prev => ({ ...prev, lowStockThreshold: Number(e.target.value) || 5 }))} /></Field>
            </Grid>
            <Field label="Full Description"><textarea rows={4} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} /></Field>
            <Grid>
              <Field label="Featured"><select value={String(form.featured)} onChange={e => setForm(prev => ({ ...prev, featured: e.target.value === 'true' }))}><option value="false">No</option><option value="true">Yes</option></select></Field>
              <Field label="Status"><select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Product['status'] }))}><option value="draft">Draft</option><option value="published">Published</option></select></Field>
            </Grid>
          </Section>

          <Section title="Variant Matrix">
            <Grid>
              <Field label="Sizes (one per line)"><textarea rows={4} value={sizesInput} onChange={e => setSizesInput(e.target.value)} /></Field>
              <Field label="Colors (one per line)"><textarea rows={4} value={colorsInput} onChange={e => setColorsInput(e.target.value)} /></Field>
            </Grid>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse' }}>
                <thead><tr><th style={th}>Color</th>{sizes.map(s => <th key={s} style={th}>{s}</th>)}</tr></thead>
                <tbody>
                  {colors.map(c => (
                    <tr key={c}>
                      <td style={td}>{displayColor(c)}</td>
                      {sizes.map(s => (
                        <td key={`${c}-${s}`} style={td}><input type="number" min={0} value={form.variants.find(v => v.color === c && v.size === s)?.stock ?? 0} onChange={e => setStock(c, s, Number(e.target.value))} style={{ width: 86 }} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Image Management">
            {form.images.map((img, i) => (
              <Grid key={i}>
                <Field label={`Image URL ${i + 1}`}><input value={img.url} onChange={e => setForm(prev => ({ ...prev, images: prev.images.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)) }))} /></Field>
                <Field label="Alt text"><input value={img.alt} onChange={e => setForm(prev => ({ ...prev, images: prev.images.map((x, idx) => (idx === i ? { ...x, alt: e.target.value } : x)) }))} /></Field>
                <Field label="Color"><select value={img.color} onChange={e => setForm(prev => ({ ...prev, images: prev.images.map((x, idx) => (idx === i ? { ...x, color: normalizeColor(e.target.value) } : x)) }))}><option value="">Select color</option>{colors.map(c => <option key={c} value={c}>{displayColor(c)}</option>)}</select></Field>
                <Field label="Position"><input type="number" min={0} value={img.position} onChange={e => setForm(prev => ({ ...prev, images: prev.images.map((x, idx) => (idx === i ? { ...x, position: Number(e.target.value) } : x)) }))} /></Field>
                <Field label="Primary"><select value={String(img.isPrimary)} onChange={e => setForm(prev => ({ ...prev, images: prev.images.map((x, idx) => (idx === i ? { ...x, isPrimary: e.target.value === 'true' } : x)) }))}><option value="false">No</option><option value="true">Yes</option></select></Field>
              </Grid>
            ))}
            <button type="button" className="btn-ghost" onClick={() => setForm(prev => ({ ...prev, images: [...prev.images, { url: '', alt: '', color: colors[0] || '', position: prev.images.length, isPrimary: false }] }))}>+ Add image</button>
          </Section>

          <Section title="Details">
            <Grid>
              <Field label="Fabric"><input value={form.details.fabric} onChange={e => setForm(prev => ({ ...prev, details: { ...prev.details, fabric: e.target.value } }))} /></Field>
              <Field label="Weight"><input value={form.details.weight} onChange={e => setForm(prev => ({ ...prev, details: { ...prev.details, weight: e.target.value } }))} /></Field>
              <Field label="Fit"><input value={form.details.fit} onChange={e => setForm(prev => ({ ...prev, details: { ...prev.details, fit: e.target.value } }))} /></Field>
            </Grid>
            <Grid>
              <Field label="Features (one per line)"><textarea rows={4} value={form.details.features.join('\n')} onChange={e => setForm(prev => ({ ...prev, details: { ...prev.details, features: lines(e.target.value) } }))} /></Field>
              <Field label="Care instructions (one per line)"><textarea rows={4} value={form.details.care.join('\n')} onChange={e => setForm(prev => ({ ...prev, details: { ...prev.details, care: lines(e.target.value) } }))} /></Field>
            </Grid>
          </Section>

          <Section title="Fit Information">
            <Grid>
              <Field label="Model Height"><input value={form.fitInfo.height} onChange={e => setForm(prev => ({ ...prev, fitInfo: { ...prev.fitInfo, height: e.target.value } }))} /></Field>
              <Field label="Model Chest"><input value={form.fitInfo.chest} onChange={e => setForm(prev => ({ ...prev, fitInfo: { ...prev.fitInfo, chest: e.target.value } }))} /></Field>
              <Field label="Model Wearing Size"><input value={form.fitInfo.wearing} onChange={e => setForm(prev => ({ ...prev, fitInfo: { ...prev.fitInfo, wearing: e.target.value } }))} /></Field>
            </Grid>
          </Section>

          <Section title="Social Proof">
            <Grid>
              <Field label="Rating"><input type="number" step="0.1" value={form.socialProof.rating} onChange={e => setForm(prev => ({ ...prev, socialProof: { ...prev.socialProof, rating: Number(e.target.value) } }))} /></Field>
              <Field label="Reviews count"><input type="number" value={form.socialProof.reviewsCount} onChange={e => setForm(prev => ({ ...prev, socialProof: { ...prev.socialProof, reviewsCount: Number(e.target.value) } }))} /></Field>
            </Grid>
            <Field label="Testimonials (one per line)"><textarea rows={4} value={form.socialProof.testimonials.join('\n')} onChange={e => setForm(prev => ({ ...prev, socialProof: { ...prev.socialProof, testimonials: lines(e.target.value) } }))} /></Field>
          </Section>

          <Section title="Technical Specifications">
            <Grid>
              <Field label="Garment Code"><input value={form.technicalSpecs.garmentCode} onChange={e => setForm(prev => ({ ...prev, technicalSpecs: { ...prev.technicalSpecs, garmentCode: e.target.value } }))} /></Field>
              <Field label="Fabric Origin"><input value={form.technicalSpecs.fabricOrigin} onChange={e => setForm(prev => ({ ...prev, technicalSpecs: { ...prev.technicalSpecs, fabricOrigin: e.target.value } }))} /></Field>
              <Field label="Season"><input value={form.technicalSpecs.season} onChange={e => setForm(prev => ({ ...prev, technicalSpecs: { ...prev.technicalSpecs, season: e.target.value } }))} /></Field>
            </Grid>
          </Section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 6, borderTop: '0.5px solid rgba(26,18,8,0.08)' }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{mode === 'create' ? 'Create Product' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ background: 'rgba(255,255,255,0.38)', border: '0.5px solid rgba(26,18,8,0.08)', borderRadius: 10, padding: '14px 14px 12px' }}>
      <p className="overline" style={{ marginBottom: 10, color: 'rgba(26,18,8,0.42)' }}>{title}</p>
      <div style={{ display: 'grid', gap: 10 }}>{children}</div>
    </section>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>{children}</div>
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span className="overline" style={{ color: 'rgba(26,18,8,0.42)' }}>{label}</span>
      {children}
    </label>
  )
}

const th: CSSProperties = { textAlign: 'left', padding: 8, borderBottom: '0.5px solid rgba(26,18,8,0.1)' }
const td: CSSProperties = { padding: 8, borderBottom: '0.5px solid rgba(26,18,8,0.06)' }

function lines(value: string) {
  return value.split('\n').map(s => s.trim()).filter(Boolean)
}
function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}
function normalizeColor(value: string) {
  return value.trim().toLowerCase()
}
function displayColor(value: string) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function validate(form: Product, allProducts: Product[]) {
  if (form.price <= 0) return 'Price must be greater than 0.'
  if (form.costPrice > form.price) return 'Cost price cannot be greater than selling price.'
  if (!form.slug.trim()) return 'Slug is required.'

  const duplicate = allProducts.find(p => p.slug === form.slug && p._id !== form._id)
  if (duplicate) return 'Slug already exists. Please use a unique slug.'

  if (!form.variants.length) return 'At least 1 color and 1 size are required.'
  if (form.variants.some(v => Number.isNaN(v.stock) || v.stock < 0)) return 'All variant stock numbers must exist.'

  const normalizedColors = [...new Set(form.variants.map(v => normalizeColor(v.color)).filter(Boolean))]
  if (!normalizedColors.length) return 'At least 1 color is required.'

  const validImages = form.images.filter(i => i.url.trim())
  if (!validImages.length) return 'At least 1 image is required.'

  for (const img of validImages) {
    if (!img.color) return 'Every image URL must have a mapped color.'
    if (!normalizedColors.includes(normalizeColor(img.color))) return 'Image color must exist in color list.'
  }

  for (const color of normalizedColors) {
    const colorImages = validImages.filter(i => normalizeColor(i.color) === color)
    if (!colorImages.length) return `At least 1 image is required for color ${displayColor(color)}.`
  }

  if (form.status === 'published') {
    if (!form.description.trim()) return 'Description is required before publishing.'
    if (!form.variants.some(v => v.stock > 0)) return 'At least 1 variant with stock > 0 is required to publish.'
  }

  return ''
}

function prepareForSave(form: Product): Product {
  const normalizedVariants = form.variants.map(v => ({ ...v, color: normalizeColor(v.color) }))
  const cleanedImages = form.images
    .filter(i => i.url.trim())
    .map((i, idx) => ({
      ...i,
      color: normalizeColor(i.color),
      alt: i.alt || `${form.name} ${displayColor(i.color)}`,
      position: Number.isFinite(i.position) ? i.position : idx,
      isPrimary: Boolean(i.isPrimary),
    }))

  const grouped = new Map<string, ProductImage[]>()
  for (const img of cleanedImages) {
    const key = normalizeColor(img.color)
    grouped.set(key, [...(grouped.get(key) || []), img])
  }

  const finalImages: ProductImage[] = []
  for (const [color, items] of grouped.entries()) {
    const sorted = [...items].sort((a, b) => a.position - b.position)
    const hasPrimary = sorted.some(i => i.isPrimary)
    sorted.forEach((img, idx) => {
      finalImages.push({ ...img, color, position: idx, isPrimary: hasPrimary ? img.isPrimary : idx === 0 })
    })
  }

  return { ...form, variants: normalizedVariants, images: finalImages }
}

function normalizeProduct(raw: any): Product {
  return {
    _id: raw._id,
    name: raw.name || '',
    slug: raw.slug || slugify(raw.name || ''),
    description: raw.description || '',
    category: CATEGORY_OPTIONS.includes(raw.category) ? raw.category : 'Essentials',
    price: Number(raw.price || 0),
    compareAtPrice: Number(raw.compareAtPrice || 0),
    costPrice: Number(raw.costPrice || 0),
    shortFabricNote: raw.shortFabricNote || '',
    editorialLine: raw.editorialLine || '',
    lowStockThreshold: Number(raw.lowStockThreshold || 5),
    variants: Array.isArray(raw.variants) ? raw.variants.map((v: any) => ({ ...v, color: normalizeColor(v.color || '') })) : [],
    images: (raw.images || []).map((img: any, idx: number) => ({
      url: img.url || '',
      alt: img.alt || '',
      color: normalizeColor(img.color || ''),
      position: Number.isFinite(img.position) ? img.position : idx,
      isPrimary: Boolean(img.isPrimary),
    })),
    details: {
      fabric: raw.details?.fabric || '',
      weight: raw.details?.weight || '',
      fit: raw.details?.fit || '',
      features: Array.isArray(raw.details?.features) ? raw.details.features : [],
      care: Array.isArray(raw.details?.care) ? raw.details.care : [],
    },
    fitInfo: { height: raw.fitInfo?.height || '', chest: raw.fitInfo?.chest || '', wearing: raw.fitInfo?.wearing || '' },
    socialProof: {
      rating: Number(raw.socialProof?.rating ?? 4.8),
      reviewsCount: Number(raw.socialProof?.reviewsCount ?? 0),
      testimonials: Array.isArray(raw.socialProof?.testimonials) ? raw.socialProof.testimonials : [],
    },
    technicalSpecs: {
      garmentCode: raw.technicalSpecs?.garmentCode || '',
      fabricOrigin: raw.technicalSpecs?.fabricOrigin || '',
      season: raw.technicalSpecs?.season || '',
    },
    featured: Boolean(raw.featured),
    status: raw.status === 'published' ? 'published' : 'draft',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

function formatDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
}