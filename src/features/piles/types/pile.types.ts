export interface PileListItem {
  id_pile: string;
  id_greenhouse: string;
  code: string;
  name?: string | null;
  process_start_date: string;
  estimated_end_date?: string | null;
  status: string;
  created_at: string;
  assigned_device_code?: string | null;
}

export interface PileDetail extends PileListItem {
  base_material?: string | null;
  notes?: string | null;
}

export interface CreatePilePayload {
  id_greenhouse: string;
  code: string;
  name?: string;
  process_start_date: string;
  estimated_end_date?: string;
  base_material?: string;
  notes?: string;
}

export interface UpdatePilePayload {
  name?: string;
  process_start_date?: string;
  estimated_end_date?: string;
  status?: string;
  base_material?: string;
  notes?: string;
}

export interface PaginatedPileResponse {
  items: PileListItem[];
  total: number;
}
