export type Capsules = Capsule[];

export interface Capsule {
  reuse_count: number;
  water_landings: number;
  land_landings: number;
  last_update?: string;
  launches: string[];
  serial: string;
  status: string;
  type: string;
  id: string;
}
