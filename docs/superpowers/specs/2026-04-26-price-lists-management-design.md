# Price Lists Management Module — Backend API Design

**Date:** 2026-04-26
**Scope:** Full rebuild of the Price Lists backend module via refactor-in-place
**Approach:** Refactor existing files to match codebase conventions (DDD / Modular Clean Architecture), add use cases, and implement CSV import

---

## 1. Prisma Schema (No Changes)

The existing `PriceList` and `PriceListItem` models in `modules/prisma/schema.prisma` are already correct:

- `PriceList`: id (UUID), name, status (string, default "active"), companyId, createdAt, updatedAt
- `PriceListItem`: id (UUID), priceListId, productId, defaultPrice (Decimal), customPrice (Decimal), createdAt, updatedAt
- Composite unique constraint: `@@unique([priceListId, productId])`
- Cascade delete on items when list is deleted
- Both mapped to `@@schema("inventory")`

No schema changes required.

---

## 2. Domain Layer

### 2.1 PriceListEntity

**File:** `modules/inventory/src/lib/domain/entities/price-list.entity.ts`

Refactor existing entity to add:
- Static `create()` factory method — validates name is non-empty
- `updateDetails(data)` method — updates name and/or status
- `activate()` / `deactivate()` convenience methods

Constructor signature (unchanged):
```
PriceListEntity(id, companyId, name, status, items[], createdAt, updatedAt)
```

**PriceListItemEntity** stays as-is: `(id, priceListId, productId, defaultPrice, customPrice)`

### 2.2 IPriceListRepository

**File:** `modules/inventory/src/lib/domain/repositories/price-list.repository.interface.ts`

Extend existing interface with two new methods:

| Method | Purpose |
|--------|---------|
| `findItemsByPriceListId(priceListId: string): Promise<PriceListItemEntity[]>` | Fetch items for a price list (for GET /:id/items) |
| `upsertItems(priceListId: string, items: { productId: string; customPrice: number; defaultPrice: number }[]): Promise<number>` | Bulk upsert items within a Prisma transaction, returns count of upserted rows |

Existing methods remain unchanged: `findAll`, `findById`, `create`, `update`, `delete`, `addItemToPriceList`, `removeItemFromPriceList`.

---

## 3. Application Layer

### 3.1 Use Cases

All use cases live in `modules/inventory/src/lib/application/use-cases/price-lists/`.

Each follows the established pattern: `@Injectable()`, constructor with `@Inject(TOKEN)` for repository interfaces, `execute()` method.

#### CreatePriceListUseCase
- **Input:** `CreatePriceListDto`, `companyId: string`
- **Output:** `PriceListEntity`
- **Logic:** Call `PriceListEntity.create()` with `randomUUID()`, delegate to `repository.create()`

#### UpdatePriceListUseCase
- **Input:** `id: string`, `UpdatePriceListDto`, `companyId: string`
- **Output:** `PriceListEntity`
- **Logic:** Verify price list exists via `findById()`, throw if not found, delegate to `repository.update()`

#### GetPriceListsUseCase
- **Input:** `companyId: string`
- **Output:** `PriceListEntity[]`
- **Logic:** Delegate to `repository.findAll(companyId)`

#### AddProductToPriceListUseCase
- **Input:** `priceListId: string`, `AddPriceListItemDto`, `companyId: string`
- **Output:** `{ success: true }`
- **Logic:**
  1. Verify product exists via `IProductRepository.findById()`
  2. Look up product's base price for `defaultPrice`
  3. Call `repository.addItemToPriceList()` (upserts if already exists)

#### RemoveProductFromPriceListUseCase
- **Input:** `priceListId: string`, `productId: string`, `companyId: string`
- **Output:** `{ success: true }`
- **Logic:** Delegate to `repository.removeItemFromPriceList()`

#### ImportCsvToPriceListUseCase
- **Input:** `priceListId: string`, `file: Express.Multer.File`, `companyId: string`
- **Output:** `{ imported: number; skipped: { row: number; sku: string; reason: string }[] }`
- **Dependencies:** `CsvParserService`, `IProductRepository`, `IPriceListRepository`
- **Logic:**
  1. Parse CSV file buffer via `CsvParserService.parse()`
  2. Validate required columns: `sku`, `price`
  3. For each row:
     - Look up product by SKU via `IProductRepository.findBySku(sku, companyId)`
     - If not found, add to skipped list with reason "Product not found"
     - If price is invalid (NaN, negative), add to skipped list
     - If found, add to import list with `{ productId, customPrice: row.price, defaultPrice: product.price }`
  4. Bulk upsert all valid items via `repository.upsertItems()`
  5. Return imported count and skipped rows

### 3.2 DTOs

**File:** `modules/inventory/src/lib/application/dtos/price-list.dto.ts`

Add to existing DTOs:

```
AddPriceListItemDto {
  @IsString() productId: string
  @IsNumber() @Min(0) @Type(() => Number) customPrice: number
}
```

Existing `CreatePriceListDto`, `UpdatePriceListDto`, `PriceListItemDto` remain.

---

## 4. Infrastructure Layer

### 4.1 CsvParserService

**New file:** `modules/inventory/src/lib/infrastructure/services/csv-parser.service.ts`

