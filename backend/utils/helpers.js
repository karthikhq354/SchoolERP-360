const buildPaginationMeta = (total, page, limit) => {
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    total,
    page: currentPage,
    limit: itemsPerPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

const buildQueryFilter = (params = {}) => {
  const filter = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== 'all' && value !== '') {
      filter[key] = value;
    }
  }
  return filter;
};

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  if (now.getMonth() >= 3) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
};

const sanitize = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$')) {
      delete obj[key];
    } else {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;
};

module.exports = {
  buildPaginationMeta,
  buildQueryFilter,
  formatDate,
  getCurrentAcademicYear,
  sanitize,
};