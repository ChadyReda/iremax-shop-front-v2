import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '@/services'
import { fmt, fmtDate, statusBadge, cap } from '@/utils'
import { Spinner } from '@/components/ui/Spinner'
import { Pager } from '@/components/ui/Pagination'
import { toast } from '@/components/ui/Toast'
import { errMsg } from '@/services/api'
import { Search, X, Phone } from 'lucide-react'

const STATUSES = [
  '',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

export default function AdminOrders() {
  const [page,   setPage]   = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey:        ['admin-orders', page, status, search],
    queryFn:         () =>
      orderApi.adminList({
        page,
        limit:  15,
        ...(status && { status }),
        ...(search && { search }),
      }),
    placeholderData: (p) => p,
  })

  const statusM = useMutation({
    mutationFn: ({ id, s }: { id: string; s: string }) =>
      orderApi.updateStatus(id, s),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      toast('Status updated', 'success')
    },
    onError: (e) => toast(errMsg(e), 'error'),
  })

  if (isLoading) return <Spinner full />

  return (
    <div className="p-4 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
          className="text-3xl font-normal"
        >
          Orders
        </h1>
        {data && (
          <p className="text-stone-400 text-sm mt-1">
            {data.pagination.total} total
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 border border-stone-200 bg-white px-3 flex-1 min-w-[200px]">
          <Search size={14} className="text-stone-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Order # or email…"
            className="flex-1 py-2.5 text-sm outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={13} className="text-stone-400" />
            </button>
          )}
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="input py-2.5 text-sm w-44 appearance-none"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? cap(s) : 'All Statuses'}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              {[
                'Order #',
                'Date',
                'Customer',
                'Phone',
                'Address',
                'Items',
                'Total',
                'Status',
                'Update',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-stone-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {data?.data.map((o) => (
              <tr key={o.id} className="hover:bg-stone-50">

                {/* Order # */}
                <td className="px-4 py-3 font-mono text-xs font-medium text-stone-900 whitespace-nowrap">
                  {o.orderNumber}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">
                  {fmtDate(o.createdAt)}
                </td>

                {/* Customer */}
                <td className="px-4 py-3 text-stone-700 font-medium text-xs">
                  {typeof o.user === 'object' && o.user
                    ? o.user.firstName + ' ' + o.user.lastName
                    : o.guestEmail || 'Guest'}
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  {o.shippingAddress?.phone ? (
                    <a
                      href={"tel:" + o.shippingAddress.phone}
                      className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap"
                    >
                      <Phone size={11} />
                      {o.shippingAddress.phone}
                    </a>
                  ) : (
                    <span className="text-stone-300 text-xs">—</span>
                  )}
                </td>

                {/* Address */}
                <td className="px-4 py-3 text-xs max-w-[150px]">
                  {o.shippingAddress ? (
                    <div>
                      <p className="font-medium text-stone-800">
                        {o.shippingAddress.city}
                      </p>
                      <p className="text-stone-400 truncate">
                        {o.shippingAddress.street}
                      </p>
                    </div>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>

                {/* Items */}
                <td className="px-4 py-3 text-stone-600 text-xs">
                  <div className="flex flex-col gap-0.5">
                    {o.items.slice(0, 2).map((item, i) => (
                      <span
                        key={i}
                        className="truncate max-w-[120px] block text-stone-500"
                      >
                        {item.name}
                      </span>
                    ))}
                    {o.items.length > 2 && (
                      <span className="text-stone-400">
                        +{o.items.length - 2} more
                      </span>
                    )}
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 py-3 font-semibold text-stone-900 whitespace-nowrap">
                  {fmt(o.total)}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={statusBadge(o.status)}>
                    {cap(o.status)}
                  </span>
                </td>

                {/* Update */}
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      statusM.mutate({ id: o.id, s: e.target.value })
                    }
                    disabled={statusM.isPending}
                    className="input text-xs py-1.5 appearance-none w-32"
                  >
                    {STATUSES.filter(Boolean).map((s) => (
                      <option key={s} value={s}>{cap(s)}</option>
                    ))}
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        {!data?.data.length && (
          <div className="p-10 text-center text-stone-400 text-sm">
            No orders found.
          </div>
        )}
      </div>

      {data?.pagination && (
        <Pager p={data.pagination} onChange={setPage} />
      )}

    </div>
  )
}