- `@Injectable()` NestJS service
- Dependency: `papaparse` (npm package, to be installed)
- Method: `parse(buffer: Buffer): { sku: string; price: number }[]`
- Behavior:
  - Uses `papaparse.parse()` with `header: true`
  - Maps column headers case-insensitively (`SKU`, `Sku`, `sku` all match)
  - Filters out rows with empty SKU
  - Converts price to number, filters NaN
  - Returns array of valid `{ sku, price }` tuples

### 4.2 PriceListRepository Extensions

**File:** `modules/inventory/src/lib/infrastructure/repositories/price-list.repository.ts`

Add implementations for:

#### `findItemsByPriceListId(priceListId)`
```
prisma.priceListItem.findMany({
  where: { priceListId },
  include: { product: { select: { id, name, sku } } }
})
```
Map to `PriceListItemEntity[]`.

#### `upsertItems(priceListId, items)`
Use `prisma.$transaction()` with array of `prisma.priceListItem.upsert()` calls:
- Where: `{ priceListId_productId: { priceListId, productId } }`
- Create: full item data
- Update: `{ customPrice, defaultPrice }`
Return count of upserted items.

---

## 5. Presentation Layer

### 5.1 Controller Refactoring

**File:** `modules/inventory/src/lib/presentation/controllers/price-lists.controller.ts`

Complete rewrite to match codebase conventions:

- Class decorators: `@ApiTags('Price Lists')`, `@ApiBearerAuth()`, `@UseGuards(JwtAuthGuard, PermissionGuard)`, `@Controller('inventory/price-lists')`
- Inject use cases (not repository directly) for create, update, add-item, remove-item, import-csv
- Inject `IPriceListRepository` via `@Inject(PRICE_LIST_REPOSITORY)` for simple reads/deletes
- Add `@RequirePermission('inventory.price-lists.<action>')` on each endpoint
- Use `@CurrentUser('companyId')` for tenant isolation

#### Endpoints

| Method | Path | Handler | Permission |
|--------|------|---------|------------|
| GET | `/` | `findAll()` | `inventory.price-lists.view` |
| POST | `/` | `create()` | `inventory.price-lists.create` |
| GET | `/:id` | `findOne()` | `inventory.price-lists.view` |
| PUT | `/:id` | `update()` | `inventory.price-lists.edit` |
| DELETE | `/:id` | `remove()` | `inventory.price-lists.delete` |
| GET | `/:id/items` | `getItems()` | `inventory.price-lists.view` |
| POST | `/:id/items` | `addItem()` | `inventory.price-lists.edit` |
| DELETE | `/:id/items/:productId` | `removeItem()` | `inventory.price-lists.edit` |
| POST | `/:id/import-csv` | `importCsv()` | `inventory.price-lists.edit` |

The `importCsv()` endpoint uses `@UseInterceptors(FileInterceptor('file'))` and `@UploadedFile()` decorator to accept multipart/form-data.

---

## 6. Module Registration

**File:** `modules/inventory/src/lib/inventory.module.ts`

Changes:
- Add all 6 use cases to `providers[]`
- Add `CsvParserService` to `providers[]`
- Remove redundant direct `PriceListRepository` class registration (keep only `{ provide: PRICE_LIST_REPOSITORY, useClass: PriceListRepository }`)
- Controller is already registered

---

## 7. Dependencies

Install `papaparse` and its types:
```
pnpm add papaparse
pnpm add -D @types/papaparse
```

---

## 8. CSV Import Format

Expected CSV format (2 columns):
```csv
sku,price
PROD-001,25.99
PROD-002,18.50
```

- Headers are case-insensitive
- Rows with missing SKU or invalid price are skipped
- Products matched by SKU within the user's company
- Product's base price is used as `defaultPrice`
- Import result returns `{ imported: number, skipped: { row, sku, reason }[] }`

---

## 9. File Map

| File | Action |
|------|--------|
| `modules/prisma/schema.prisma` | No change |
| `modules/inventory/src/lib/domain/entities/price-list.entity.ts` | Refactor — add factory, methods |
| `modules/inventory/src/lib/domain/repositories/price-list.repository.interface.ts` | Extend — add 2 methods |
| `modules/inventory/src/lib/application/dtos/price-list.dto.ts` | Extend — add AddPriceListItemDto |
| `modules/inventory/src/lib/application/use-cases/price-lists/create-price-list.use-case.ts` | New |
| `modules/inventory/src/lib/application/use-cases/price-lists/update-price-list.use-case.ts` | New |
| `modules/inventory/src/lib/application/use-cases/price-lists/get-price-lists.use-case.ts` | New |
| `modules/inventory/src/lib/application/use-cases/price-lists/add-product-to-price-list.use-case.ts` | New |
| `modules/inventory/src/lib/application/use-cases/price-lists/remove-product-from-price-list.use-case.ts` | New |
| `modules/inventory/src/lib/application/use-cases/price-lists/import-csv-to-price-list.use-case.ts` | New |
| `modules/inventory/src/lib/infrastructure/services/csv-parser.service.ts` | New |
| `modules/inventory/src/lib/infrastructure/repositories/price-list.repository.ts` | Extend — add 2 methods |
| `modules/inventory/src/lib/presentation/controllers/price-lists.controller.ts` | Rewrite — conventions + CSV endpoint |
| `modules/inventory/src/lib/inventory.module.ts` | Update — register use cases + service |
