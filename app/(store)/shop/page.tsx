'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface Variant {
  size: string
  color: string
  stock: number
}

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  category: string
  images: { url: string }[]
  variants: Variant[]
}

const CATEGORIES = ['All', 'Essentials', 'Premium', 'Archive'] as const
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
const COLORS = [
  { name: 'Black', hex: '#1A1208' },
  { name: 'White', hex: '#F7F3ED' },
  { name: 'Beige', hex: '#D4C5B0' },
  { name: 'Brown', hex: '#6B5644' },
  { name: 'Navy', hex: '#1F2937' },
] as const

type Category = (typeof CATEGORIES)[number]
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  
  // Filters
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products')
        const data = await res.json()

        if (Array.isArray(data)) {
          setProducts(data)
          const prices = data.map((p: Product) => p.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setPriceRange([minPrice, maxPrice])
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter(p => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false
      if (selectedSizes.length > 0) {
        const productSizes = p.variants?.map(v => v.size) || []
        if (!selectedSizes.some(size => productSizes.includes(size))) return false
      }
      if (selectedColors.length > 0) {
        const productColors = p.variants?.map(v => v.color) || []
        if (!selectedColors.some(color => productColors.includes(color))) return false
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      // if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      return 0
    })

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const clearFilters = () => {
    setActiveCategory('All')
    setSortBy('featured')
    setSelectedSizes([])
    setSelectedColors([])
    const prices = products.map(p => p.price)
    setPriceRange([Math.min(...prices), Math.max(...prices)])
  }

  const activeFiltersCount = 
    (activeCategory !== 'All' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="font-display font-light text-[#1A1208]" style={{ fontSize: '64px', letterSpacing: '-0.02em', opacity: 0.08 }}>
          NOXR
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(26,18,8,0.06)', paddingTop: '100px', paddingBottom: '32px' }}>
        <div className="max-w-[1600px] mx-auto px-5 md:px-12" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease' }}>
          
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link href="/" className="font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)', textDecoration: 'none' }}>
              Home
            </Link>
            <span className="mx-2" style={{ fontSize: '9px', color: 'rgba(26,18,8,0.15)' }}>/</span>
            <span className="font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.5)' }}>
              Shop
            </span>
          </div>

          <div className="flex justify-between items-end">
            <h1 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(48px, 10vw, 88px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
              Shop Now!
            </h1>
            
            {/* Desktop Sort */}
            <div className="hidden lg:block">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent border-b outline-none pr-8"
                style={{
                  borderColor: 'rgba(26,18,8,0.15)',
                  padding: '8px 0',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '10px',
                  fontWeight: 300,
                  letterSpacing: '0.15em',
                  color: 'rgba(26,18,8,0.5)',
                  cursor: 'pointer',
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Bar (sticky) */}
      <div className="lg:hidden sticky top-[60px] z-40 bg-[rgba(247,243,237,0.97)] backdrop-blur-xl border-b" style={{ borderColor: 'rgba(26,18,8,0.06)' }}>
        <div className="px-5 py-4 flex justify-between items-center">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 border px-4 py-2"
            style={{
              borderColor: 'rgba(26,18,8,0.15)',
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 300,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center" style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#1A1208', color: '#F7F3ED', fontSize: '9px' }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="font-body font-light" style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(26,18,8,0.4)' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
          </span>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-[1600px] mx-auto px-5 md:px-12 py-8 lg:py-12">
        <div className="flex gap-12">
          
          {/* Desktop Sidebar Filters (always visible) */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                selectedColors={selectedColors}
                toggleColor={toggleColor}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onClear={clearFilters}
                resultsCount={filteredProducts.length}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            
            {/* Results Count - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-8 pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.06)' }}>
              <span className="font-body font-light" style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(26,18,8,0.35)' }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
              </span>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-body font-light"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: 'rgba(26,18,8,0.4)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-16">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-24">
                <h2 className="font-display font-light text-[#1A1208] mb-3" style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>
                  No pieces found
                </h2>
                <p className="font-body font-light mb-6" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)' }}>
                  Try adjusting your filters
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <MobileFilterDrawer
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
          selectedColors={selectedColors}
          toggleColor={toggleColor}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onClose={() => setShowMobileFilters(false)}
          onClear={clearFilters}
          resultsCount={filteredProducts.length}
        />
      )}
    </div>
  )
}

// Desktop Sidebar Filters
function FilterSidebar({ activeCategory, setActiveCategory, sortBy, setSortBy, selectedSizes, toggleSize, selectedColors, toggleColor, priceRange, setPriceRange, onClear, resultsCount }: any) {
  return (
    <div>
      
      {/* Collection */}
      <FilterSection title="Collection">
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="w-full text-left py-2 font-body font-light"
              style={{
                fontSize: '12px',
                color: activeCategory === cat ? '#1A1208' : 'rgba(26,18,8,0.4)',
                fontWeight: activeCategory === cat ? 400 : 300,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className="py-2 border font-body font-light text-center"
              style={{
                fontSize: '11px',
                borderColor: selectedSizes.includes(size) ? '#1A1208' : 'rgba(26,18,8,0.15)',
                backgroundColor: selectedSizes.includes(size) ? '#1A1208' : 'transparent',
                color: selectedSizes.includes(size) ? '#F7F3ED' : 'rgba(26,18,8,0.6)',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="py-2">
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full"
            style={{ accentColor: '#1A1208' }}
          />
          <div className="flex justify-between mt-3">
            <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.5)' }}>
              PKR {priceRange[0].toLocaleString()}
            </span>
            <span className="font-body font-light" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.5)' }}>
              PKR {priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Colour */}
      <FilterSection title="Colour">
        <div className="space-y-2">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className="w-full flex items-center gap-3 py-1"
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color.hex,
                  border: `1px solid ${selectedColors.includes(color.name) ? '#1A1208' : 'rgba(26,18,8,0.15)'}`,
                  outline: selectedColors.includes(color.name) ? '2px solid #1A1208' : 'none',
                  outlineOffset: '2px',
                }}
              />
              <span className="font-body font-light" style={{ fontSize: '12px', color: selectedColors.includes(color.name) ? '#1A1208' : 'rgba(26,18,8,0.5)' }}>
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear Button */}
      <button
        onClick={onClear}
        className="w-full mt-6 py-3 border font-body font-light"
        style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.5)',
          borderColor: 'rgba(26,18,8,0.15)',
        }}
      >
        Clear Filters
      </button>
    </div>
  )
}

function FilterSection({ title, children }: any) {
  return (
    <div className="mb-8 pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.06)' }}>
      <h3 className="font-body font-light mb-4" style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.5)' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

// Mobile Filter Drawer (same as before)
function MobileFilterDrawer({ activeCategory, setActiveCategory, sortBy, setSortBy, selectedSizes, toggleSize, selectedColors, toggleColor, priceRange, setPriceRange, onClose, onClear, resultsCount }: any) {
  return (
    <>
      <div className="fixed inset-0 bg-[rgba(26,18,8,0.4)] z-50" onClick={onClose} style={{ animation: 'fadeIn 0.3s ease' }} />
      
      <div className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-[#F7F3ED] z-50 overflow-y-auto" style={{ animation: 'slideInRight 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
        
        <div className="sticky top-0 bg-[#F7F3ED] border-b px-6 py-5 flex justify-between items-center" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <h2 className="font-body font-light" style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Filters
          </h2>
          <button onClick={onClose} style={{ fontSize: '28px', color: 'rgba(26,18,8,0.4)' }}>×</button>
        </div>

        <div className="p-6">
          <MobileFilterSection number="01" title="Sort By">
            <div className="space-y-1">
              {[
                { value: 'featured', label: 'Featured' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'newest', label: 'Newest' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="w-full text-left py-3 font-body font-light"
                  style={{
                    fontSize: '13px',
                    color: sortBy === option.value ? '#1A1208' : 'rgba(26,18,8,0.4)',
                    fontWeight: sortBy === option.value ? 400 : 300,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </MobileFilterSection>

          <MobileFilterSection number="02" title="Size">
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className="py-3 border font-body font-light"
                  style={{
                    fontSize: '12px',
                    borderColor: selectedSizes.includes(size) ? '#1A1208' : 'rgba(26,18,8,0.15)',
                    backgroundColor: selectedSizes.includes(size) ? '#1A1208' : 'transparent',
                    color: selectedSizes.includes(size) ? '#F7F3ED' : 'rgba(26,18,8,0.6)',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </MobileFilterSection>

          <MobileFilterSection number="03" title="Price">
            <div className="py-4">
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full"
                style={{ accentColor: '#1A1208' }}
              />
              <div className="flex justify-between mt-4">
                <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.5)' }}>
                  PKR {priceRange[0].toLocaleString()}
                </span>
                <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.5)' }}>
                  PKR {priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </MobileFilterSection>

          <MobileFilterSection number="04" title="Colour">
            <div className="space-y-3">
              {COLORS.map(color => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className="w-full flex items-center gap-3 py-2"
                >
                  <div style={{ width: '24px', height: '24px', backgroundColor: color.hex, border: `1px solid ${selectedColors.includes(color.name) ? '#1A1208' : 'rgba(26,18,8,0.15)'}`, outline: selectedColors.includes(color.name) ? '2px solid #1A1208' : 'none', outlineOffset: '2px' }} />
                  <span className="font-body font-light" style={{ fontSize: '13px', color: selectedColors.includes(color.name) ? '#1A1208' : 'rgba(26,18,8,0.5)' }}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </MobileFilterSection>

          <MobileFilterSection number="05" title="Collection">
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full text-left py-3 font-body font-light"
                  style={{
                    fontSize: '13px',
                    color: activeCategory === cat ? '#1A1208' : 'rgba(26,18,8,0.4)',
                    fontWeight: activeCategory === cat ? 400 : 300,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </MobileFilterSection>
        </div>

        <div className="sticky bottom-0 bg-[#F7F3ED] border-t p-6 space-y-3" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <button onClick={onClose} className="btn-primary w-full text-center" style={{ padding: '14px' }}>
            <span>View Results ({resultsCount})</span>
          </button>
          <button onClick={() => { onClear(); onClose() }} className="btn-ghost w-full text-center" style={{ padding: '14px' }}>
            Clear Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  )
}

function MobileFilterSection({ number, title, children }: any) {
  return (
    <div className="mb-8 pb-6 border-b" style={{ borderColor: 'rgba(26,18,8,0.06)' }}>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-body font-light" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(26,18,8,0.25)' }}>
          [{number}]
        </span>
        <h3 className="font-body font-light" style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.6)' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

function ProductCard({ product, index }: any) {
  const { ref, inView } = useInView()
  const [hovered, setHovered] = useState(false)

  const totalStock = product.variants?.reduce((sum: number, v: Variant) => sum + (v.stock || 0), 0) || 0
  const isOutOfStock = totalStock === 0

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(30px)',
        transition: `all 0.9s ease ${(index % 3) * 0.08}s`,
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="block group"
        style={{ textDecoration: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '3/4', backgroundColor: '#EDE7DC' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${product.images?.[0]?.url || ''}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: isOutOfStock ? 'brightness(0.75) saturate(0.4)' : 'brightness(0.95) saturate(0.85)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 1.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(26,18,8,0.25)' }}>
              <span className="overline" style={{ color: '#F7F3ED', fontSize: '8px' }}>Sold Out</span>
            </div>
          )}
        </div>

        <p className="overline mb-2" style={{ color: 'rgba(26,18,8,0.3)' }}>{product.category}</p>
        <div className="flex justify-between items-baseline gap-3">
          <h3 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(15px, 3vw, 18px)' }}>
            {product.name}
          </h3>
          <span className="font-body font-light flex-shrink-0" style={{ fontSize: '11px', color: 'rgba(26,18,8,0.45)' }}>
            PKR {product.price?.toLocaleString()}
          </span>
        </div>
      </Link>
    </div>
  )
}