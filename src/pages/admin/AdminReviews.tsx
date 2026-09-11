import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { fetchAllReviews, approveReview, deleteReview } from '../../services/reviews';

export default function AdminReviews() {
  const { products } = useData();
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      addToast({ type: 'error', title: 'Could not load reviews', message: 'Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      addToast({ type: 'success', title: 'Approved', message: 'Review is now live.' });
    } catch (err) {
      console.error('Failed to approve:', err);
      addToast({ type: 'error', title: 'Failed', message: 'Could not approve review.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      addToast({ type: 'success', title: 'Deleted', message: 'Review removed.' });
    } catch (err) {
      console.error('Failed to delete:', err);
      addToast({ type: 'error', title: 'Failed', message: 'Could not delete review.' });
    }
  };

  const filteredReviews = reviews.filter(r =>
    statusFilter === 'all' || r.status === statusFilter
  );

  const productName = (productId: string) => {
    const p = products.find(p => p.id === productId);
    return p?.name || productId;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ivory p-8 border border-stone-200">
        <div>
          <h2 className="font-heading text-2xl text-stone-800 tracking-wide uppercase">Client Reflections</h2>
          <p className="text-micro tracking-[0.3em] text-stone-600 uppercase mt-1">Moderate & curate customer reviews</p>
        </div>
      </div>

      <div className="bg-ivory border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'approved'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-4 py-2 text-micro tracking-widest uppercase font-bold transition-all border",
                  statusFilter === s ? "border-gold text-gold" : "border-stone-200 text-stone-600 hover:border-gold hover:text-gold"
                )}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Product</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Author</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Rating</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Comment</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Photo</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Status</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Date</th>
                <th className="px-8 py-4 text-micro tracking-widest text-stone-600 uppercase font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-12 text-center text-stone-500">
                    {isLoading ? <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" /> : 'No reviews match this filter.'}
                  </td>
                </tr>
              ) : (
                filteredReviews.map(r => (
                  <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <Link to={`/product/${r.productId}`} className="text-xs font-bold text-stone-800 uppercase tracking-widest hover:text-gold transition-colors">
                        {productName(r.productId)}
                      </Link>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-micro text-stone-800 font-medium">{r.name}</p>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={cn("w-3 h-3", star <= r.rating ? "text-gold fill-gold" : "text-stone-200")} />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-4 max-w-xs truncate">
                      <p className="text-sm text-stone-600 italic">"{r.comment}"</p>
                    </td>
                    <td className="px-8 py-4">
                      {r.photoUrl ? (
                        <img src={r.photoUrl} alt={`${r.name}'s photo`} className="w-12 h-12 object-cover border border-stone-200" loading="lazy" />
                      ) : (
                        <span className="text-micro text-stone-500 italic">—</span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <span className={cn(
                        "px-3 py-1 text-micro tracking-widest uppercase font-bold rounded",
                        r.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      )}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-micro text-stone-600">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="px-3 py-1.5 bg-gold text-white text-micro tracking-widest uppercase font-bold hover:bg-gold-dark transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="px-3 py-1.5 border border-rose-200 text-rose-500 text-micro tracking-widest uppercase font-bold hover:bg-rose-50 hover:border-rose-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}