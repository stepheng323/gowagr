import { SelectQueryBuilder } from 'kysely';
import { PaginationParams, PaginationResult } from 'src/types';


export async function paginate<T>({
  queryBuilder,
  pagination,
  identifier,
}: {
  identifier: string;
  pagination: PaginationParams;
  queryBuilder: SelectQueryBuilder<any, any, any>;
}): Promise<PaginationResult<T>> {
  const { page = 1 } = pagination;

  const limit = Math.min(pagination.limit || 10, 20);
  const offset = (page - 1) * limit;

  const dataQuery = queryBuilder.offset(offset).limit(limit);

  const countQuery = queryBuilder
    .clearSelect()
    .clearOrderBy()
    .select((qb) => qb.fn.count(identifier).as('count'));

  const [data, totalResult] = await Promise.all([
    dataQuery.execute(),
    countQuery.executeTakeFirst(),
  ]);

  const total = totalResult ? parseInt(totalResult.count as string, 10) : 0;
  return {
    data,
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  };
}
