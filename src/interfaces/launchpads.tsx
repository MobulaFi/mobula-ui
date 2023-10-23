export interface ILaunchpad {
  launchpad_id: number;
  name: string;
  logo: string;
  current_roi: number;
  real_roi: number;
  ath_roi: number;
  ido_count: number;
  raised_30d: number;
  total_raised: number;
  total_roi_usd: number;
  blockchains: string[];
}
