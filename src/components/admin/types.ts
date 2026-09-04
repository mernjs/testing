/** A Lead as it crosses the Server -> Client boundary (ObjectId stringified). */
export interface SerializedLead {
  _id: string;
  category: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  subService?: string;
  status?: string;
  notes?: string;
  resume?: { storageKey: string; filename: string; contentType: string; size: number };
  source?: string;
  createdAt: string;
  updatedAt: string;
}
