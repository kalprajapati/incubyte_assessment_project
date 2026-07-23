import { useState, useCallback, useRef } from 'react';
import vehicleService from '../services/vehicle.service';

const INITIAL_PAGINATION = { total: 0, page: 1, limit: 12, totalPages: 1 };

/**
 * useVehicleSearch
 *
 * Manages search state, debounced API calls, pagination, and errors.
 * Returns everything the UI needs to render search results.
 */
export function useVehicleSearch() {
  const [vehicles,   setVehicles]   = useState([]);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // AbortController ref — cancels in-flight requests when a new search fires
  const abortRef = useRef(null);

  const search = useCallback(async (filters, page = 1) => {
    // Cancel any previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const result = await vehicleService.search({ ...filters, page, limit: 12 });
      setVehicles(result.vehicles);
      setPagination(result.pagination);
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return; // aborted — ignore
      setError(err.friendlyMessage || 'Failed to fetch vehicles. Please try again.');
      setVehicles([]);
      setPagination(INITIAL_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setVehicles([]);
    setPagination(INITIAL_PAGINATION);
    setHasSearched(false);
    setError('');
    setLoading(false);
  }, []);

  return { vehicles, pagination, loading, error, hasSearched, search, reset };
}
