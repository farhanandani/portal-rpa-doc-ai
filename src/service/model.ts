import { z } from "zod";

// SortDirection
const SortDirectionSchema = z.enum(["asc", "desc"]);

// SortBy
export const SortBySchema = z.object({
  property: z.string(),
  direction: SortDirectionSchema,
});

// Links
export const LinksSchema = z.object({
  current: z.string(),
});

// Filter
const FilterSchema = z.object({});

// Meta
export const MetaSchema = z.object({
  currentPage: z.number().optional(),
  offset: z.number().optional(),
  itemsPerPage: z.number().optional(),
  unpaged: z.boolean().optional(),
  totalPages: z.number().optional(),
  totalItems: z.number().optional(),
  sortBy: z.array(z.unknown()).optional(),
  filter: FilterSchema.optional(),
});

export type SortDirection = z.infer<typeof SortDirectionSchema>;
export type SortBy = z.infer<typeof SortBySchema>;
