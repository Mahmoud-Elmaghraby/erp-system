import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

export function getPaginationParams(dto: PaginationDto) {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}