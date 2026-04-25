import { useState } from 'react';

export function usePaginacao(limitePadrao = 10) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitePadrao);

  function prev() { setPage(p => Math.max(1, p - 1)); }
  function next(totalPages: number) { setPage(p => Math.min(totalPages, p + 1)); }
  
  return { page, setPage, limit, setLimit, prev, next };
}
